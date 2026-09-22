#!/usr/bin/env node
// Validate src/_data/albums.json và src/_data/videos.json theo hợp đồng
// specs/001-gallery-landing-page/contracts/content-schema.json trước khi build.
// Không dùng thư viện JSON Schema ngoài — kiểm tra thủ công cho phù hợp
// Nguyên tắc I (đơn giản, tránh dependency không cần thiết) của hiến pháp.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ALBUMS_PATH = path.join(ROOT, "src/_data/albums.json");
const VIDEOS_PATH = path.join(ROOT, "src/_data/videos.json");
const HERO_BACKGROUND_PATH = path.join(ROOT, "src/_data/heroBackground.json");

const ID_PATTERN = /^[a-z0-9-]+$/;
const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}(-[0-9]{2})?$/;
const URL_PATTERN = /^https?:\/\//;
const CLOUD_PROVIDERS = new Set(["google-drive", "pcloud", "other"]);
const VIDEO_SOURCE_TYPES = new Set(["youtube", "google-drive", "pcloud"]);
const HERO_FILTER_MODES = new Set(["mono", "tinted"]);

let errors = [];

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`[${label}] Không tìm thấy file: ${filePath}`);
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    errors.push(`[${label}] JSON không hợp lệ: ${err.message}`);
    return null;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateAlbum(album, index, seenIds) {
  const label = `albums[${index}]${album && album.id ? ` (id="${album.id}")` : ""}`;

  if (typeof album !== "object" || album === null) {
    errors.push(`[${label}] Bản ghi phải là object`);
    return;
  }

  if (!isNonEmptyString(album.id) || !ID_PATTERN.test(album.id)) {
    errors.push(`[${label}] field "id" bắt buộc, chỉ gồm chữ thường/số/gạch ngang`);
  } else if (seenIds.has(album.id)) {
    errors.push(`[${label}] "id" trùng lặp: ${album.id}`);
  } else {
    seenIds.add(album.id);
  }

  for (const field of ["title", "location", "thumbnail", "cloudUrl"]) {
    if (!isNonEmptyString(album[field])) {
      errors.push(`[${label}] field "${field}" bắt buộc và không được rỗng`);
    }
  }

  if (!isNonEmptyString(album.date) || !DATE_PATTERN.test(album.date)) {
    errors.push(`[${label}] field "date" bắt buộc, định dạng YYYY-MM hoặc YYYY-MM-DD`);
  }

  if (!Array.isArray(album.categories) || album.categories.length === 0) {
    errors.push(`[${label}] field "categories" bắt buộc, phải có ít nhất 1 phần tử`);
  } else if (!album.categories.every((c) => isNonEmptyString(c))) {
    errors.push(`[${label}] mọi phần tử trong "categories" phải là chuỗi không rỗng`);
  }

  if (isNonEmptyString(album.cloudUrl) && !URL_PATTERN.test(album.cloudUrl)) {
    errors.push(`[${label}] "cloudUrl" phải là URL hợp lệ (http:// hoặc https://)`);
  }

  if (album.cloudProvider !== undefined && !CLOUD_PROVIDERS.has(album.cloudProvider)) {
    errors.push(`[${label}] "cloudProvider" phải thuộc [google-drive, pcloud, other]`);
  }
}

function validateVideo(video, index, seenIds) {
  const label = `videos[${index}]${video && video.id ? ` (id="${video.id}")` : ""}`;

  if (typeof video !== "object" || video === null) {
    errors.push(`[${label}] Bản ghi phải là object`);
    return;
  }

  if (!isNonEmptyString(video.id) || !ID_PATTERN.test(video.id)) {
    errors.push(`[${label}] field "id" bắt buộc, chỉ gồm chữ thường/số/gạch ngang`);
  } else if (seenIds.has(video.id)) {
    errors.push(`[${label}] "id" trùng lặp: ${video.id}`);
  } else {
    seenIds.add(video.id);
  }

  for (const field of ["title", "poster", "embedRef", "fallbackUrl"]) {
    if (!isNonEmptyString(video[field])) {
      errors.push(`[${label}] field "${field}" bắt buộc và không được rỗng`);
    }
  }

  if (!isNonEmptyString(video.sourceType) || !VIDEO_SOURCE_TYPES.has(video.sourceType)) {
    errors.push(`[${label}] "sourceType" phải thuộc [youtube, google-drive, pcloud]`);
  }

  if (isNonEmptyString(video.fallbackUrl) && !URL_PATTERN.test(video.fallbackUrl)) {
    errors.push(`[${label}] "fallbackUrl" phải là URL hợp lệ (http:// hoặc https://)`);
  }

  if (video.order !== undefined && (!Number.isInteger(video.order) || video.order < 0)) {
    errors.push(`[${label}] "order" nếu có phải là số nguyên >= 0`);
  }
}

function validateHeroBackground(config) {
  const label = "heroBackground.json";

  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    errors.push(`[${label}] Nội dung phải là một object`);
    return;
  }

  if (config.image !== undefined && config.image !== null && !isNonEmptyString(config.image)) {
    errors.push(`[${label}] field "image" nếu có phải là chuỗi không rỗng hoặc null`);
  }

  if (config.filter !== undefined && !HERO_FILTER_MODES.has(config.filter)) {
    errors.push(`[${label}] "filter" nếu có phải thuộc [mono, tinted]`);
  }
}

const albums = readJson(ALBUMS_PATH, "albums.json");
if (Array.isArray(albums)) {
  const seenIds = new Set();
  albums.forEach((album, index) => validateAlbum(album, index, seenIds));
} else if (albums !== null) {
  errors.push("[albums.json] Nội dung phải là một mảng (array)");
}

const videos = readJson(VIDEOS_PATH, "videos.json");
if (Array.isArray(videos)) {
  const seenIds = new Set();
  videos.forEach((video, index) => validateVideo(video, index, seenIds));
} else if (videos !== null) {
  errors.push("[videos.json] Nội dung phải là một mảng (array)");
}

// heroBackground.json là TUỲ CHỌN (khác albums/videos): không tồn tại thì bỏ
// qua hoàn toàn, không phải lỗi — Hero sẽ tự dùng nền trừu tượng mặc định.
if (fs.existsSync(HERO_BACKGROUND_PATH)) {
  const heroBackground = readJson(HERO_BACKGROUND_PATH, "heroBackground.json");
  if (heroBackground !== null) validateHeroBackground(heroBackground);
}

if (errors.length > 0) {
  console.error(`\n✖ Nội dung không hợp lệ (${errors.length} lỗi):\n`);
  for (const err of errors) console.error(`  - ${err}`);
  console.error("\nXem lại contracts/content-schema.json hoặc data-model.md để biết chi tiết.\n");
  process.exit(1);
}

console.log(
  `✓ Nội dung hợp lệ: ${Array.isArray(albums) ? albums.length : 0} album, ${
    Array.isArray(videos) ? videos.length : 0
  } video.`,
);
