import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { jsonResponse, errorResponse } from '../utils/http.js';
import { HangarError } from '../../src/errors.js';
import type { Project, ProjectMember } from '../../src/types/index.js';

const MOCK_PROJECT: Project = {
  id: 1,
  name: 'TestPlugin',
  namespace: { owner: 'PaperMC', slug: 'TestPlugin' },
  description: 'A test plugin',
  category: 'misc',
  visibility: 'public',
  avatarUrl: 'https://example.com/avatar.png',
  createdAt: '2024-01-01T00:00:00Z',
  lastUpdated: '2024-06-01T00:00:00Z',
  mainPageContent: '# Welcome',
  memberNames: ['TestUser'],
  stats: { views: 100, downloads: 50, recentViews: 10, recentDownloads: 5, stars: 20, watchers: 15 },
  settings: {
    license: { name: 'MIT', type: 'MIT' },
    keywords: ['test'],
    sponsors: '',
    donation: { enable: false, subject: '' },
    links: [],
    tags: [],
    unlisted: false,
  },
  userActions: { starred: false, watching: false, flagged: false },
  supportedPlatforms: { PAPER: ['1.20', '1.21'] },
};

describe('ProjectsApi', () => {
  it('fetches a project by author and slug', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_PROJECT)]);
    const project = await client.projects.get('PaperMC', 'TestPlugin');
    expect(project).toEqual(MOCK_PROJECT);
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin');
  });

  it('throws HangarError on 404', async () => {
    const { client } = createTestClient([errorResponse(404, { message: 'Not found' })]);
    await expect(client.projects.get('PaperMC', 'NonExistent')).rejects.toThrow(HangarError);
  });

  it('fetches a paginated project list', async () => {
    const paginated = { pagination: { offset: 0, limit: 10, count: 1 }, result: [MOCK_PROJECT] };
    const { client, mockFetch } = createTestClient([jsonResponse(paginated)]);
    const result = await client.projects.list({ limit: 10 });
    expect(result.result).toHaveLength(1);
    expect(mockFetch.lastCall()?.url).toContain('limit=10');
  });

  it('fetches paginated project members', async () => {
    const member: ProjectMember = {
      user: 'TestUser',
      userId: 1,
      title: 'Owner',
      permissions: ['is_subject_owner', 'edit_page'],
    };
    const paginated = { pagination: { offset: 0, limit: 5, count: 1 }, result: [member] };
    const { client, mockFetch } = createTestClient([jsonResponse(paginated)]);
    const result = await client.projects.getMembers('PaperMC', 'TestPlugin', { limit: 5 });
    expect(result).toEqual(paginated);
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin/members');
    expect(mockFetch.lastCall()?.url).toContain('limit=5');
  });

  it('fetches project stargazers', async () => {
    const paginated = { pagination: { offset: 0, limit: 25, count: 0 }, result: [] };
    const { client, mockFetch } = createTestClient([jsonResponse(paginated)]);
    await client.projects.getStargazers('PaperMC', 'TestPlugin');
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin/stargazers');
  });

  it('fetches project watchers', async () => {
    const paginated = { pagination: { offset: 0, limit: 25, count: 0 }, result: [] };
    const { client, mockFetch } = createTestClient([jsonResponse(paginated)]);
    await client.projects.getWatchers('PaperMC', 'TestPlugin', { offset: 25 });
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin/watchers');
    expect(mockFetch.lastCall()?.url).toContain('offset=25');
  });
});
