import type { HangarClientCore } from './core.js';
import type { PageEditForm } from '../types/index.js';

/** API namespace for project pages. */
export class PagesApi {
  constructor(private readonly core: HangarClientCore) {}

  /** Returns the main page content for a project. */
  getMain(author: string, slug: string): Promise<string> {
    return this.core.requestText(
      `v1/pages/main/${encodeURIComponent(author)}/${encodeURIComponent(slug)}`,
    );
  }

  /** Returns the content of a project wiki page. */
  get(author: string, slug: string, path?: string): Promise<string> {
    return this.core.requestText(
      `v1/pages/page/${encodeURIComponent(author)}/${encodeURIComponent(slug)}`,
      { query: path ? { path } : undefined },
    );
  }

  /** Creates or updates a project wiki page. Requires edit_page permission. */
  edit(author: string, slug: string, form: PageEditForm): Promise<void> {
    return this.core.requestVoid(
      `v1/pages/edit/${encodeURIComponent(author)}/${encodeURIComponent(slug)}`,
      { method: 'PATCH', body: form, authenticated: true },
    );
  }

  /** Updates the main page of a project. Requires edit_page permission. */
  editMain(author: string, slug: string, content: string): Promise<void> {
    return this.core.requestVoid(
      `v1/pages/editmain/${encodeURIComponent(author)}/${encodeURIComponent(slug)}`,
      { method: 'PATCH', body: { content }, authenticated: true },
    );
  }

  /** Deletes a project wiki page. Requires edit_page permission. */
  delete(author: string, slug: string, path: string): Promise<void> {
    return this.core.requestVoid(
      `v1/pages/delete/${encodeURIComponent(author)}/${encodeURIComponent(slug)}`,
      { method: 'DELETE', query: { path }, authenticated: true },
    );
  }
}
