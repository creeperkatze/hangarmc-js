import type { HangarClientCore } from './core.js';
import { HangarError } from '../errors.js';
import type {
  Version,
  VersionUpload,
  VersionStats,
  UploadedVersion,
  Platform,
  ListVersionsOptions,
  GetVersionStatsOptions,
} from '../types/index.js';
import type { PaginatedResult } from '../types/base.js';

/** API namespace for project versions. */
export class VersionsApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns all versions for a project (paginated). */
  list(
    author: string,
    slug: string,
    options?: ListVersionsOptions,
  ): Promise<PaginatedResult<Version>> {
    return this.core.requestJson<PaginatedResult<Version>>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/versions`,
      { query: options },
    );
  }

  /** Returns a single version by name. */
  get(author: string, slug: string, name: string): Promise<Version> {
    return this.core.requestJson<Version>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/versions/${encodeURIComponent(name)}`,
    );
  }

  /**
   * Uploads a new version. Requires create_version permission.
   * @param files - Version files in the order of the entries in `data.files` that have no `externalUrl`.
   */
  create(
    author: string,
    slug: string,
    data: VersionUpload,
    files?: Blob[],
  ): Promise<UploadedVersion> {
    const form = new FormData();
    form.set('versionUpload', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (files) {
      for (const file of files) {
        form.append('files', file);
      }
    }
    return this.core.requestJson<UploadedVersion>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/upload`,
      { method: 'POST', body: form, authenticated: true },
    );
  }

  /**
   * Returns daily download stats for a version, keyed by date. Requires is_subject_member permission.
   * Dates must be ISO 8601 date-times (e.g. `2024-01-01T00:00:00Z`).
   */
  getStats(
    author: string,
    slug: string,
    name: string,
    options: GetVersionStatsOptions,
  ): Promise<Record<string, VersionStats>> {
    return this.core.requestJson<Record<string, VersionStats>>(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/versions/${encodeURIComponent(name)}/stats`,
      { query: options, authenticated: true },
    );
  }

  /** Returns the download URL (Hangar CDN or external) for a version on a specific platform. */
  async getDownloadUrl(
    author: string,
    slug: string,
    name: string,
    platform: Platform | string,
  ): Promise<string> {
    const version = await this.get(author, slug, name);
    const download = version.downloads[platform];
    const url = download?.downloadUrl ?? download?.externalUrl;
    if (!url) {
      throw new HangarError(`Version ${name} has no download for platform ${platform}`);
    }
    return url;
  }

  /** Downloads a version file as an ArrayBuffer. */
  download(
    author: string,
    slug: string,
    name: string,
    platform: Platform | string,
  ): Promise<ArrayBuffer> {
    return this.core.requestArrayBuffer(
      `v1/projects/${encodeURIComponent(author)}/${encodeURIComponent(slug)}/versions/${encodeURIComponent(name)}/${encodeURIComponent(platform)}/download`,
    );
  }
}
