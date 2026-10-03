import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { jsonResponse, textResponse } from '../utils/http.js';

const MOCK_JWT = { token: 'test-jwt', expiresIn: 3_600_000 };

describe('PagesApi', () => {
  it('fetches the main page content as text', async () => {
    const { client, mockFetch } = createTestClient([textResponse('# Hello World')]);
    const content = await client.pages.getMain('PaperMC', 'TestPlugin');
    expect(content).toBe('# Hello World');
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/pages/main/PaperMC/TestPlugin');
  });

  it('always sends the path, even when empty (main page)', async () => {
    const { client, mockFetch } = createTestClient([textResponse('## Wiki Page')]);
    const content = await client.pages.get('PaperMC', 'TestPlugin', '');
    expect(content).toBe('## Wiki Page');
    expect(mockFetch.lastCall()?.url).toMatch(/\/api\/v1\/pages\/page\/PaperMC\/TestPlugin\?path=$/);
  });

  it('appends the path query parameter', async () => {
    const { client, mockFetch } = createTestClient([textResponse('## Sub Page')]);
    await client.pages.get('PaperMC', 'TestPlugin', 'docs/setup');
    expect(mockFetch.lastCall()?.url).toContain('path=docs%2Fsetup');
  });

  it('encodes author and slug in URL', async () => {
    const { client, mockFetch } = createTestClient([textResponse('')]);
    await client.pages.getMain('Paper MC', 'Test Plugin');
    expect(mockFetch.lastCall()?.url).toContain('Paper%20MC');
    expect(mockFetch.lastCall()?.url).toContain('Test%20Plugin');
  });

  it('edits a page with PATCH and requires auth', async () => {
    const { client, mockFetch } = createTestClient([
      jsonResponse(MOCK_JWT),
      new Response(null, { status: 204 }),
    ]);
    await expect(
      client.pages.edit('PaperMC', 'TestPlugin', { path: 'docs', content: '## Content' }),
    ).resolves.toBeUndefined();
    expect(mockFetch.lastCall()?.method).toBe('PATCH');
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/pages/edit/PaperMC/TestPlugin');
    expect(mockFetch.lastCall()?.headers.get('Authorization')).toBe('HangarAuth test-jwt');
  });

  it('edits the main page with PATCH and requires auth', async () => {
    const { client, mockFetch } = createTestClient([
      jsonResponse(MOCK_JWT),
      new Response(null, { status: 204 }),
    ]);
    await expect(client.pages.editMain('PaperMC', 'TestPlugin', '# Main')).resolves.toBeUndefined();
    const call = mockFetch.lastCall();
    expect(call?.method).toBe('PATCH');
    expect(call?.url).toContain('/api/v1/pages/editmain/PaperMC/TestPlugin');
    expect(call?.headers.get('Authorization')).toBe('HangarAuth test-jwt');
    expect(await call?.json()).toEqual({ content: '# Main' });
  });
});
