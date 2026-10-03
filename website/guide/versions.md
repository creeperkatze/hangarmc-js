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

Fetch daily download counts between two dates. Requires an API key with membership in the project, and dates must be ISO 8601 date-times:

```ts
const stats = await client.versions.getStats('PaperMC', 'Hangar', '1.2.3', {
  fromDate: '2024-01-01T00:00:00Z',
  toDate: '2024-01-31T00:00:00Z',
});
```

## Upload a version

Upload a new version with one or more platform files. Entries in `files` without an `externalUrl` are matched to the uploaded files in order.

```ts
const { url } = await client.versions.create('PaperMC', 'Hangar', {
  version: '1.2.3',
  channel: 'Release',
  files: [{ platforms: ['PAPER'] }],
  platformDependencies: { PAPER: ['1.20', '1.21'] },
}, [paperFile]);
```
