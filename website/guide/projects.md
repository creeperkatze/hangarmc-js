# Projects

Browse and manage Hangar projects.

## Get a project

```ts
const project = await client.projects.get('PaperMC', 'Hangar');
// project.name, project.namespace, project.stats, project.settings, …
```

## Search and list

```ts
const results = await client.projects.list({
  query: 'permissions',
  platform: 'PAPER',
  category: 'admin_tools',
  limit: 10,
  offset: 0,
});

for (const project of results.result) {
  console.log(project.namespace.owner, project.namespace.slug);
}
```

## Members and channels

```ts
const members = await client.projects.getMembers('PaperMC', 'Hangar');
const channels = await client.projects.getChannels('PaperMC', 'Hangar');
```

## Statistics

Fetch daily view and download counts between two dates:

```ts
const stats = await client.projects.getStats('PaperMC', 'Hangar', {
  fromDate: '2024-01-01',
  toDate: '2024-01-31',
});
// stats['2024-01-15'] → { views: number, downloads: number }
```

## Starred and watched projects

```ts
const starred  = await client.projects.getStarred('SomeUser');
const watching = await client.projects.getWatching('SomeUser');
const pinned   = await client.projects.getPinned('SomeUser');
```

## Pages

```ts
const mainPage = await client.pages.getMain('PaperMC', 'Hangar');
const wikiPage = await client.pages.get('PaperMC', 'Hangar', 'setup');

// Edit a page (requires edit_page permission)
await client.pages.edit('PaperMC', 'Hangar', {
  path: 'setup',
  content: '# Setup\n\nContent here.',
});
```
