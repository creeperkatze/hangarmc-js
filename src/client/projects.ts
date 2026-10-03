import type { HangarClientCore } from './core.js';
import type {
  Project,
  ProjectCompact,
  ProjectMember,
  ProjectChannel,
  DayProjectStats,
  GetProjectsOptions,
  GetProjectStatsOptions,
  User,
} from '../types/index.js';
import type { PaginatedResult, PaginationOptions } from '../types/base.js';

/** API namespace for projects. */
export class ProjectsApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns a paginated list of projects matching the given filters. */
  list(options?: GetProjectsOptions): Promise<PaginatedResult<Project>> {
    return this.core.requestJson<PaginatedResult<Project>>('v1/projects', { query: options });
  }

  /** Returns a single project by its author and slug. */
  get(author: string, slug: string): Promise<Project> {
    return this.core.requestJson<Project>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}`,
    );
  }

  /** Returns daily view/download stats for a project between two dates (YYYY-MM-DD format). */
  getStats(author: string, slug: string, options: GetProjectStatsOptions): Promise<Record<string, DayProjectStats>> {
    return this.core.requestJson<Record<string, DayProjectStats>>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/stats`,
      { query: options },
    );
  }

  /** Returns the members of a project (paginated). */
  getMembers(author: string, slug: string, options?: PaginationOptions): Promise<PaginatedResult<ProjectMember>> {
    return this.core.requestJson<PaginatedResult<ProjectMember>>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/members`,
      { query: options },
    );
  }

  /** Returns the users who starred a project (paginated). */
  getStargazers(author: string, slug: string, options?: PaginationOptions): Promise<PaginatedResult<User>> {
    return this.core.requestJson<PaginatedResult<User>>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/stargazers`,
      { query: options },
    );
  }

  /** Returns the users who watch a project (paginated). */
  getWatchers(author: string, slug: string, options?: PaginationOptions): Promise<PaginatedResult<User>> {
    return this.core.requestJson<PaginatedResult<User>>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/watchers`,
      { query: options },
    );
  }

  /** Returns the release channels for a project. */
  getChannels(author: string, slug: string): Promise<ProjectChannel[]> {
    return this.core.requestJson<ProjectChannel[]>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/channels`,
    );
  }

  /** Returns projects pinned/starred by the given user. */
  getPinned(user: string): Promise<ProjectCompact[]> {
    return this.core.requestJson<ProjectCompact[]>(
      `v1/projects/${encodeURIComponent(user)}/pinned`,
    );
  }

  /** Returns projects starred by the given user (paginated). */
  getStarred(user: string, options?: GetProjectsOptions): Promise<PaginatedResult<ProjectCompact>> {
    return this.core.requestJson<PaginatedResult<ProjectCompact>>(
      `v1/projects/${encodeURIComponent(user)}/starred`,
      { query: options },
    );
  }

  /** Returns projects watched by the given user (paginated). */
  getWatching(user: string, options?: GetProjectsOptions): Promise<PaginatedResult<ProjectCompact>> {
    return this.core.requestJson<PaginatedResult<ProjectCompact>>(
      `v1/projects/${encodeURIComponent(user)}/watching`,
      { query: options },
    );
  }
}
