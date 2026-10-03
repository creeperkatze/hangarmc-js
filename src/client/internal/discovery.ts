import type { HangarClientCore } from '../core.js';
import type { ProjectCompact, ProjectNamespace } from '../../types/index.js';

/** A project excluded from discovery. */
export interface ExcludedProject {
  projectId: number;
  name: string;
  namespace: ProjectNamespace;
  excludedBy: string;
  createdAt: string;
}

/** Internal API namespace for project discovery. */
export class InternalDiscoveryApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns today's featured projects. */
  getDaily(): Promise<ProjectCompact[]> {
    return this.core.requestJson<ProjectCompact[]>('internal/discovery/daily');
  }

  /** Returns all projects excluded from discovery. */
  getExcluded(): Promise<ExcludedProject[]> {
    return this.core.requestJson<ExcludedProject[]>('internal/discovery/excluded');
  }

  /** Excludes a project from discovery. */
  exclude(projectId: number): Promise<void> {
    return this.core.requestVoid(`internal/discovery/exclude/${projectId}`, { method: 'POST' });
  }

  /** Includes a previously excluded project in discovery again. */
  include(projectId: number): Promise<void> {
    return this.core.requestVoid(`internal/discovery/include/${projectId}`, { method: 'POST' });
  }
}
