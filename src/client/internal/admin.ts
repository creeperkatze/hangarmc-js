import type { HangarClientCore } from '../core.js';
import type { PaginatedResult } from '../../types/base.js';
import type { Platform, ProjectNamespace } from '../../types/index.js';

/** Flag activity record for a user. */
export interface FlagActivity {
  createdAt: string;
  reportedBy: string;
  flagReason: string;
  comment: string;
}

/** Review activity record for a user. */
export interface ReviewActivity {
  createdAt: string;
  reviewedBy: string;
}

/** Project approval queue state. */
export interface ProjectApprovals {
  needsApproval: unknown[];
  waitingProjects: unknown[];
}

/** Version review queue state. */
export interface ReviewQueue {
  underReview: unknown[];
  waitingVersions: unknown[];
}

/** Daily admin statistics. */
export interface DayStats {
  day: string;
  reviews: number;
  uploads: number;
  downloads: number;
  views: number;
  newUsers: number;
  newProjects: number;
  flagsOpened: number;
  flagsClosed: number;
}

/** Site-wide totals for the admin stats summary. */
export interface StatsTotals {
  users: number;
  projects: number;
  versions: number;
  downloads: number;
  views: number;
  openFlags: number;
  pendingReviews: number;
}

/** Download count for a single platform. */
export interface PlatformDownloads {
  platform: Platform;
  downloads: number;
}

/** A top project entry in the admin stats summary. */
export interface TopProject {
  namespace: ProjectNamespace;
  downloads: number;
  views: number;
}

/** Aggregated admin statistics for a date range. */
export interface StatsSummary {
  totals: StatsTotals;
  platformDownloads: PlatformDownloads[];
  topProjects: TopProject[];
}

/** The type of action recorded in an action log entry. */
export interface LogAction {
  name: string;
  description: string;
  pgLoggedAction: string;
}

/** An admin action log entry. */
export interface HangarLoggedAction {
  createdAt: string;
  userName: string;
  userAvatarUrl: string;
  project: unknown;
  version: unknown;
  page: unknown;
  subject: unknown;
  action: LogAction;
  contextType: string;
  address: unknown;
}

/** Options for filtering the admin action log. */
export interface GetActionLogOptions {
  sort?: 'time';
  /** Only include entries created on or after this date. */
  dateFrom?: string;
  /** Only include entries created on or before this date. */
  dateTo?: string;
  logAction?: string;
  pageId?: string;
  projectSlug?: string;
  authorName?: string;
  subjectName?: string;
  user?: string;
  platform?: string;
  versionString?: string;
  limit?: number | string;
  offset?: number | string;
}

/** Form for changing a user's role. */
export interface ChangeRoleForm {
  roleName: string;
  userId: number;
}

/** A plain string payload. */
export interface StringContent {
  content: string;
}

/** Internal API namespace for admin operations. */
export class InternalAdminApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns flag activity for a user. */
  getFlagActivity(user: string): Promise<FlagActivity[]> {
    return this.core.requestJson<FlagActivity[]>(
      `internal/admin/activity/${encodeURIComponent(user)}/flags`,
    );
  }

  /** Returns review activity for a user. */
  getReviewActivity(user: string): Promise<ReviewActivity[]> {
    return this.core.requestJson<ReviewActivity[]>(
      `internal/admin/activity/${encodeURIComponent(user)}/reviews`,
    );
  }

  /** Returns the number of projects waiting for approval. */
  getProjectApprovalQueueSize(): Promise<number> {
    return this.core.requestJson<number>('internal/admin/approval/projectneedingapproval');
  }

  /** Returns the project approval queue. */
  getProjectApprovals(): Promise<ProjectApprovals> {
    return this.core.requestJson<ProjectApprovals>('internal/admin/approval/projects');
  }

  /** Returns the version review queue. */
  getReviewQueue(): Promise<ReviewQueue> {
    return this.core.requestJson<ReviewQueue>('internal/admin/approval/versions');
  }

  /** Returns the number of versions waiting for approval. */
  getVersionApprovalQueueSize(): Promise<number> {
    return this.core.requestJson<number>('internal/admin/approval/versionsneedingapproval');
  }

  /** Fixes avatar URLs for all users. */
  fixAvatarUrls(force?: boolean): Promise<string> {
    return this.core.requestText('internal/admin/fixAvatars', {
      method: 'POST',
      query: force !== undefined ? { force } : undefined,
    });
  }

  /** Locks or unlocks a user account. */
  setUserLock(user: string, locked: boolean, content: StringContent, toggleProjectDeletion?: boolean): Promise<void> {
    return this.core.requestVoid(
      `internal/admin/lock-user/${encodeURIComponent(user)}`,
      { method: 'POST', query: { locked, toggleProjectDeletion }, body: content },
    );
  }

  /** Returns the admin action log. */
  getActionLog(options?: GetActionLogOptions): Promise<PaginatedResult<HangarLoggedAction>> {
    return this.core.requestJson<PaginatedResult<HangarLoggedAction>>('internal/admin/log', {
      query: options,
    });
  }

  /** Bulk updates user roles. */
  changeRoles(roles: ChangeRoleForm[]): Promise<void> {
    return this.core.requestVoid('internal/admin/roles', { method: 'POST', body: roles });
  }

  /** Approves all versions that contain only safe download links. */
  approveVersionsWithSafeLinks(): Promise<void> {
    return this.core.requestVoid('internal/admin/scanSafeLinks', { method: 'POST' });
  }

  /** Returns daily admin statistics for a date range. */
  getStats(from?: string, to?: string): Promise<DayStats[]> {
    return this.core.requestJson<DayStats[]>('internal/admin/stats', {
      query: { from, to },
    });
  }

  /** Returns aggregated statistics (totals, platform downloads, top projects) for a date range. */
  getStatsSummary(from?: string, to?: string): Promise<StatsSummary> {
    return this.core.requestJson<StatsSummary>('internal/admin/stats/summary', {
      query: { from, to },
    });
  }

  /** Recomputes file hashes for all versions. */
  updateHashes(): Promise<string[]> {
    return this.core.requestJson<string[]>('internal/admin/updateHashes', { method: 'POST' });
  }

  /** Renames a user. */
  renameUser(user: string, newName: string): Promise<void> {
    return this.core.requestVoid(
      `internal/admin/user/${encodeURIComponent(user)}/rename`,
      { method: 'POST', body: { content: newName } },
    );
  }

  /** Removes a global role from a user. */
  removeRole(user: string, role: string): Promise<void> {
    return this.core.requestVoid(
      `internal/admin/user/${encodeURIComponent(user)}/${encodeURIComponent(role)}`,
      { method: 'DELETE' },
    );
  }

  /** Adds a global role to a user. */
  addRole(user: string, role: string): Promise<void> {
    return this.core.requestVoid(
      `internal/admin/user/${encodeURIComponent(user)}/${encodeURIComponent(role)}`,
      { method: 'POST' },
    );
  }

  /** Permanently deletes a user account. */
  deleteUser(user: string, content: StringContent): Promise<void> {
    return this.core.requestVoid(
      `internal/admin/yeet/${encodeURIComponent(user)}`,
      { method: 'POST', body: content },
    );
  }
}
