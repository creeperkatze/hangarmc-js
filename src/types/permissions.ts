/** A named permission that can be granted to an API key or checked against a user. */
export type NamedPermission =
  | 'view_public_info'
  | 'edit_own_user_settings'
  | 'edit_api_keys'
  | 'edit_subject_settings'
  | 'manage_subject_members'
  | 'is_subject_owner'
  | 'is_subject_member'
  | 'create_project'
  | 'edit_page'
  | 'delete_project'
  | 'create_version'
  | 'edit_version'
  | 'delete_version'
  | 'edit_channels'
  | 'create_organization'
  | 'delete_organization'
  | 'mod_notes_and_flags'
  | 'see_hidden'
  | 'is_staff'
  | 'reviewer'
  | 'view_health'
  | 'view_ip'
  | 'view_stats'
  | 'view_logs'
  | 'manual_value_changes'
  | 'restore_version'
  | 'restore_project'
  | 'hard_delete_project'
  | 'hard_delete_version'
  | 'edit_all_user_settings';

/** The scope a permission check applies to. */
export type PermissionType = 'global' | 'project' | 'organization';

/** Your resolved permissions in a given context. */
export interface UserPermissions {
  type: PermissionType;
  permissions: NamedPermission[];
  permissionBinString: string;
}

/** Result of a has-all or has-any permission check. */
export interface PermissionCheck {
  type: PermissionType;
  result: boolean;
}

/** Options for permission-check endpoints that accept an optional context. */
export interface PermissionsOptions {
  /** @deprecated Use `project` instead. */
  slug?: string;
  /** The organization name to check permissions in. Mutually exclusive with `project`. */
  organization?: string;
  /** The project slug or id to check permissions in. Mutually exclusive with `organization`. */
  project?: string;
}

/** Options for has-all and has-any permission checks. */
export interface HasPermissionsOptions extends PermissionsOptions {
  permissions: NamedPermission[];
}
