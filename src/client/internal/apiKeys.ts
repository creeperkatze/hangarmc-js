import type { HangarClientCore } from '../core.js';
import type { ApiKey, NamedPermission, ProjectNamespace } from '../../types/index.js';

/** Form for creating an API key. */
export interface CreateAPIKeyForm {
  name: string;
  permissions: NamedPermission[];
  /** Point in time at which the key stops working. Omit for a key that never expires. */
  expiresAt?: string;
  /** Slugs of the projects the key may be used on (max 100). Omit to allow all projects. */
  projects?: string[];
}

/** A project an API key can be scoped to. */
export interface ScopableProject {
  name: string;
  namespace: ProjectNamespace;
  avatarUrl: string;
}

/** A plain string payload. */
export interface StringContent {
  content: string;
}

/** Internal API namespace for managing API keys. */
export class InternalApiKeysApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Checks whether a key name is available for a user. */
  checkKeyName(user: string, name: string): Promise<void> {
    return this.core.requestVoid(
      `internal/api-keys/check-key/${encodeURIComponent(user)}`,
      { query: { name } },
    );
  }

  /** Creates an API key for a user and returns the key string. */
  createApiKey(user: string, form: CreateAPIKeyForm): Promise<string> {
    return this.core.requestText(
      `internal/api-keys/create-key/${encodeURIComponent(user)}`,
      { method: 'POST', body: form },
    );
  }

  /** Deletes an API key for a user. */
  deleteApiKey(user: string, content: StringContent): Promise<void> {
    return this.core.requestVoid(
      `internal/api-keys/delete-key/${encodeURIComponent(user)}`,
      { method: 'POST', body: content },
    );
  }

  /** Returns all API keys for a user. */
  getApiKeys(user: string): Promise<ApiKey[]> {
    return this.core.requestJson<ApiKey[]>(
      `internal/api-keys/existing-keys/${encodeURIComponent(user)}`,
    );
  }

  /** Returns all permissions that can be assigned to an API key for a user. */
  getPossiblePermissions(user: string): Promise<NamedPermission[]> {
    return this.core.requestJson<NamedPermission[]>(
      `internal/api-keys/possible-perms/${encodeURIComponent(user)}`,
    );
  }

  /** Returns all projects an API key for a user can be scoped to. */
  getPossibleProjects(user: string): Promise<ScopableProject[]> {
    return this.core.requestJson<ScopableProject[]>(
      `internal/api-keys/possible-projects/${encodeURIComponent(user)}`,
    );
  }
}