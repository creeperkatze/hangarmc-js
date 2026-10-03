import type { HangarClientCore } from './core.js';
import type { Platform, PlatformVersion } from '../types/index.js';

/** API namespace for platform data. */
export class PlatformsApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns all supported versions for a specific platform, including their sub-versions. */
  getVersions(platform: Platform | string): Promise<PlatformVersion[]> {
    return this.core.requestJson<PlatformVersion[]>(
      `v1/platforms/${encodeURIComponent(platform)}/versions`,
    );
  }
}
