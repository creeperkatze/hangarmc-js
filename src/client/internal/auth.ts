import type { HangarClientCore } from '../core.js';

/** Form for creating a new account. */
export interface SignupForm {
  username: string;
  email: string;
  password: string;
}

/** Form for updating account details. */
export interface AccountForm {
  username?: string;
  email?: string;
  currentPassword: string;
}

/** Arbitrary settings key-value map. */
export interface SettingsForm {
  [key: string]: unknown;
}

/** A registered WebAuthn authenticator. */
export interface Authenticator {
  id: string;
  displayName: string;
  addedAt: string;
}

/** A linked OAuth account. */
export interface OAuthConnection {
  id: string;
  name: string;
  provider: string;
}

/** Security settings of the current account. */
export interface SettingsResponse {
  authenticators: Authenticator[];
  oauthConnections: OAuthConnection[];
  hasBackupCodes: boolean;
  hasTotp: boolean;
  hasPassword: boolean;
  emailConfirmed: boolean;
  emailPending: boolean;
  /** When the account is scheduled to be deleted, if a deletion was requested. */
  deletionScheduledFor?: string | null;
  ownedProjectCount: number;
  ownedOrganizationCount: number;
}

/** Response containing a TOTP secret and QR code. */
export interface SetupTotpResponse {
  secret: string;
  qrCode: string;
}

/** Form containing a TOTP or backup code. */
export interface TotpForm {
  code: string;
  password?: string;
}

/** Form for requesting a password reset email. */
export interface ResetForm {
  email: string;
}

/** Form for setting a new password using a reset code. */
export interface SetPasswordForm {
  code: string;
  password: string;
}

/** Form containing a verification code. */
export interface VerifyCodeForm {
  code: string;
}

/** Form for password-based login. */
export interface LoginPasswordForm {
  username: string;
  password: string;
}

/** Form for TOTP login. */
export interface LoginTotpForm {
  code: string;
}

/** Form for backup-code login. */
export interface LoginBackupForm {
  code: string;
}

/** Form for WebAuthn login. */
export interface LoginWebAuthnForm {
  credential: unknown;
}

/** Form for sudo re-authentication. */
export interface LoginSudoForm {
  password: string;
}

/** Response containing WebAuthn setup data. */
export interface WebAuthnSetupResponse {
  publicKey: unknown;
}

/** Form for registering a WebAuthn credential. */
export interface WebAuthnRegisterForm {
  credential: unknown;
  name?: string;
}

/** Form for renaming a WebAuthn credential. */
export interface WebAuthnRenameForm {
  id: string;
  name: string;
}

/** Form for unregistering a WebAuthn credential. */
export interface WebAuthnUnregisterForm {
  id: string;
  password: string;
}

/** Internal API namespace for authentication and account management. */
export class InternalAuthApi {
  constructor(private readonly core: HangarClientCore) {}

  // Session / account management

  /** Saves account settings. */
  saveAccount(form: AccountForm): Promise<void> {
    return this.core.requestVoid('internal/auth/account', { method: 'POST', body: form });
  }

  /** Invalidates the current refresh token. */
  invalidateRefreshToken(): Promise<void> {
    return this.core.requestVoid('internal/auth/invalidate');
  }

  /** Notifies the server that the user has logged out. */
  loggedOut(): Promise<void> {
    return this.core.requestVoid('internal/auth/logout');
  }

  /** Refreshes the current access token. */
  refreshAccessToken(): Promise<void> {
    return this.core.requestVoid('internal/auth/refresh');
  }

  /** Returns the security settings of the current account. */
  getSettings(): Promise<SettingsResponse> {
    return this.core.requestJson<SettingsResponse>('internal/auth/settings', { method: 'POST' });
  }

  /**
   * Saves user settings.
   * @deprecated The endpoint does not accept a body and only returns the current settings. Use {@link getSettings} instead.
   */
  saveSettings(form: SettingsForm): Promise<void> {
    return this.core.requestVoid('internal/auth/settings', { method: 'POST', body: form });
  }

  /** Schedules the current account for deletion. */
  requestAccountDeletion(confirmation: string): Promise<void> {
    return this.core.requestVoid('internal/auth/account/delete', {
      method: 'POST',
      body: { content: confirmation },
    });
  }

  /** Cancels a pending deletion of the current account. */
  cancelAccountDeletion(): Promise<void> {
    return this.core.requestVoid('internal/auth/account/delete/cancel', { method: 'POST' });
  }

  /** Registers a new user account. */
  signup(form: SignupForm): Promise<void> {
    return this.core.requestVoid('internal/auth/signup', { method: 'POST', body: form });
  }

  // Backup codes

  /** Regenerates backup codes, requiring the current password. */
  regenerateBackupCodes(password: string): Promise<string[]> {
    return this.core.requestJson<string[]>('internal/auth/codes/regenerate', {
      method: 'POST',
      body: { content: password },
    });
  }

  /** Returns existing backup codes, requiring the current password. */
  showBackupCodes(password: string): Promise<string[]> {
    return this.core.requestJson<string[]>('internal/auth/codes/show', {
      method: 'POST',
      body: { content: password },
    });
  }

  // Email verification

  /** Sends an email verification code to the user's address. */
  sendEmailCode(): Promise<void> {
    return this.core.requestVoid('internal/auth/email/send', { method: 'POST', body: {} });
  }

  /** Verifies the user's email address with a code. */
  verifyEmail(form: VerifyCodeForm): Promise<void> {
    return this.core.requestVoid('internal/auth/email/verify', { method: 'POST', body: form });
  }

  // Password reset

  /** Sends a password reset email. */
  sendResetMail(form: ResetForm): Promise<void> {
    return this.core.requestVoid('internal/auth/reset/send', { method: 'POST', body: form });
  }

  /** Sets a new password using a reset code. */
  setNewPassword(form: SetPasswordForm): Promise<void> {
    return this.core.requestVoid('internal/auth/reset/set', { method: 'POST', body: form });
  }

  /** Verifies a password reset code. */
  verifyResetCode(form: VerifyCodeForm): Promise<void> {
    return this.core.requestVoid('internal/auth/reset/verify', { method: 'POST', body: form });
  }

  // TOTP

  /** Initiates TOTP setup and returns the secret and QR code. */
  setupTotp(): Promise<SetupTotpResponse> {
    return this.core.requestJson<SetupTotpResponse>('internal/auth/totp/setup', { method: 'POST', body: {} });
  }

  /** Registers TOTP for the current user. */
  registerTotp(form: TotpForm): Promise<void> {
    return this.core.requestVoid('internal/auth/totp/register', { method: 'POST', body: form });
  }

  /** Removes TOTP from the current user's account. */
  removeTotp(form: TotpForm): Promise<void> {
    return this.core.requestVoid('internal/auth/totp/remove', { method: 'POST', body: form });
  }

  /** Verifies a TOTP code. */
  verifyTotp(form: TotpForm): Promise<void> {
    return this.core.requestVoid('internal/auth/totp/verify', { method: 'POST', body: form });
  }

  // WebAuthn

  /** Initiates WebAuthn credential setup. */
  setupWebauthn(): Promise<WebAuthnSetupResponse> {
    return this.core.requestJson<WebAuthnSetupResponse>('internal/auth/webauthn/setup', { method: 'POST', body: {} });
  }

  /** Registers a WebAuthn credential. */
  registerWebauthn(form: WebAuthnRegisterForm): Promise<void> {
    return this.core.requestVoid('internal/auth/webauthn/register', { method: 'POST', body: form });
  }

  /** Renames a registered WebAuthn credential. */
  renameWebauthn(form: WebAuthnRenameForm): Promise<void> {
    return this.core.requestVoid('internal/auth/webauthn/rename', { method: 'POST', body: form });
  }

  /** Removes a registered WebAuthn credential. */
  unregisterWebauthn(form: WebAuthnUnregisterForm): Promise<void> {
    return this.core.requestVoid('internal/auth/webauthn/unregister', { method: 'POST', body: form });
  }

  /** Prepares a WebAuthn assertion challenge for login. */
  prepareWebauthnLogin(): Promise<WebAuthnSetupResponse> {
    return this.core.requestJson<WebAuthnSetupResponse>('internal/auth/webauthn/assert', { method: 'POST', body: {} });
  }

  // Login

  /** Logs in with a username and password. */
  loginPassword(form: LoginPasswordForm): Promise<void> {
    return this.core.requestVoid('internal/auth/login/password', { method: 'POST', body: form });
  }

  /** Completes login with a TOTP code. */
  loginTotp(form: LoginTotpForm): Promise<void> {
    return this.core.requestVoid('internal/auth/login/totp', { method: 'POST', body: form });
  }

  /** Completes login with a backup code. */
  loginBackup(form: LoginBackupForm): Promise<void> {
    return this.core.requestVoid('internal/auth/login/backup', { method: 'POST', body: form });
  }

  /** Completes login with a WebAuthn credential. */
  loginWebAuthn(form: LoginWebAuthnForm): Promise<void> {
    return this.core.requestVoid('internal/auth/login/webauthn', { method: 'POST', body: form });
  }

  /** Re-authenticates for a sudo action. */
  loginSudo(form: LoginSudoForm): Promise<void> {
    return this.core.requestVoid('internal/auth/login/sudo', { method: 'POST', body: form });
  }
}
