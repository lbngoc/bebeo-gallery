---
name: add-album
description: Add a new photo album to BeBeo Gallery (src/_data/albums.json) from a Google Drive folder link or a pCloud publink. Discovers missing metadata (real folder title, capture date via EXIF) automatically where it can be trusted, pulls a representative thumbnail image, writes the albums.json entry, and validates + builds the site before reporting done. Trigger whenever the user pastes a Drive or pCloud album URL and asks to add/import it as a new album, or says things like "thêm album mới", "add album", "thêm album ảnh từ link Drive/pCloud này". Also trigger on a bare cloud folder link with no other context if the surrounding conversation is about the gallery's albums. Do NOT use this for editing a field on an album that's already in albums.json (just edit the JSON directly), and NOT for videos (different file, different shape — see videos.json).
compatibility: Google Drive links need the "claude.ai Google Drive" MCP connector authenticated (prompt the user to run /mcp if it isn't). pCloud links need the Playwright MCP. Thumbnail processing needs `magick` (ImageMagick) and `exiftool` on PATH.
---

## Why this exists

Adding an album by hand means: figuring out the real event name from a cryptic folder name, finding a real date, picking a decent representative photo, resizing it, and hand-writing a JSON entry that has to satisfy `scripts/validate-content.mjs` — then remembering to validate and rebuild before telling anyone it's live. This skill packages that whole round-trip so a pasted link becomes a working album card.

The two hardest parts to get right are auto-discovering metadata *without inventing it*, and finding a thumbnail that isn't a blurry postage stamp. Read `references/metadata-discovery.md` before the discovery step — it has the concrete techniques (Drive MCP calls, the pCloud lightbox trick, EXIF commands) that make the difference between a good result and a placeholder icon.

## Step 1 — Read what you're given

From the user's message, take:
- The cloud URL (required — if there isn't one, ask for it before doing anything else)
- Any metadata already supplied inline (title, date, location, category, description)

Infer `cloudProvider` from the URL host: `drive.google.com` → `google-drive`; `pcloud.link` or `pcloud.com` → `pcloud`; anything else → `other` (and treat it cautiously — the discovery steps below are written for Drive and pCloud specifically).

Whatever the user typed inline is ground truth — never second-guess or "improve" it. Only go looking for what's missing.

## Step 2 — Discover what's missing

Load `references/metadata-discovery.md` now and follow the branch for the provider. In short:

- **Google Drive folder**: `get_file_metadata` on the folder ID gives you the real folder title and owner. `search_files` with `parentId = '<id>'` lists the files — their `createdTime` is usually just when the batch was uploaded to Drive, not the real event date, so don't treat it as trustworthy on its own.
- **pCloud publink**: Playwright the URL. The page title and header are the real folder name. The grid thumbnails are small (~468×311); clicking one into the lightbox loads a much bigger preview (~600–900px, real filename in the URL) — that's your thumbnail source, and it's worth paging through a few images (`ArrowRight` in the lightbox) rather than grabbing the first one, since the first photos in a folder are often decor or crowd shots rather than the people the album is about.
- **Date**: the only source worth trusting automatically is EXIF `Date/Time Original` on an actually-downloaded photo. If you can download one (Drive allows it, or pCloud's lightbox preview is downloadable), run `exiftool` on it. If nothing gives a trustworthy date, don't guess — ask.
- **Location**: there is essentially never a reliable automatic source for this (no GPS EXIF in practice, folder names don't carry it). Always ask unless the user already gave it.
- **Title / categories**: a folder name is a *hint*, not an answer — especially cryptic studio-style names (photographer batch codes, initials, camera-body prefixes). Propose a natural Vietnamese title based on what you find, but confirm it with the user rather than assuming a name or event type from a code you can't actually verify. If a download-protected Drive folder blocks you from checking file content, say so plainly rather than guessing harder.

Whenever a value would otherwise be a guess — the year, the specific ceremony/event name, the location, which photo is "the" representative one — stop and ask the user (`AskUserQuestion` if you have it, otherwise just ask in text). This one habit is most of what makes this skill useful instead of just fast: a wrong date or a made-up event name in a family gallery is worse than a placeholder.

## Step 3 — Build the thumbnail

Pick one representative photo (people visible and recognizable, not just decor/crowd/backdrop) and:

1. Download or save it locally.
2. Resize with `magick <src> -resize <N>x<N> -quality 82 <dest>` — pick N so the longer edge lands roughly 1000–2200px; there's no need to go bigger, and going bigger just makes the repo heavier for no visual benefit at the sizes this site actually displays images (`cardImage` in `.eleventy.js` requests 400/800px outputs).
3. Save it to `src/assets/images/thumbnails/albums/<album-id>.jpg`.

Never commit the original/full-resolution file anywhere in the repo, even temporarily staged for commit — this project's constitution (`.specify/memory/constitution.md`, Principle III, "Không Lưu Trữ Media Gốc") specifically prohibits storing original media, only optimized thumbnails plus metadata. If the source is heavily protected (Drive owner disabled downloads — you'll see `download_file_content` fail with "session expired" for every file in that specific folder while other folders work fine) don't try to work around it. Tell the user, and either:
- leave `thumbnail` pointing at a path that doesn't exist yet — `cardImage` in `.eleventy.js` already renders a friendly 🖼️ placeholder for a missing file, so this degrades gracefully rather than breaking the build — or
- ask them to fix the sharing permission or send a different link (a pCloud share of the same folder, for instance).

## Step 4 — Write the albums.json entry

Read `src/_data/albums.json` first and append a new entry, preserving the existing entries and formatting exactly — this file is edited by hand elsewhere too, so don't reformat what you're not touching.

Schema (authoritative source: `specs/001-gallery-landing-page/contracts/content-schema.json`, enforced by `scripts/validate-content.mjs`):

| Field | Rule |
|---|---|
| `id` | kebab-case, `^[a-z0-9-]+$`, unique across every entry in this file |
| `title` | non-empty string, natural Vietnamese |
| `location` | non-empty string |
| `date` | `YYYY-MM` or `YYYY-MM-DD` |
| `description` | optional string |
| `categories` | array, at least 1 non-empty string |
| `thumbnail` | `/assets/images/thumbnails/albums/<id>.jpg` |
| `cloudUrl` | the http(s) URL, required |
| `cloudProvider` | `"google-drive"` \| `"pcloud"` \| `"other"` |

## Step 5 — Validate, build, and actually look at it

Do these in order and don't report success until all three pass:

1. `npm run validate:content` — must report 0 errors. If it doesn't, fix the entry and rerun; don't move on with a known-invalid file.
2. `rm -rf _site && npm run build` — must complete cleanly.
3. Start the dev server (`npm run dev`), open it with Playwright, scroll to the Gallery section, and confirm the new card actually looks right — real thumbnail or the graceful placeholder (whichever applies), correct title/location/date text, and its category shows up as a filter chip. Then stop the dev server. Before killing anything, check `lsof -iTCP -sTCP:LISTEN -P -n | grep node` — this environment sometimes already has an unrelated dev server on 8080 from another project; only stop the one you started.

A JSON file that merely validates isn't the same as a card that renders correctly — the visual check is what actually confirms you're done, not the validator alone.

## Reporting back

Summarize what got auto-discovered vs. what you asked the user for, name the final `id`, and mention explicitly if the thumbnail is a placeholder pending a permission fix. Don't claim "done" if any of validate/build/visual-check didn't happen.
