import type { HangarClientCore } from '../core.js';
import type { NamedPermission } from '../../types/index.js';

/** Form for creating an organization. */
export interface CreateOrganizationForm {
  name: string;
}

/** An organization with its members. */
export interface Organization {
  name: string;
  owner: string;
  createdAt: string;
  avatarUrl: string;
  tagline?: string;
  members: OrganizationMember[];
}

/** A user's membership in an organization. */
export interface OrganizationRole {
  id: number;
  createdAt: string;
  userId: number;
  principalId: number;
  ownerId: number;
  ownerName: string;
  avatarUrl: string;
  uuid: string;
  title: string;
  permissions: NamedPermission[];
  /** Whether the user owns the organization. */
  owner: boolean;
  accepted: boolean;
}

/** User details of an organization member. */
export interface OrganizationMemberUser {
  id: number;
  userId: number;
  uuid: string;
  name: string;
  tagline?: string;
  avatarUrl: string;
  createdAt: string;
  locked: boolean;
  organization: boolean;
  socials: unknown;
}

/** An organization member entry. */
export interface OrganizationMember {
  user: OrganizationMemberUser;
  role: OrganizationRole;
  hidden: boolean;
}

/** Form for adding or editing an organization member. */
export interface EditOrganizationMemberForm {
  name: string;
  /** Permissions granted to the member. */
  permissions?: NamedPermission[];
  /** Display title of the member (max 32 characters). */
  title?: string;
}

/** Form for transferring ownership. */
export interface TransferForm {
  to: string;
}

/** Internal API namespace for organizations. */
export class InternalOrganizationsApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Creates a new organization. */
  create(form: CreateOrganizationForm): Promise<void> {
    return this.core.requestVoid('internal/organizations/create', {
      method: 'POST',
      body: form,
    });
  }

  /** Returns an organization by name. */
  getOrganization(org: string): Promise<Organization> {
    return this.core.requestJson<Organization>(
      `internal/organizations/org/${encodeURIComponent(org)}`,
    );
  }

  /** Cancels a pending ownership transfer. */
  cancelTransfer(org: string): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/canceltransfer`,
      { method: 'POST', body: {} },
    );
  }

  /** Deletes an organization. */
  delete(org: string): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/delete`,
      { method: 'POST', body: {} },
    );
  }

  /** Adds a member to an organization. */
  addMember(org: string, form: EditOrganizationMemberForm): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/members/add`,
      { method: 'POST', body: form },
    );
  }

  /** Edits a member's role in an organization. */
  editMember(org: string, form: EditOrganizationMemberForm): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/members/edit`,
      { method: 'POST', body: form },
    );
  }

  /** Removes the current user from an organization. */
  leaveOrganization(org: string): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/members/leave`,
      { method: 'POST', body: {} },
    );
  }

  /** Removes a member from an organization. */
  removeMember(org: string, name: string): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/members/remove`,
      { method: 'POST', body: { name } },
    );
  }

  /** Uploads a new avatar for an organization. */
  changeAvatar(org: string, avatar: Blob): Promise<void> {
    const form = new FormData();
    form.set('avatar', avatar);
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/settings/avatar`,
      { method: 'POST', body: form },
    );
  }

  /** Saves social links for an organization. */
  saveSocials(org: string, socials: Record<string, string>): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/settings/socials`,
      { method: 'POST', body: socials },
    );
  }

  /** Updates the tagline of an organization. */
  saveTagline(org: string, tagline: string): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/settings/tagline`,
      { method: 'POST', body: { content: tagline } },
    );
  }

  /** Initiates an ownership transfer for an organization. */
  transfer(org: string, form: TransferForm): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/org/${encodeURIComponent(org)}/transfer`,
      { method: 'POST', body: form },
    );
  }

  /** Validates an organization name. */
  validateName(name: string): Promise<void> {
    return this.core.requestVoid('internal/organizations/validate', { query: { name } });
  }

  /** Sets whether an organization is hidden from a user's profile. */
  changeVisibility(org: string, hidden: boolean): Promise<void> {
    return this.core.requestVoid(
      `internal/organizations/${encodeURIComponent(org)}/userOrganizationsVisibility`,
      { method: 'POST', body: { hidden } },
    );
  }

  /** Returns the organization memberships of a user, keyed by organization name. */
  getUserOrganizationRoles(user: string): Promise<Record<string, OrganizationRole>> {
    return this.core.requestJson<Record<string, OrganizationRole>>(
      `internal/organizations/${encodeURIComponent(user)}/userOrganizations`,
    );
  }

  /** Returns the visibility settings for a user's organizations. */
  getUserOrganizationVisibility(user: string): Promise<Record<string, boolean>> {
    return this.core.requestJson<Record<string, boolean>>(
      `internal/organizations/${encodeURIComponent(user)}/userOrganizationsVisibility`,
    );
  }
}
