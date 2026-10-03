import type { HangarClientCore } from '../core.js';
import type { NamedPermission } from '../../types/index.js';

/** A project category entry. */
export interface CategoryData {
  apiName: string;
  title: string;
  icon: string;
  visible: boolean;
}

/** A channel color entry. */
export interface ColorData {
  name: string;
  hex: string;
}

/** A flag reason entry. */
export interface FlagReasonData {
  type: string;
  title: string;
}

/** A role definition. */
export interface RoleData {
  roleId: number;
  name: string;
  title: string;
  color: string;
  rank: number;
  assignable: boolean;
}

/** A permission definition. */
export interface PermissionData {
  value: string;
  frontendName: string;
  permission: string;
}

/** A set of related permissions, presented together when editing a member. */
export interface PermissionGroup {
  /** i18n key suffix under `permissionGroup.`. */
  name: string;
  permissions: NamedPermission[];
}

/** A user prompt definition. */
export interface PromptData {
  ordinal: number;
  name: string;
  titleKey: string;
  messageKey: string;
}

/** Security configuration data. */
export interface SecurityData {
  safeDownloadHosts: string[];
}

/** Validation rules for various entity types. */
export interface ValidationData {
  project: Record<string, unknown>;
  org: Record<string, unknown>;
  userTagline: Record<string, unknown>;
  version: Record<string, unknown>;
  page: Record<string, unknown>;
  maxPageCount: number;
}

/** Server version and build information. */
export interface VersionInfoData {
  version: string;
  commitsAhead: number;
  commit: string;
  commitDistance: number;
  branch: string;
  build: string;
  state: string;
}

/** A visibility option definition. */
export interface VisibilityData {
  name: string;
  showModal: boolean;
  canChangeTo: boolean;
  title: string;
  color: string;
}

/** Internal API namespace for static reference data. */
export class InternalDataApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns all project categories. */
  getCategories(): Promise<CategoryData[]> {
    return this.core.requestJson<CategoryData[]>('internal/data/categories');
  }

  /** Returns all available channel colors. */
  getColors(): Promise<ColorData[]> {
    return this.core.requestJson<ColorData[]>('internal/data/channelColors');
  }

  /** Returns all flag reasons. */
  getFlagReasons(): Promise<FlagReasonData[]> {
    return this.core.requestJson<FlagReasonData[]>('internal/data/flagReasons');
  }

  /** Returns all global roles. */
  getGlobalRoles(): Promise<RoleData[]> {
    return this.core.requestJson<RoleData[]>('internal/data/globalRoles');
  }

  /** Returns all available license identifiers. */
  getLicenses(): Promise<string[]> {
    return this.core.requestJson<string[]>('internal/data/licenses');
  }

  /** Returns all logged action type names. */
  getLoggedActions(): Promise<string[]> {
    return this.core.requestJson<string[]>('internal/data/loggedActions');
  }

  /** Returns the permission groups that can be granted to organization members. */
  getOrganizationPermissionGroups(): Promise<PermissionGroup[]> {
    return this.core.requestJson<PermissionGroup[]>('internal/data/organizationPermissions');
  }

  /** Returns all permission definitions. */
  getPermissions(): Promise<PermissionData[]> {
    return this.core.requestJson<PermissionData[]>('internal/data/permissions');
  }

  /** Returns the permission groups that can be granted to project members. */
  getProjectPermissionGroups(): Promise<PermissionGroup[]> {
    return this.core.requestJson<PermissionGroup[]>('internal/data/projectPermissions');
  }

  /** Returns all user prompts. */
  getPrompts(): Promise<PromptData[]> {
    return this.core.requestJson<PromptData[]>('internal/data/prompts');
  }

  /** Returns security configuration data. */
  getSecurity(): Promise<SecurityData> {
    return this.core.requestJson<SecurityData>('internal/data/security');
  }

  /** Returns validation rules for entity fields. */
  getValidations(): Promise<ValidationData> {
    return this.core.requestJson<ValidationData>('internal/data/validations');
  }

  /** Returns server version and build information. */
  getVersionInfo(): Promise<VersionInfoData> {
    return this.core.requestJson<VersionInfoData>('internal/data/version-info');
  }

  /** Returns all visibility options. */
  getVisibilities(): Promise<VisibilityData[]> {
    return this.core.requestJson<VisibilityData[]>('internal/data/visibilities');
  }
}
