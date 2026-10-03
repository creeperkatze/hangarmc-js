import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { jsonResponse } from '../utils/http.js';
import type { PlatformVersion } from '../../src/types/index.js';

const MOCK_PLATFORM_VERSIONS: PlatformVersion[] = [
  { version: '1.20', subVersions: ['1.20.1', '1.20.2'] },
  { version: '1.21', subVersions: ['1.21.1'] },
];

describe('PlatformsApi', () => {
  it('does not require authentication', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse([])]);
    await client.platforms.getVersions('PAPER');
    expect(mockFetch.callCount()).toBe(1);
    expect(mockFetch.lastCall()?.headers.get('Authorization')).toBeNull();
  });

  it('fetches versions for a specific platform', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_PLATFORM_VERSIONS)]);
    const versions = await client.platforms.getVersions('PAPER');
    expect(versions).toEqual(MOCK_PLATFORM_VERSIONS);
    expect(mockFetch.lastCall()?.url).toMatch(/\/api\/v1\/platforms\/PAPER\/versions$/);
  });

  it('encodes the platform name in the URL', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse([])]);
    await client.platforms.getVersions('CUSTOM PLATFORM');
    expect(mockFetch.lastCall()?.url).toContain('CUSTOM%20PLATFORM');
  });
});
