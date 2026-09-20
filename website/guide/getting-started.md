# Getting Started

## Installation

::: code-group

```sh [npm]
npm install hangarmc-js
```

```sh [pnpm]
pnpm add hangarmc-js
```

```sh [yarn]
yarn add hangarmc-js
```

```sh [bun]
bun add hangarmc-js
```

:::

## Create a client

```ts
import HangarClient from 'hangarmc-js';

const client = new HangarClient({
  apiKey: 'your-api-key',
  userAgent: 'my-app/1.0',
});
```

No API key is needed for public read operations.

## Fetch some data

```ts
const project = await client.projects.get('PaperMC', 'Hangar');
const versions = await client.versions.list('PaperMC', 'Hangar');
```

## Common options

```ts
const client = new HangarClient({
  baseUrl: 'https://hangar.papermc.io',
  apiKey: 'your-api-key',
  timeoutMs: 10_000,
  userAgent: 'my-app/1.0',
});
```

## Where to go next

- See [Authentication](/guide/authentication) for how JWT handling works
- See [Error Handling](/guide/error-handling) for catching and inspecting errors
- See [API Reference](/api/) for the generated public API docs
