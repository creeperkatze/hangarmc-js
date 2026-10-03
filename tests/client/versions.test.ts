import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { jsonResponse } from '../utils/http.js';
import { HangarError } from '../../src/errors.js';
import type { Version, VersionStats } from '../../src/types/index.js';

const MOCK_JWT = { token: 'test-jwt', expiresIn: 3_600_000 };

const MOCK_VERSION: Version = {
  id: 1,
  name: '1.0.0',
  description: 'Initial release',
  author: 'TestUser',
  projectId: 42,
  createdAt: '2024-01-01T00:00:00Z',
  channel: { name: 'Release', description: '', color: '#22c55e', flags: [], createdAt: '2024-01-01T00:00:00Z' },
  visibility: 'public',
  reviewState: 'reviewed',
  pinnedStatus: 'NONE',
  memberNames: ['TestUser'],
  stats: { totalDownloads: 100, platformDownloads: { PAPER: 100 } },
  downloads: {},
  platformDependencies: {},
  platformDependenciesFormatted: {},
  pluginDependencies: {},
};

const PAGINATED = { pagination: { offset: 0, limit: 10, count: 1 }, result: [MOCK_VERSION] };

describe('VersionsApi', () => {
  it('lists versions for a project', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(PAGINATED)]);
    const result = await client.versions.list('PaperMC', 'TestPlugin');
    expect(result.result).toHaveLength(1);
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin/versions');
  });

  it('passes list options as query parameters', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(PAGINATED)]);
    await client.versions.list('PaperMC', 'TestPlugin', { platform: 'PAPER', limit: 5 });
    expect(mockFetch.lastCall()?.url).toContain('platform=PAPER');
    expect(mockFetch.lastCall()?.url).toContain('limit=5');
  });

  it('fetches a single version by name', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_VERSION)]);
    const version = await client.versions.get('PaperMC', 'TestPlugin', '1.0.0');
    expect(version).toEqual(MOCK_VERSION);
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin/versions/1.0.0');
  });

  it('uploads a version as multipart form data and requires auth', async () => {
    const uploaded = { url: 'https://hangar.papermc.io/PaperMC/TestPlugin/versions/1.0.1' };
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_JWT), jsonResponse(uploaded)]);
    const data = {
      version: '1.0.1',
      channel: 'Release',
      files: [{ platforms: ['PAPER' as const] }],
      platformDependencies: { PAPER: ['1.21'] },
    };
    const result = await client.versions.create('PaperMC', 'TestPlugin', data, [new Blob(['jar'])]);
    expect(result).toEqual(uploaded);

    const call = mockFetch.lastCall();
    expect(call?.method).toBe('POST');
    expect(call?.url).toMatch(/\/api\/v1\/projects\/PaperMC\/TestPlugin\/upload$/);
    expect(call?.headers.get('Authorization')).toBe('HangarAuth test-jwt');
    const form = await call!.formData();
    expect(JSON.parse(await (form.get('versionUpload') as Blob).text())).toEqual(data);
    expect(form.getAll('files')).toHaveLength(1);
  });

  it('fetches daily stats for a version with auth', async () => {
    const stats: Record<string, VersionStats> = {
      '2024-01-01': { totalDownloads: 5, platformDownloads: { PAPER: 5 } },
    };
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_JWT), jsonResponse(stats)]);
    const result = await client.versions.getStats('PaperMC', 'TestPlugin', '1.0.0', {
      fromDate: '2024-01-01T00:00:00Z',
      toDate: '2024-01-31T00:00:00Z',
    });
    expect(result).toEqual(stats);
    expect(mockFetch.lastCall()?.url).toContain('/api/v1/projects/PaperMC/TestPlugin/versions/1.0.0/stats');
    expect(mockFetch.lastCall()?.url).toContain('fromDate=2024-01-01T00%3A00%3A00Z');
    expect(mockFetch.lastCall()?.headers.get('Authorization')).toBe('HangarAuth test-jwt');
  });

  it('resolves the Hangar download URL from the version', async () => {
    const version: Version = {
      ...MOCK_VERSION,
      downloads: { PAPER: { downloadUrl: 'https://hangarcdn.papermc.io/file.jar', externalUrl: null } },
    };
    const { client, mockFetch } = createTestClient([jsonResponse(version)]);
    const url = await client.versions.getDownloadUrl('PaperMC', 'TestPlugin', '1.0.0', 'PAPER');
    expect(url).toBe('https://hangarcdn.papermc.io/file.jar');
    expect(mockFetch.lastCall()?.url).toMatch(/\/api\/v1\/projects\/PaperMC\/TestPlugin\/versions\/1\.0\.0$/);
  });

  it('falls back to the external download URL', async () => {
    const version: Version = {
      ...MOCK_VERSION,
      downloads: { PAPER: { downloadUrl: null, externalUrl: 'https://example.com/file.jar' } },
    };
    const { client } = createTestClient([jsonResponse(version)]);
    const url = await client.versions.getDownloadUrl('PaperMC', 'TestPlugin', '1.0.0', 'PAPER');
    expect(url).toBe('https://example.com/file.jar');
  });

  it('throws when the version has no download for the platform', async () => {
    const { client } = createTestClient([jsonResponse(MOCK_VERSION)]);
    await expect(
      client.versions.getDownloadUrl('PaperMC', 'TestPlugin', '1.0.0', 'VELOCITY'),
    ).rejects.toThrow(HangarError);
  });

  it('downloads a version file as an ArrayBuffer', async () => {
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const { client } = createTestClient([new Response(bytes.buffer)]);
    const buffer = await client.versions.download('PaperMC', 'TestPlugin', '1.0.0', 'PAPER');
    expect(buffer).toBeInstanceOf(ArrayBuffer);
    expect(new Uint8Array(buffer)[0]).toBe(0x50);
  });

  it('does not require authentication for read operations', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_VERSION)]);
    await client.versions.get('PaperMC', 'TestPlugin', '1.0.0');
    expect(mockFetch.callCount()).toBe(1);
    expect(mockFetch.lastCall()?.headers.get('Authorization')).toBeNull();
  });
});
