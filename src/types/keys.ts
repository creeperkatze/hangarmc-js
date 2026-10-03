import type { NamedPermission } from './permissions.js';
import type { ProjectNamespace } from './projects.js';

/** An API key registered for a user. */
export interface ApiKey {
  name: string;
  createdAt: string;
  lastUsed?: string;
  /** The time the key stops working, if it was created with an expiration date. */
  expiresAt?: string | null;
  tokenIdentifier: string;
  permissions: NamedPermission[];
  /** Whether the key may only be used on the projects listed in `projects`. */
  projectScoped: boolean;
  /** The projects the key is limited to, empty unless the key is project scoped. */
  projects: ProjectNamespace[];
}

/** Request body for creating a new API key. */
export interface CreateApiKeyForm {
  name: string;
  permissions: NamedPermission[];
  /** Point in time at which the key stops working. Omit for a key that never expires. */
  expiresAt?: string;
  /** Slugs of the projects the key may be used on (max 100). Omit to allow all projects. */
  projects?: string[];
}
