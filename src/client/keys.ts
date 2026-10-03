import type { HangarClientCore } from './core.js';
import type { ApiKey, CreateApiKeyForm } from '../types/index.js';

/** API namespace for managing API keys. */
export class KeysApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Lists all API keys of the currently authenticated user. Requires edit_api_keys permission. */
  list(): Promise<ApiKey[]> {
    return this.core.requestJson<ApiKey[]>('v1/keys', { authenticated: true });
  }

  /** Creates a new API key for the currently authenticated user and returns the key. Requires edit_api_keys permission. */
  create(form: CreateApiKeyForm): Promise<string> {
    return this.core.requestText('v1/keys', {
      method: 'POST',
      body: form,
      authenticated: true,
    });
  }

  /** Deletes an API key of the currently authenticated user by name. Requires edit_api_keys permission. */
  delete(name: string): Promise<void> {
    return this.core.requestVoid('v1/keys', {
      method: 'DELETE',
      query: { name },
      authenticated: true,
    });
  }
}
