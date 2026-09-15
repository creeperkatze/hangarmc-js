# hangarmc-js

A framework-agnostic fully typed JavaScript client for the Hangar API by PaperMC.

[![NPM Version](https://img.shields.io/npm/v/hangarmc-js)](https://www.npmjs.com/package/hangarmc-js)
[![NPM Downloads](https://img.shields.io/npm/dt/hangarmc-js)](https://www.npmjs.com/package/hangarmc-js)
[![GitHub Branch Check Runs](https://img.shields.io/github/check-runs/creeperkatze/hangarmc-js/main)](https://github.com/creeperkatze/hangarmc-js/actions)
[![Codecov](https://img.shields.io/codecov/c/github/creeperkatze/hangarmc-js)](https://codecov.io/github/creeperkatze/hangarmc-js)
[![GitHub Issues](https://img.shields.io/github/issues/creeperkatze/hangarmc-js)](https://github.com/creeperkatze/hangarmc-js/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/creeperkatze/hangarmc-js)](https://github.com/creeperkatze/hangarmc-js/pulls)
[![GitHub Repo stars](https://img.shields.io/github/stars/creeperkatze/hangarmc-js?style=flat)](https://github.com/creeperkatze/hangarmc-js/stargazers)

[📚 Docs](https://hangarmc-js.creeperkatze.dev/) •
[🚀 Getting Started](https://hangarmc-js.creeperkatze.dev/guide/getting-started) •
[📖 API Reference](https://hangarmc-js.creeperkatze.dev/api) •
[📝 Changelog](https://github.com/creeperkatze/hangarmc-js/releases)

## 📦 Installation

```sh
npm install hangarmc-js
pnpm add hangarmc-js
yarn add hangarmc-js
bun add hangarmc-js
```

## 🚀 Usage

```ts
import HangarClient from 'hangarmc-js';

const client = new HangarClient({
  apiKey: 'your-api-key',
  userAgent: 'my-app/1.0',
});

const project = await client.projects.get('PaperMC', 'Hangar');
const versions = await client.versions.list('PaperMC', 'Hangar');

console.log(project);
console.log(versions);
```

## 📖 API

### `new HangarClient(options)`

```ts
const client = new HangarClient({
  baseUrl: 'https://hangar.papermc.io',
  apiKey: 'your-api-key',
  timeoutMs: 10_000,
  userAgent: 'my-app/1.0',
});
```

### Options

```ts
interface HangarClientOptions {
  baseUrl?: string;   // default: "https://hangar.papermc.io"
  apiKey?: string;
  timeoutMs?: number; // default: 10000
  userAgent?: string;
  fetch?: typeof globalThis.fetch;
}
```

### Selected Methods

Auth:
- `client.auth.authenticate(apiKey)`

Keys:
- `client.keys.list(user)`
- `client.keys.create(user, form)`
- `client.keys.delete(user, name)`

Pages:
- `client.pages.getMain(author, slug)`
- `client.pages.get(author, slug, path?)`
- `client.pages.edit(author, slug, form)`
- `client.pages.delete(author, slug, path)`

Permissions:
- `client.permissions.get(options?)`
- `client.permissions.hasAll(options)`
- `client.permissions.hasAny(options)`

Platforms:
- `client.platforms.list()`
- `client.platforms.getVersions(platform)`

Projects:
- `client.projects.list(options?)`
- `client.projects.get(author, slug)`
- `client.projects.getStats(author, slug, options)`
- `client.projects.getMembers(author, slug)`
- `client.projects.getChannels(author, slug)`
- `client.projects.getPinned(user)`
- `client.projects.getStarred(user, options?)`
- `client.projects.getWatching(user, options?)`

Users:
- `client.users.get(user)`
- `client.users.list(options?)`
- `client.users.listAuthors(options?)`
- `client.users.listStaff(options?)`

Versions:
- `client.versions.list(author, slug, options?)`
- `client.versions.get(author, slug, name)`
- `client.versions.create(author, slug, data, files?)`
- `client.versions.delete(author, slug, name)`
- `client.versions.restore(author, slug, name)`
- `client.versions.getStats(author, slug, name, options)`
- `client.versions.getDownloadUrl(author, slug, name, platform)`
- `client.versions.download(author, slug, name, platform)`

## 🔐 Authentication

Unauthenticated requests work for all public read operations. If you provide an `apiKey`, the client will automatically obtain and cache a JWT for endpoints that require authentication.

```ts
const client = new HangarClient({
  apiKey: 'your-api-key',
});

// JWT is fetched and cached automatically
const keys = await client.keys.list('YourUsername');
```

The token is refreshed automatically when it expires (with a 5-second buffer).

## 🌐 Custom Fetch

You can inject your own `fetch` implementation.

```ts
import HangarClient from 'hangarmc-js';
import fetch from 'node-fetch';

const client = new HangarClient({
  apiKey: 'your-api-key',
  fetch,
});
```

## ⚠️ Error Handling

All request, authentication, timeout, and API errors are thrown as `HangarError`.

```ts
import HangarClient, { HangarError } from 'hangarmc-js';

const client = new HangarClient({ apiKey: 'your-api-key' });

try {
  await client.projects.get('PaperMC', 'NonExistent');
} catch (error) {
  if (error instanceof HangarError) {
    console.error(error.status);
    console.error(error.message);
    console.error(error.body);
  }
}
```

## 🔧 Internal API

The client also exposes the Hangar internal API (used by the frontend) under `client.internal`. These endpoints are undocumented and may change without notice.

```ts
const health = await client.internal.health.get();
const data = await client.internal.data.getCategories();
```

Available namespaces: `admin`, `apiKeys`, `auth`, `channels`, `data`, `flags`, `globalData`, `health`, `jarScanning`, `notifications`, `oauth`, `onboarding`, `organizations`, `pages`, `projects`, `reviews`, `users`, `versions`.

## 👨‍💻 Development

```sh
pnpm build

pnpm test
```

## 🤝 Contributing

Contributions are always welcome!

Please ensure you run `pnpm lint:fix` before opening a pull request.

## 📜 License

MIT
