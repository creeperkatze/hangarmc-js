import type { PaginationOptions } from './base.js';

/** A record of a username change. */
export interface UserNameChange {
  oldName: string;
  newName: string;
  date: string;
}

/** A Hangar user. */
export interface User {
  id: number;
  name: string;
  tagline: string;
  createdAt: string;
  projectCount: number;
  roles: number[];
  isOrganization: boolean;
  locked: boolean;
  avatarUrl: string;
  nameHistory: UserNameChange[];
  socials: unknown;
}

/** Query parameters for searching users. */
export interface GetUsersOptions extends PaginationOptions {
  /** The search query. */
  query?: string;
  sort?: 'name' | 'createdAt' | 'projectCount' | 'locked' | 'org' | 'roles';
}

/** Query parameters for listing project authors. */
export interface GetAuthorsOptions extends PaginationOptions {
  /** The search query. */
  query?: string;
  sort?: 'name' | 'createdAt' | 'projectCount';
}

/** Query parameters for listing staff members. */
export interface GetStaffOptions extends PaginationOptions {
  /** The search query. */
  query?: string;
  sort?: 'name' | 'createdAt' | 'roles';
}
