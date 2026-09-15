import { HangarError } from '../errors.js';
import { buildApiUrl, withJsonBody, parseErrorBody, extractErrorMessage } from '../utils/request.js';
import type { ApiSession } from '../types/index.js';
import type { HangarClientOptions } from '../types/base.js';

const DEFAULT_BASE_URL = 'https://hangar.papermc.io';
const DEFAULT_TIMEOUT_MS = 10_000;
const TOKEN_EXPIRY_BUFFER_MS = 5_000;

interface TokenCache {
  token: string;
  expiresAt: number;
}

/** Options passed to individual request methods. */
export interface RequestOptions {
  query?: object;
  body?: BodyInit | object | object[] | null;
  method?: string;
  headers?: HeadersInit;
  /** If true, attach a JWT authorization header. Defaults to false. */
  authenticated?: boolean;
}

/** Low-level HTTP client used internally by all API namespace classes. */
export class HangarClientCore {
  readonly #baseUrl: string;
  readonly #apiKey: string | undefined;
  readonly #timeoutMs: number;
  readonly #userAgent: string | undefined;
  readonly #fetch: typeof globalThis.fetch;
  #tokenCache: TokenCache | null = null;

  constructor(options: HangarClientOptions = {}) {
    this.#baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.#apiKey = options.apiKey;
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.#userAgent = options.userAgent;
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  /** Sends a request and parses the response body as JSON. */
  async requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.#send(path, options);
    return response.json() as Promise<T>;
  }

  /** Sends a request and returns the response body as a string. */
  async requestText(path: string, options: RequestOptions = {}): Promise<string> {
    const response = await this.#send(path, options);
    return response.text();
  }

  /** Sends a request and discards the response body. */
  async requestVoid(path: string, options: RequestOptions = {}): Promise<void> {
    await this.#send(path, options);
  }

  /** Sends a request and returns the response body as an ArrayBuffer. */
  async requestArrayBuffer(path: string, options: RequestOptions = {}): Promise<ArrayBuffer> {
    const response = await this.#send(path, options);
    return response.arrayBuffer();
  }

  async #getToken(): Promise<string> {
    const now = Date.now();

    if (this.#tokenCache && this.#tokenCache.expiresAt - now > TOKEN_EXPIRY_BUFFER_MS) {
      return this.#tokenCache.token;
    }

    if (!this.#apiKey) {
      throw new HangarError('Authentication required but no apiKey was provided');
    }

    const url = buildApiUrl(this.#baseUrl, `v1/authenticate`, { apiKey: this.#apiKey });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeoutMs);

    let response: Response;
    try {
      response = await this.#fetch(url, {
        method: 'POST',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const body = await parseErrorBody(response);
      throw new HangarError(extractErrorMessage(body, response.status), {
        status: response.status,
        response,
        body,
      });
    }

    const session = (await response.json()) as ApiSession;
    this.#tokenCache = {
      token: session.token,
      expiresAt: now + session.expiresIn,
    };

    return session.token;
  }

  async #send(path: string, options: RequestOptions): Promise<Response> {
    const { query, body, method = body != null ? 'POST' : 'GET', headers: extraHeaders, authenticated = false } = options;

    const url = buildApiUrl(this.#baseUrl, path, query);
    const init = withJsonBody({ method, body, headers: new Headers(extraHeaders) });

    if (this.#userAgent) {
      (init.headers as Headers).set('User-Agent', this.#userAgent);
    }

    if (authenticated) {
      const token = await this.#getToken();
      (init.headers as Headers).set('Authorization', `HangarAuth ${token}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeoutMs);

    let response: Response;
    try {
      response = await this.#fetch(url, { ...init, signal: controller.signal });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new HangarError(`Request timed out after ${this.#timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const responseBody = await parseErrorBody(response);
      throw new HangarError(extractErrorMessage(responseBody, response.status), {
        status: response.status,
        response,
        body: responseBody,
      });
    }

    return response;
  }
}
