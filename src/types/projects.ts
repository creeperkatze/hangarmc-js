import type { Platform } from './platforms.js';
import type { PaginationOptions } from './base.js';
import type { NamedPermission } from './permissions.js';

/** Project category. */
export type Category =
  | 'admin_tools'
  | 'chat'
  | 'dev_tools'
  | 'economy'
  | 'gameplay'
  | 'games'
  | 'protection'
  | 'role_playing'
  | 'world_management'
  | 'misc'
  | 'undefined';

/** Visibility state of a project or version. */
export type Visibility = 'public' | 'new' | 'needsChanges' | 'needsApproval' | 'softDelete';

/** A hex color used for channels and roles. */
export type Color =
  | '#d946ef'
  | '#a855f7'
  | '#8b5cf6'
  | '#6366f1'
  | '#3b82f6'
  | '#0ea5e9'
  | '#06b6d4'
  | '#14b8a6'
  | '#34d399'
  | '#22c55e'
  | '#84cc16'
  | '#eab308'
  | '#f59e0b'
  | '#f97316'
  | '#ef4444'
  | '#78716c'
  | '#A9A9A9'
  | 'transparent';

/** A flag that can be applied to a release channel. */
export type ChannelFlag = 'FROZEN' | 'UNSTABLE' | 'PINNED' | 'SENDS_NOTIFICATIONS' | 'HIDE_BY_DEFAULT';

/** A project tag. */
export type Tag = 'ADDON' | 'LIBRARY' | 'SUPPORTS_FOLIA';

/** Reason for flagging a project. */
export type FlagReason =
  | 'project.flag.flags.inappropriateContent'
  | 'project.flag.flags.impersonation'
  | 'project.flag.flags.spam'
  | 'project.flag.flags.malIntent'
  | 'project.flag.flags.other';

/** Owner + slug pair that uniquely identifies a project. */
export interface ProjectNamespace {
  owner: string;
  slug: string;
}

/** Aggregate statistics for a project. */
export interface ProjectStats {
  views: number;
  downloads: number;
  recentViews: number;
  recentDownloads: number;
  stars: number;
  watchers: number;
}

/** License information for a project. */
export interface ProjectLicense {
  name: string;
  type: string;
  url?: string;
}

/** @deprecated Donation settings for a project. */
export interface ProjectDonationSettings {
  enable: boolean;
  subject: string;
}

/** A single link entry in a project's link section. */
export interface ProjectLink {
  id: number;
  name: string;
  url: string;
}

/** A grouped section of project links (e.g. sidebar or top bar). */
export interface LinkSection {
  id: number;
  title: string;
  /** Either "SIDEBAR" or "TOP". */
  type: string;
  links: ProjectLink[];
}

/** Full project settings object. */
export interface ProjectSettings {
  license: ProjectLicense;
  keywords: string[];
  sponsors: string;
  /** @deprecated */
  donation: ProjectDonationSettings;
  links: LinkSection[];
  tags: Tag[];
  /** Whether the project is reachable by link but left out of search, the homepage and profiles. */
  unlisted: boolean;
}

/** The authenticated user's interactions with a project. */
export interface UserActions {
  starred: boolean;
  watching: boolean;
  flagged: boolean;
}

/** A release channel for a project. */
export interface ProjectChannel {
  name: string;
  color: Color;
  description: string;
  createdAt: string;
  flags: ChannelFlag[];
}

/** Full project object returned from the v1 API. */
export interface Project {
  id: number;
  name: string;
  namespace: ProjectNamespace;
  description: string;
  category: Category;
  visibility: Visibility;
  avatarUrl: string;
  createdAt: string;
  /** The time the project's first version was published. */
  publishedAt?: string | null;
  lastUpdated: string;
  mainPageContent: string;
  memberNames: string[];
  stats: ProjectStats;
  settings: ProjectSettings;
  userActions: UserActions;
  supportedPlatforms: Record<string, string[]>;
}

/** Condensed project representation (used in starred/pinned lists). */
export interface ProjectCompact {
  id: number;
  name: string;
  namespace: ProjectNamespace;
  description: string;
  category: Category;
  visibility: Visibility;
  avatarUrl: string;
  createdAt: string;
  lastUpdated: string;
  stats: ProjectStats;
}

/** A project member with their title and granted permissions. */
export interface ProjectMember {
  user: string;
  userId: number;
  title: string;
  permissions: NamedPermission[];
}

/** Download and view stats for a single day. */
export interface DayProjectStats {
  views: number;
  downloads: number;
}

/** Request body for flagging a project. */
export interface FlagForm {
  projectId: number;
  reason: FlagReason;
  comment: string;
}

/** Query parameters for listing/searching projects. */
export interface GetProjectsOptions extends PaginationOptions {
  sort?: 'views' | 'downloads' | 'newest' | 'stars' | 'updated' | 'recent_downloads' | 'recent_views' | 'slug';
  category?: string;
  platform?: Platform | string;
  owner?: string;
  query?: string;
  license?: string;
  version?: string;
  tag?: string;
  member?: string;
  /** @deprecated Use `query` instead. */
  q?: string;
  /** @deprecated */
  prioritizeExactMatch?: boolean;
}

/** Query parameters for getting project stats. */
export interface GetProjectStatsOptions {
  fromDate: string;
  toDate: string;
}
