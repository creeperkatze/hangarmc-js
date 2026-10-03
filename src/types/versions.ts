import type { Platform } from './platforms.js';
import type { Visibility, ProjectChannel } from './projects.js';
import type { PaginationOptions } from './base.js';
import type { CreateApiKeyForm } from './keys.js';

/** Review state of a version. */
export type ReviewState = 'unreviewed' | 'reviewed' | 'under_review' | 'partially_reviewed';

/** Pin state of a version. */
export type PinnedStatus = 'NONE' | 'VERSION' | 'CHANNEL';

/** File metadata for a version download. */
export interface FileInfo {
  name: string;
  sha256Hash: string;
  sizeBytes: number;
}

/** Download information for a version on a specific platform. */
export interface PlatformVersionDownload {
  fileInfo?: FileInfo;
  /** External download URL if the file is not hosted on Hangar. */
  externalUrl?: string | null;
  /** Hangar download URL if the file is hosted on Hangar. */
  downloadUrl?: string | null;
}

/** A plugin dependency for a specific platform. */
export interface PluginDependency {
  name: string;
  projectId: number;
  required: boolean;
  platform: Platform;
  externalUrl?: string;
}

/** Download statistics for a version. */
export interface VersionStats {
  totalDownloads: number;
  platformDownloads: Record<string, number>;
}

/** A full version object. */
export interface Version {
  id: number;
  name: string;
  description: string;
  author: string;
  projectId: number;
  createdAt: string;
  channel: ProjectChannel;
  visibility: Visibility;
  reviewState: ReviewState;
  pinnedStatus: PinnedStatus;
  memberNames: string[];
  stats: VersionStats;
  downloads: Record<string, PlatformVersionDownload>;
  platformDependencies: Record<string, string[]>;
  platformDependenciesFormatted: Record<string, string[]>;
  pluginDependencies: Record<string, PluginDependency[]>;
}

/** Metadata returned after uploading a version. */
export interface UploadedVersion {
  url: string;
}

/** Platform and version details for a version upload. */
export interface VersionUploadPlatform {
  platform: Platform;
  versions: string[];
}

/** Plugin dependency entry in an upload form. */
export interface VersionUploadDependency {
  /** For Hangar projects, the project name. */
  name: string;
  /** Project id of the dependency. Only for Hangar projects. */
  projectId?: number;
  required: boolean;
  /** Download URL of the dependency if it is not a Hangar project. */
  externalUrl?: string;
  platform: Platform;
}

/** Request body sent as the JSON part of a version upload multipart request. */
export interface VersionUpload {
  /** Version string, e.g. `1.0.0-SNAPSHOT+1`. */
  version: string;
  /** Name of the channel to publish the version under, e.g. `Release`. */
  channel: string;
  description?: string;
  /** Jars/external links that make up the version (1–3 entries). */
  files: VersionUploadFile[];
  /** Map of platforms to the platform versions this version runs on. */
  platformDependencies: Partial<Record<Platform, string[]>>;
  /** Map of platforms to their plugin dependencies. */
  pluginDependencies?: Partial<Record<Platform, VersionUploadDependency[]>>;
}

/** A file entry in a version upload. Entries without `externalUrl` are matched to the uploaded files in order. */
export interface VersionUploadFile {
  platforms: Platform[];
  externalUrl?: string;
}

/**
 * Request body for the create-API-key form.
 * @deprecated Use {@link CreateApiKeyForm} instead.
 */
export type CreateApiKeyBody = CreateApiKeyForm;

/** Query parameters for listing versions. */
export interface ListVersionsOptions extends PaginationOptions {
  includeHiddenChannels?: boolean;
  channel?: string;
  platform?: Platform | string;
  platformVersion?: string;
}

/** Query parameters for fetching version stats. */
export interface GetVersionStatsOptions {
  /** First date to include, as an ISO 8601 date-time (e.g. `2024-01-01T00:00:00Z`). */
  fromDate: string;
  /** Last date to include, as an ISO 8601 date-time. */
  toDate: string;
}
