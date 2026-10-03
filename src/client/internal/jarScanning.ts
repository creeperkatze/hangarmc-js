import type { HangarClientCore } from '../core.js';
import type { Platform } from '../../types/index.js';

/** Jar scan result for a specific platform. */
export interface JarScanResult {
  id: number;
  createdAt: string;
  platform: Platform;
  highestSeverity: string;
  entries: JarScanEntry[];
}

/** An individual entry from a jar scan. */
export interface JarScanEntry {
  id: number;
  checkName: string;
  location: string;
  message: string;
  severity: string;
  /** Whether the entry was reviewed and marked as safe. */
  checked: boolean;
  checkedAt?: string | null;
  checkedBy?: number | null;
}

/** Internal API namespace for jar scanning. */
export class InternalJarScanningApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns scan results for all platforms of a version. */
  getResults(versionId: number): Promise<Record<string, JarScanResult>> {
    return this.core.requestJson<Record<string, JarScanResult>>(
      `internal/jarscanning/result/${versionId}`,
    );
  }

  /** Returns the scan result for a specific platform of a version. */
  getResult(versionId: number, platform: Platform | string): Promise<JarScanResult> {
    return this.core.requestJson<JarScanResult>(
      `internal/jarscanning/result/${versionId}/${encodeURIComponent(platform)}`,
    );
  }

  /** Triggers a jar scan for a specific platform of a version. */
  scan(versionId: number, platform: Platform | string): Promise<void> {
    return this.core.requestVoid(
      `internal/jarscanning/scan/${versionId}/${encodeURIComponent(platform)}`,
      { method: 'POST', body: {} },
    );
  }

  /** Marks a single scan entry as safe. */
  markSafe(entryId: number): Promise<void> {
    return this.core.requestVoid(`internal/jarscanning/mark-safe/${entryId}`, { method: 'POST' });
  }

  /** Marks all entries of a scan result as safe. */
  markAllSafe(resultId: number): Promise<void> {
    return this.core.requestVoid(`internal/jarscanning/mark-all-safe/${resultId}`, { method: 'POST' });
  }
}
