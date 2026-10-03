import type { HangarClientCore } from '../core.js';
import type { User } from '../../types/index.js';

/** Form for saving user profile settings. */
export interface ProfileSettingsForm {
  tagline?: string;
  [key: string]: unknown;
}

export class InternalUsersApi {
  constructor(private readonly core: HangarClientCore) {}

  getCurrentUser(): Promise<User> {
    return this.core.requestJson<User>('internal/users/@me');
  }

  /** Marks the latest changelog as seen by the current user. */
  markChangelogSeen(): Promise<void> {
    return this.core.requestVoid('internal/users/settings/changelogSeen', { method: 'POST' });
  }

  getPossibleAltAccounts(userName: string): Promise<string[]> {
    return this.core.requestJson<string[]>(
      `internal/users/${encodeURIComponent(userName)}/alts`,
    );
  }

  saveSettings(userName: string, settings: Record<string, unknown>): Promise<void> {
    return this.core.requestVoid(
      `internal/users/${encodeURIComponent(userName)}/settings/`,
      { method: 'POST', body: settings },
    );
  }

  changeAvatar(userName: string, avatar: Blob): Promise<void> {
    const form = new FormData();
    form.set('avatar', avatar);
    return this.core.requestVoid(
      `internal/users/${encodeURIComponent(userName)}/settings/avatar`,
      { method: 'POST', body: form },
    );
  }

  saveProfileSettings(userName: string, form: ProfileSettingsForm): Promise<void> {
    return this.core.requestVoid(
      `internal/users/${encodeURIComponent(userName)}/settings/profile`,
      { method: 'POST', body: form },
    );
  }

  resetTagline(userName: string): Promise<void> {
    return this.core.requestVoid(
      `internal/users/${encodeURIComponent(userName)}/settings/resetTagline`,
      { method: 'POST', body: {} },
    );
  }

  saveSocials(userName: string, socials: Record<string, string>): Promise<void> {
    return this.core.requestVoid(
      `internal/users/${encodeURIComponent(userName)}/settings/socials`,
      { method: 'POST', body: socials },
    );
  }

  saveTagline(userName: string, tagline: string): Promise<void> {
    return this.core.requestVoid(
      `internal/users/${encodeURIComponent(userName)}/settings/tagline`,
      { method: 'POST', body: { content: tagline } },
    );
  }
}
