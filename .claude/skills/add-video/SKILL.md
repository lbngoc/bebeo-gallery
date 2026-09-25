---
name: add-video
description: Add one or more featured videos to BeBeo Gallery (src/_data/videos.json) from a YouTube video/playlist link, a Google Drive file link, or a pCloud publink. Parses the URL for sourceType and embedRef per this project's video-embed contract, pulls the real title automatically for YouTube/pCloud, generates a poster thumbnail (YouTube: fetched from YouTube's own thumbnail CDN; other sources: needs a supplied image), writes the videos.json entry/entries, and validates + builds + play-tests the modal before reporting done. Trigger whenever the user pastes a YouTube/Drive/pCloud video or playlist URL and asks to add it to the site's video section, or says things like "thêm video mới", "add video", "thêm video từ link này", "thêm playlist này vào video nổi bật". Do NOT use for editing an existing video entry (edit videos.json directly) or for photo albums (see the add-album skill and albums.json instead).
compatibility: Google Drive file links need the "claude.ai Google Drive" MCP connector authenticated (prompt the user to run /mcp if it isn't). pCloud links need the Playwright MCP. YouTube playlist import needs Playwright to read the playlist page. Poster processing needs `magick` (ImageMagick) on PATH.
---

## Why this exists

`videos.json` has a small, strict shape, and the one part that's easy to get wrong is `embedRef` — its meaning is entirely different per `sourceType`, and getting it wrong means the modal silently fails to embed (falls back to "open on cloud" instead of playing in-page). This skill encodes the exact contract so that doesn't happen, and handles the tedious part (fetching a real, sharp poster image) the same way it was done by hand the first time this site's video data was populated.

Read `references/embed-contract.md` for the exact `sourceType` → `embedRef` → embed-URL mapping before writing anything — getting this wrong is the main way this task goes sideways.

## Step 1 — Figure out what you're adding

One video, or a playlist?

- **A single video URL** (YouTube watch link, Drive file link, or pCloud publink) → one new entry.
- **A YouTube playlist URL** (`youtube.com/playlist?list=...` or a watch URL with a `&list=` param) → Playwright the playlist page and read every video in it (title, video ID, order) in one pass — this is more reliable and faster than asking the user to paste each video individually. Confirm the count with the user before writing anything if it's a large playlist, since every one becomes a real entry in the carousel.

Whatever title/poster/order the user supplies inline for a given video is ground truth — don't override it. Only fetch what's missing.

## Step 2 — Get the real title and embedRef

- **YouTube** (single video or each item in a playlist): the page title / playlist item heading is the real, correct video title — use it as-is, no need to ask the user to confirm wording (unlike album event names, there's no ambiguity to resolve here). Parse the video ID out of the URL (`watch?v=<id>`, `youtu.be/<id>`, or the playlist item's own link) for `embedRef`.
- **Google Drive file**: `mcp__claude_ai_Google_Drive__get_file_metadata` on the file ID gives you the real filename — turn it into a natural title (strip extensions/camera-prefix noise the same way you would for an album, per add-album's discovery notes). The file ID from the URL (`/file/d/<id>/`) is the `embedRef` directly.
- **pCloud**: Playwright the publink to read the real filename/title from the page. Getting the actual embeddable link pCloud requires (see `references/embed-contract.md`) usually needs the owner to have generated a public embed/preview link specifically — if the publink itself doesn't resolve to something embeddable, say so and ask the user for the embed link pCloud gives them under the file's "chia sẻ công khai" / public-share option, rather than guessing at a URL shape that might not actually embed.

## Step 3 — Poster (thumbnail) image

- **YouTube**: fetch directly, no auth, no scraping needed:
  ```
  curl -sL "https://img.youtube.com/vi/<video-id>/maxresdefault.jpg" -o poster.jpg
  ```
  Check the result is actually ~1280×720 (`identify poster.jpg`) — if `maxresdefault` doesn't exist for a video, YouTube can return a small placeholder despite a 200 status, so verify dimensions and fall back to `sddefault.jpg` (640×480) or `hqdefault.jpg` (480×360) if needed. Prefer the highest-resolution one that actually exists — this project's card/carousel images get requested at up to 800px wide, and a low-res source there just means a blurry upscaled thumbnail, which was a real bug fixed once already on this project.
- **Google Drive / pCloud video files**: there's no equivalent public thumbnail endpoint. Ask the user for a poster image (a still frame they export themselves) rather than trying to scrape a video-player preview frame — that's fragile and not worth the complexity for something the user can supply directly in a few seconds.
- Whatever the source, resize with `magick <src> -quality 85 <dest>` (no need to resize down further if it's already ≤1280px on the long side) and save to `src/assets/images/thumbnails/videos/<video-id>.jpg`.

## Step 4 — Write the videos.json entry

Read `src/_data/videos.json` first and append, preserving existing entries/formatting.

Schema (authoritative source: `specs/001-gallery-landing-page/contracts/content-schema.json` and `specs/001-gallery-landing-page/contracts/video-embed-contract.md`, enforced by `scripts/validate-content.mjs`):

| Field | Rule |
|---|---|
| `id` | kebab-case, `^[a-z0-9-]+$`, unique across every entry in this file |
| `title` | non-empty string — the real video title, see Step 2 |
| `poster` | `/assets/images/thumbnails/videos/<id>.jpg` |
| `sourceType` | `"youtube"` \| `"google-drive"` \| `"pcloud"` |
| `embedRef` | meaning depends on `sourceType` — see `references/embed-contract.md`, don't guess |
| `fallbackUrl` | http(s) URL that opens the video directly on its source if the in-page embed fails |
| `order` | optional integer ≥ 0 — if adding to an existing list, continue the existing sequence (max existing `order` + 1, or + 1, + 2, … for a playlist) unless the user specifies where it should sit |

For a playlist import, write one entry per video, in the playlist's own order.

## Step 5 — Validate, build, and actually play it

Same discipline as any content change to this site — don't report success on the JSON validating alone:

1. `npm run validate:content` — must report 0 errors.
2. `rm -rf _site && npm run build` — must complete cleanly.
3. Start the dev server (`npm run dev`), open it with Playwright, scroll to the Video section, confirm the new card(s) show the right poster and title, click one open, and confirm the modal actually loads the embed (check the iframe's `src` matches the expected pattern for its `sourceType` — this is the single most likely place for a silent mistake) rather than falling back to the "open on cloud" message. Then stop the dev server — check `lsof -iTCP -sTCP:LISTEN -P -n | grep node` first and only stop the one you started, since this environment sometimes already has an unrelated dev server running on 8080.

## Reporting back

List the new entries added (id, title, sourceType), note anything you had to ask the user for (a poster image, an embed link pCloud wouldn't give you automatically), and confirm the modal play-test passed.
