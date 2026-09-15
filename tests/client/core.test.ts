import { describe, it, expect, afterEach } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { jsonResponse, errorResponse } from '../utils/http.js';
import { HangarError } from '../../src/errors.js';
import { HangarClient } from '../../src/client/hangar.js';

const MOCK_SESSION = { token: 'test-jwt', expiresIn: 3_600_000 };

describe('HangarClientCore authentication', () => {
  it('fetches a JWT before making an authenticated request', async () => {
    const { client, mockFetch } = createTestClient([
      jsonResponse(MOCK_SESSION),
      jsonResponse([]),
    ]);
    await client.keys.list('TestUser');
    expect(mockFetch.callCount()).toBe(2);
    expect(mockFetch.calls[0].url).toContain('/api/v1/authenticate');
    expect(mockFetch.calls[1].headers.get('Authorization')).toBe('HangarAuth test-jwt');
  });

  it('reuses a cached JWT for subsequent authenticated requests', async () => {
    const { client, mockFetch } = createTestClient([
      jsonResponse(MOCK_SESSION),
      jsonResponse([]),
      jsonResponse([]),
    ]);
    await client.keys.list('TestUser');
    await client.keys.list('TestUser');
    expect(mockFetch.callCount()).toBe(3);
    expect(mockFetch.calls[0].url).toContain('/api/v1/authenticate');
  });

  it('throws HangarError on non-ok response', async () => {
    const { client } = createTestClient([errorResponse(401)]);
    await expect(client.platforms.list()).rejects.toThrow(HangarError);
  });

  it('throws HangarError with message from response body', async () => {
    const { client } = createTestClient([errorResponse(403, { message: 'Forbidden' })]);
    try {
      await client.platforms.list();
    } catch (err) {
      expect(err).toBeInstanceOf(HangarError);
      expect((err as HangarError).message).toBe('Forbidden');
      expect((err as HangarError).status).toBe(403);
    }
  });
});

describe('HangarClientCore default fetch binding', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('invokes the default globalThis.fetch with a `this` receiver it accepts', async () => {
    // Simulates a browser's branded fetch, which throws "Illegal invocation" if `this` isn't `window`.
    globalThis.fetch = function () {
      if (this !== globalThis) {
        throw new TypeError("Failed to execute 'fetch' on 'Window': Illegal invocation");
      }
      return Promise.resolve(jsonResponse({}));
    } as typeof fetch;

    const client = new HangarClient();

    await expect(client.platforms.list()).resolves.toEqual({});
  });
});
