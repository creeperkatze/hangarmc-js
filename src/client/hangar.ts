import { HangarClientCore } from './core.js';
import { AuthApi } from './auth.js';
import { KeysApi } from './keys.js';
import { PagesApi } from './pages.js';
import { PermissionsApi } from './permissions.js';
import { PlatformsApi } from './platforms.js';
import { ProjectsApi } from './projects.js';
import { UsersApi } from './users.js';
import { VersionsApi } from './versions.js';
import {
  InternalAdminApi,
  InternalApiKeysApi,
  InternalAuthApi,
  InternalChannelsApi,
  InternalDataApi,
  InternalDiscoveryApi,
  InternalFlagsApi,
  InternalGlobalDataApi,
  InternalHealthApi,
  InternalJarScanningApi,
  InternalNotificationsApi,
  InternalOAuthApi,
  InternalOnboardingApi,
  InternalOrganizationsApi,
  InternalPagesApi,
  InternalProjectsApi,
  InternalReviewsApi,
  InternalUsersApi,
  InternalVersionsApi,
} from './internal/index.js';
import type { HangarClientOptions } from '../types/base.js';

/** Grouped internal API namespaces. These endpoints are undocumented, unstable, and intended for the Hangar frontend. */
export interface InternalApis {
  readonly admin: InternalAdminApi;
  readonly apiKeys: InternalApiKeysApi;
  readonly auth: InternalAuthApi;
  readonly channels: InternalChannelsApi;
  readonly data: InternalDataApi;
  readonly discovery: InternalDiscoveryApi;
  readonly flags: InternalFlagsApi;
  readonly globalData: InternalGlobalDataApi;
  readonly health: InternalHealthApi;
  readonly jarScanning: InternalJarScanningApi;
  readonly notifications: InternalNotificationsApi;
  readonly oauth: InternalOAuthApi;
  readonly onboarding: InternalOnboardingApi;
  readonly organizations: InternalOrganizationsApi;
  readonly pages: InternalPagesApi;
  readonly projects: InternalProjectsApi;
  readonly reviews: InternalReviewsApi;
  readonly users: InternalUsersApi;
  readonly versions: InternalVersionsApi;
}

/**
 * Client for the Hangar plugin marketplace API.
 * @example
 * ```ts
 * import HangarClient from 'hangarmc-js';
 * const client = new HangarClient({ apiKey: 'your-api-key' });
 * const project = await client.projects.get('PaperMC', 'Hangar');
 * ```
 */
export class HangarClient {
  readonly #core: HangarClientCore;

  // Public v1 API namespaces
  readonly auth: AuthApi;
  readonly keys: KeysApi;
  readonly pages: PagesApi;
  readonly permissions: PermissionsApi;
  readonly platforms: PlatformsApi;
  readonly projects: ProjectsApi;
  readonly users: UsersApi;
  readonly versions: VersionsApi;

  /** Internal API namespaces. These endpoints are undocumented and may change without notice. */
  readonly internal: InternalApis;

  constructor(options: HangarClientOptions = {}) {
    this.#core = new HangarClientCore(options);

    this.auth = new AuthApi(this.#core);
    this.keys = new KeysApi(this.#core);
    this.pages = new PagesApi(this.#core);
    this.permissions = new PermissionsApi(this.#core);
    this.platforms = new PlatformsApi(this.#core);
    this.projects = new ProjectsApi(this.#core);
    this.users = new UsersApi(this.#core);
    this.versions = new VersionsApi(this.#core);

    this.internal = {
      admin: new InternalAdminApi(this.#core),
      apiKeys: new InternalApiKeysApi(this.#core),
      auth: new InternalAuthApi(this.#core),
      channels: new InternalChannelsApi(this.#core),
      data: new InternalDataApi(this.#core),
      discovery: new InternalDiscoveryApi(this.#core),
      flags: new InternalFlagsApi(this.#core),
      globalData: new InternalGlobalDataApi(this.#core),
      health: new InternalHealthApi(this.#core),
      jarScanning: new InternalJarScanningApi(this.#core),
      notifications: new InternalNotificationsApi(this.#core),
      oauth: new InternalOAuthApi(this.#core),
      onboarding: new InternalOnboardingApi(this.#core),
      organizations: new InternalOrganizationsApi(this.#core),
      pages: new InternalPagesApi(this.#core),
      projects: new InternalProjectsApi(this.#core),
      reviews: new InternalReviewsApi(this.#core),
      users: new InternalUsersApi(this.#core),
      versions: new InternalVersionsApi(this.#core),
    };
  }
}
