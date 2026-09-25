# Metadata discovery techniques

Concrete steps for the two supported providers. Read the branch you need; skip the other.

## Google Drive folders

Parse the folder ID out of the URL: `https://drive.google.com/drive/folders/<FOLDER_ID>`.

1. **Get the real folder name** — folder names shown to an anonymous browser visitor are often hidden or truncated; the MCP connector sees the real one:
   ```
   mcp__claude_ai_Google_Drive__get_file_metadata(fileId: "<FOLDER_ID>")
   ```
   Returns `title`, `owner`, `createdTime`, `modifiedTime`. If this fails with an auth error, tell the user to run `/mcp` and select "claude.ai Google Drive", then retry.

2. **List files in the folder**:
   ```
   mcp__claude_ai_Google_Drive__search_files(query: "parentId = '<FOLDER_ID>'", pageSize: 5, excludeContentSnippets: true)
   ```
   Gives filenames, sizes, `createdTime`/`modifiedTime` per file. If every file in the folder shares the exact same timestamp (down to the same batch), that's almost always the *upload* time, not the real event date — do not treat it as the album's date.

3. **Try to get a real date via EXIF** — pick one JPEG file, then:
   ```
   mcp__claude_ai_Google_Drive__download_file_content(fileId: "<file id>")
   ```
   This has a ~10MB response cap and can time out or return "session expired" — if it fails once, retry once or twice sequentially (not in parallel; concurrent calls to this tool are flaky in practice). Decode the returned base64 `content` to a file, then:
   ```
   exiftool <file> | grep -iE "date|create"
   ```
   Look for `Date/Time Original` — that's the real capture date. `Create Date` / `Modify Date` from the container format are less reliable than `Date/Time Original` from the camera's own EXIF block.

4. **If downloads fail consistently for every file in this folder** (not just a flaky retry — reliably "session expired" every time while other folders work fine), the owner has disabled download/copy permission at the Drive sharing level for this specific folder. Don't try to route around it (proxying through a different tool, scraping the anonymous view, etc.) — that's the owner's explicit restriction. Tell the user directly what you observed and offer the fallback options from Step 3 of SKILL.md.

## pCloud publinks

URL shape: `https://u.pcloud.link/publink/show?code=<CODE>`.

1. **Navigate and read the title**:
   ```
   mcp__playwright__browser_navigate(url: "<the link>")
   ```
   The page title (`<Folder Name> - pCloud`) and the on-page header both show the real folder name — no auth needed, no hidden-name problem like Drive's anonymous view has.

2. **Collect thumbnail candidates from the grid**:
   ```js
   Array.from(document.querySelectorAll('img')).map(img => img.src)
   ```
   via `browser_evaluate`. These are pCloud's own thumbnail CDN URLs (`th1.pcloud.com/...` etc.), but they're small — typically ~468×311 or smaller. Good enough to *browse and pick from*, not good enough to ship as the final thumbnail.

3. **Open the lightbox for a bigger version**: click an `<img>` (via `browser_evaluate`, find it by matching part of its `src` and call `.click()`, or click the element directly if you have a snapshot ref). The URL will gain a `#/filemanager?...&gallery=open` fragment. Then:
   ```js
   Array.from(document.querySelectorAll('img'))
     .filter(i => i.naturalHeight > 400)
     .map(i => ({src: i.src, w: i.naturalWidth, h: i.naturalHeight}))
   ```
   This is the actual lightbox preview image — typically ~600–900px on the long side, with the real original filename embedded in the URL path. That resolution is exactly the range you want for this project's thumbnails (see SKILL.md Step 3), and it downloads with a plain `curl`, no auth needed.

4. **Look for a good representative photo before settling on one.** The first images in these folders are frequently decor, crowd, or bridesmaid/groomsman group shots rather than the actual subject(s) of the album. Page forward in the lightbox with the keyboard rather than grabbing image #1:
   ```js
   // repeat as needed, in batches, checking a screenshot every so often
   for (let i = 0; i < N; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80); }
   ```
   A `browser_run_code_unsafe` call is the efficient way to do a batch of key presses without one round-trip per press. Take a screenshot every 10–40 presses and look for a clean shot of the actual people the album is about — a portrait or a moment where they're clearly recognizable tends to make a much better card thumbnail than a wide group or decor shot, especially since this site's Gallery cards crop to a portrait aspect ratio.

5. **Download the chosen one** with a plain `curl -sL <lightbox img src> -o <file>` — no cookies or auth required for the publink's own CDN-hosted preview.

## General notes

- Never trust a folder-name code (e.g. photographer batch prefixes, camera-body initials, arbitrary numbers) as if it were a date or an event name on its own — these are studio/internal conventions, not user-facing facts. Confirm the interpretation with the user instead of presenting a guess as fact.
- If the user gives you two folders that turn out to be genuinely different events (confirm via the real folder title / any on-image event banner / backdrop text visible in photos, which is often the most reliable ground truth of all — event names and dates are frequently printed right on the ceremony backdrop), treat them as two separate albums rather than merging.
