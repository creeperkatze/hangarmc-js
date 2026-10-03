import type { HangarClientCore } from '../core.js';
import type { FlagReason } from '../../types/index.js';
import type { PaginatedResult, PaginationOptions } from '../../types/base.js';

/** Options for listing resolved flags. */
export interface GetResolvedFlagsOptions extends PaginationOptions {
  sort?: 'flagResolved' | 'flagCreated';
}

/** Options for listing unresolved flags. */
export interface GetUnresolvedFlagsOptions extends PaginationOptions {
  sort?: 'flagCreated';
}

/** Form for submitting a project flag. */
export interface FlagForm {
  projectId: number;
  reason: FlagReason;
  comment: string;
}

/** A project flag report. */
export interface Flag {
  id: number;
  projectId: number;
  reportedBy: string;
  reason: FlagReason;
  comment: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

/** A notification message related to a flag. */
export interface FlagNotification {
  id: number;
  message: string;
  createdAt: string;
}

/** Internal API namespace for project flags. */
export class InternalFlagsApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Submits a flag report for a project. */
  flag(form: FlagForm): Promise<void> {
    return this.core.requestVoid('internal/flags/', { method: 'POST', body: form });
  }

  /** Returns resolved flags (paginated). */
  getResolvedFlags(options?: GetResolvedFlagsOptions): Promise<PaginatedResult<Flag>> {
    return this.core.requestJson<PaginatedResult<Flag>>('internal/flags/resolved', { query: options });
  }

  /** Returns unresolved flags (paginated). */
  getUnresolvedFlags(options?: GetUnresolvedFlagsOptions): Promise<PaginatedResult<Flag>> {
    return this.core.requestJson<PaginatedResult<Flag>>('internal/flags/unresolved', { query: options });
  }

  /** Returns the count of unresolved flags. */
  getUnresolvedFlagsQueueSize(): Promise<number> {
    return this.core.requestJson<number>('internal/flags/unresolvedamount');
  }

  /** Returns notifications associated with a flag. */
  getNotifications(id: number): Promise<FlagNotification[]> {
    return this.core.requestJson<FlagNotification[]>(`internal/flags/${id}/notifications`);
  }

  /** Sends a notification to the reporter of a flag. */
  notifyReportParty(id: number, message: string): Promise<void> {
    return this.core.requestVoid(`internal/flags/${id}/notify`, {
      method: 'POST',
      body: { content: message },
    });
  }

  /** Marks a flag as resolved or unresolved. */
  resolve(id: number, resolved: boolean): Promise<void> {
    return this.core.requestVoid(`internal/flags/${id}/resolve/${resolved}`, { method: 'POST', body: {} });
  }

  /** Returns all flags for a project. */
  getFlags(slug: string): Promise<Flag[]> {
    return this.core.requestJson<Flag[]>(`internal/flags/${encodeURIComponent(slug)}`);
  }
}
