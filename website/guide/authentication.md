# Authentication

Hangar uses short-lived JWTs issued against an API key.

## API key

Create an API key in your Hangar account settings, then pass it at client creation time:

```ts
const client = new HangarClient({
  apiKey: 'your-api-key',
});
```

When you call an endpoint that requires authentication the client will automatically obtain a JWT, cache it, and attach it as an `Authorization: HangarAuth <token>` header.

## Unauthenticated usage

All public read operations work without an API key:

```ts
const client = new HangarClient();

const project = await client.projects.get('PaperMC', 'Hangar');
```

Calling an authenticated endpoint without an `apiKey` will throw a `HangarError`.

## Token lifecycle

The client will:

- fetch a token once and cache it in memory
- refresh the token automatically when it expires (with a 5-second buffer)

## Related methods

- [`client.auth.authenticate(apiKey)`](/api/classes/AuthApi#authenticate)
- [`client.permissions.get(options?)`](/api/classes/PermissionsApi#get)
- [`client.permissions.hasAll(options)`](/api/classes/PermissionsApi#hasall)
- [`client.permissions.hasAny(options)`](/api/classes/PermissionsApi#hasany)
