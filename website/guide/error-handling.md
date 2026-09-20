# Error Handling

All request failures (network errors, timeouts, and API errors) throw a `HangarError`.

## Catching errors

```ts
import HangarClient, { HangarError } from 'hangarmc-js';

try {
  await client.projects.get('PaperMC', 'NonExistent');
} catch (err) {
  if (err instanceof HangarError) {
    console.error(err.status, err.message);
  }
}
```

## HangarError properties

| Property | Type | Description |
|---|---|---|
| `message` | `string` | Human-readable description |
| `status` | `number` | HTTP status code, or `0` for network/timeout errors |
| `body` | `unknown` | Raw response body if available |
| `response` | `Response \| undefined` | The raw fetch `Response` if available |

## Common status codes

- `401` - missing or invalid API key
- `403` - insufficient permissions for the requested operation
- `404` - the requested resource does not exist
- `0` - the request never reached the server (network error, timeout, DNS failure)

## Distinguishing error types

```ts
try {
  await client.versions.create('PaperMC', 'Hangar', data);
} catch (err) {
  if (!(err instanceof HangarError)) throw err; // re-throw unexpected errors

  if (err.status === 0) {
    // Network or timeout - Hangar may be unreachable
  } else if (err.status === 401) {
    // Auth failure - check your API key
  } else if (err.status === 403) {
    // Permission denied - check your API key's permissions
  } else {
    // API error - inspect err.body for details
  }
}
```
