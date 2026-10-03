import type { HangarClientCore } from '../core.js';

/** A Hangar user notification. */
export interface HangarNotification {
  id: number;
  createdAt: string;
  action: string;
  message: string[];
  read: boolean;
  originUserId?: number;
  type: string;
}

/** A project or organization invite. */
export interface ProjectInvite {
  roleId: number;
  title: string;
  createdAt: string;
  name: string;
  url: string;
  representingOrg?: string;
  type: 'project' | 'organization';
}

/** Internal API namespace for notifications and invites. */
export class InternalNotificationsApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns pending project and organization invites for the current user. */
  getInvites(): Promise<{ project: ProjectInvite[]; organization: ProjectInvite[] }> {
    return this.core.requestJson('internal/invites');
  }

  /** Accepts or declines an organization invite. */
  updateOrganizationInviteStatus(id: number, status: string): Promise<void> {
    return this.core.requestVoid(
      `internal/invites/organization/${id}/${encodeURIComponent(status)}`,
      { method: 'POST', body: {} },
    );
  }

  /** Accepts or declines a project invite. */
  updateProjectInviteStatus(id: number, status: string): Promise<void> {
    return this.core.requestVoid(
      `internal/invites/project/${id}/${encodeURIComponent(status)}`,
      { method: 'POST', body: {} },
    );
  }

  /** Marks all notifications as read. */
  markAllRead(): Promise<void> {
    return this.core.requestVoid('internal/markallread', { method: 'POST', body: {} });
  }

  /** Returns all notifications for the current user. */
  getNotifications(): Promise<HangarNotification[]> {
    return this.core.requestJson<HangarNotification[]>('internal/notifications');
  }

  /** Marks a notification as read. */
  markNotificationAsRead(id: number): Promise<void> {
    return this.core.requestVoid(`internal/notifications/${id}`, { method: 'POST', body: {} });
  }

  /** Records that the user has read a prompt. */
  readPrompt(prompt: string): Promise<void> {
    return this.core.requestVoid(
      `internal/read-prompt/${encodeURIComponent(prompt)}`,
      { method: 'POST', body: {} },
    );
  }

  /** Returns all read notifications for the current user. */
  getReadNotifications(): Promise<HangarNotification[]> {
    return this.core.requestJson<HangarNotification[]>('internal/readnotifications');
  }

  /** Returns the most recent notifications for the current user. */
  getRecentNotifications(): Promise<HangarNotification[]> {
    return this.core.requestJson<HangarNotification[]>('internal/recentnotifications');
  }

  /** Returns the number of unread notifications for the current user. */
  getUnreadCount(): Promise<number> {
    return this.core.requestJson<number>('internal/unreadcount');
  }

  /** Returns all unread notifications for the current user. */
  getUnreadNotifications(): Promise<HangarNotification[]> {
    return this.core.requestJson<HangarNotification[]>('internal/unreadnotifications');
  }
}
