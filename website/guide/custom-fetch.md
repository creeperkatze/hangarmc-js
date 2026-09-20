# Custom Fetch

## Injecting a fetch implementation

You can provide your own `fetch` for non-standard runtimes or to add middleware such as logging or retry logic.

```ts
import HangarClient from 'hangarmc-js';
import fetch from 'node-fetch';

const client = new HangarClient({
  apiKey: 'your-api-key',
  fetch,
});
```

## User-Agent

Set a custom `User-Agent` once at client creation time:

```ts
const client = new HangarClient({
  userAgent: 'my-dashboard/1.0',
});
```

The value is sent on every request made by that client instance.

## Timeout

The default request timeout is 10 000 ms. Override it with `timeoutMs`:

```ts
const client = new HangarClient({
  timeoutMs: 30_000,
});
```

A timed-out request throws a `HangarError` with `status: 0`.

## Self-hosted instances

Point the client at a self-hosted Hangar instance by overriding `baseUrl`:

```ts
const client = new HangarClient({
  baseUrl: 'https://hangar.example.com',
  apiKey: 'your-api-key',
});
```
