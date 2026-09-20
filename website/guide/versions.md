# Versions

Browse, download, and manage plugin versions.

## List versions

```ts
const versions = await client.versions.list('PaperMC', 'Hangar', {
  platform: 'PAPER',
  channel: 'Release',
  limit: 10,
});

for (const version of versions.result) {
  console.log(version.name, version.channel.name);
}
```

## Get a specific version

```ts
const version = await client.versions.get('PaperMC', 'Hangar', '1.2.3');
```

## Download a version

```ts
// Get the download URL for a platform
const url = await client.versions.getDownloadUrl('PaperMC', 'Hangar', '1.2.3', 'PAPER');

// Or download the file directly as an ArrayBuffer
const buffer = await client.versions.download('PaperMC', 'Hangar', '1.2.3', 'PAPER');
```

## Statistics

Fetch daily download counts between two dates:

```ts
const stats = await client.versions.getStats('PaperMC', 'Hangar', '1.2.3', {
  fromDate: '2024-01-01',
  toDate: '2024-01-31',
});
```

## Upload a version

Upload a new version with one or more platform files.

```ts
await client.versions.create('PaperMC', 'Hangar', {
  channel: { name: 'Release', color: '#22c55e', flags: [] },
  platformDependencies: { PAPER: ['1.20', '1.21'] },
  pluginDependencies: {},
}, [paperFile]);
```

## Delete and restore

```ts
// Soft-delete (moves to trash)
await client.versions.delete('PaperMC', 'Hangar', '1.2.3');

// Restore a soft-deleted version (requires restore_version permission)
await client.versions.restore('PaperMC', 'Hangar', '1.2.3');
```
