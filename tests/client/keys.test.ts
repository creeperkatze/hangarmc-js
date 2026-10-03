import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { jsonResponse, textResponse, errorResponse } from '../utils/http.js';
import { HangarError } from '../../src/errors.js';
import type { ApiKey } from '../../src/types/index.js';

const MOCK_JWT = { token: 'test-jwt', expiresIn: 3_600_000 };
const MOCK_KEY: ApiKey = {
  name: 'MyKey',
  createdAt: '2024-01-01T00:00:00Z',
  tokenIdentifier: 'abc123',
  permissions: ['view_public_info'],
  projectScoped: false,
  projects: [],
};

describe('KeysApi', () => {
  it('lists API keys of the current user', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_JWT), jsonResponse([MOCK_KEY])]);
    const keys = await client.keys.list();
    expect(keys).toEqual([MOCK_KEY]);
    expect(mockFetch.lastCall()?.url).toMatch(/\/api\/v1\/keys(\?|$)/);
  });

  it('attaches Authorization header when listing keys', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_JWT), jsonResponse([])]);
    await client.keys.list();
    expect(mockFetch.lastCall()?.headers.get('Authorization')).toBe('HangarAuth test-jwt');
  });

  it('creates a new API key and returns the token', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_JWT), textResponse('new-secret')]);
    const token = await client.keys.create({ name: 'NewKey', permissions: ['edit_api_keys'] });
    expect(token).toBe('new-secret');
    expect(mockFetch.lastCall()?.method).toBe('POST');
    expect(mockFetch.lastCall()?.url).toMatch(/\/api\/v1\/keys(\?|$)/);
  });

  it('sends expiration and project scope when creating a key', async () => {
    const { client, mockFetch } = createTestClient([jsonResponse(MOCK_JWT), textResponse('scoped-secret')]);
    const form = {
      name: 'ScopedKey',
      permissions: ['create_version' as const],
      expiresAt: '2027-01-01T00:00:00Z',
      projects: ['TestPlugin'],
    };
    await client.keys.create(form);
    expect(await mockFetch.lastCall()?.json()).toEqual(form);
  });

  it('deletes an API key by name', async () => {
    const { client, mockFetch } = createTestClient([
      jsonResponse(MOCK_JWT),
      new Response(null, { status: 204 }),
    ]);
    await expect(client.keys.delete('MyKey')).resolves.toBeUndefined();
    expect(mockFetch.lastCall()?.method).toBe('DELETE');
    expect(mockFetch.lastCall()?.url).toContain('name=MyKey');
  });

  it('throws HangarError on 403', async () => {
    const { client } = createTestClient([jsonResponse(MOCK_JWT), errorResponse(403, { message: 'Forbidden' })]);
    await expect(client.keys.list()).rejects.toThrow(HangarError);
  });
});
