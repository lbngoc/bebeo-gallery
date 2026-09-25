# Embed contract and discovery techniques

This mirrors `specs/001-gallery-landing-page/contracts/video-embed-contract.md` — read that file too if anything here is unclear, it's the authoritative source. `video-modal.js`'s `buildEmbedUrl()` is the code that actually consumes these fields; getting `sourceType`/`embedRef` wrong doesn't fail validation (the schema just checks they're non-empty strings) — it fails silently at runtime as a broken embed, so this is worth double-checking by eye, not just trusting the validator.

## The three `sourceType` values

| `sourceType` | `embedRef` holds | Resulting iframe `src` |
|---|---|---|
| `youtube` | YouTube video ID only (e.g. `dQw4w9WgXcQ`) — **not** a full URL | `https://www.youtube-nocookie.com/embed/{embedRef}` |
| `google-drive` | Google Drive file ID (the `{fileId}` segment of `https://drive.google.com/file/d/{fileId}/view`) | `https://drive.google.com/file/d/{embedRef}/preview` |
| `pcloud` | A full, public, embeddable preview link pCloud generated for the file — used as-is | `{embedRef}` directly, unchanged |

`fallbackUrl` is always a full URL that opens the video directly on its source, shown when the embed fails to load or the source refuses to be framed (e.g. an `X-Frame-Options` rejection):
- youtube: `https://www.youtube.com/watch?v={id}`
- google-drive: `https://drive.google.com/file/d/{id}/view`
- pcloud: the publink page itself

## Getting a YouTube video ID out of any link shape

- `https://www.youtube.com/watch?v=<ID>` → `<ID>` (strip any `&list=...&index=...` params — those describe the playlist context, not the video)
- `https://youtu.be/<ID>` → `<ID>`
- A playlist item's own link (see below) already isolates `v=<ID>` the same way

## Reading a YouTube playlist in one pass

Navigate to `https://www.youtube.com/playlist?list=<LIST_ID>` (or the watch URL with `&list=` — either works, but the plain playlist URL gives a cleaner page) with Playwright and take a snapshot. Each item renders as a heading + link with the video's real title, its `/watch?v=<id>&list=...&index=<n>` URL (video ID and playlist position both come straight out of this link — no separate lookup needed), and its own duration. This one page load gives you everything needed for every video in the playlist — title, ID, and order — without visiting each video individually.

## Getting a YouTube poster at the best resolution that actually exists

```bash
for variant in maxresdefault sddefault hqdefault; do
  curl -s -o "/tmp/test_${variant}.jpg" -w "%{http_code}\n" "https://img.youtube.com/vi/<video-id>/${variant}.jpg"
  identify "/tmp/test_${variant}.jpg"
done
```

`maxresdefault` (1280×720) exists for most reasonably-recent uploads but not all; when it doesn't exist YouTube can still return HTTP 200 with a small filler image, so check the actual pixel dimensions rather than trusting the status code alone, and use the first variant in the list above whose dimensions look right (not a tiny placeholder).

## Google Drive file title and ID

Same MCP calls as the add-album skill:
```
mcp__claude_ai_Google_Drive__get_file_metadata(fileId: "<FILE_ID>")
```
`title` in the response is the real filename — turn it into a natural video title (strip the extension and any camera/studio-prefix noise) the same way you would an album folder name. The file ID is already in the URL you were given (`/file/d/<FILE_ID>/...`), so there's no separate ID-extraction step needed beyond parsing the URL.

## pCloud

Playwright the publink the same way as for albums (see the add-album skill's `references/metadata-discovery.md` for the general technique) to confirm the real filename/title. Getting a link that actually satisfies the `pcloud` `embedRef` contract (a public, iframe-embeddable preview URL) is not always the same as the publink itself — pCloud sometimes requires the owner to explicitly generate a "public embed" link from the file's share settings, distinct from the plain view-in-browser publink. If Playwright-loading the publink doesn't show something that looks like a directly embeddable player (versus pCloud's own full page chrome), don't guess at a URL transformation — ask the user for the specific embed link pCloud gave them.
