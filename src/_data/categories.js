import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Global data file (quy ước Eleventy: mọi file .js trong _data/ trở thành
// dữ liệu toàn cục theo tên file). Rút danh sách chủ đề duy nhất, đã sắp
// xếp, từ albums.json — không lưu category như một entity/file riêng để
// tránh hai nguồn sự thật (xem data-model.md > Category).
export default function () {
  const albums = JSON.parse(readFileSync(path.join(dirname, "albums.json"), "utf-8"));

  const unique = new Set();
  for (const album of albums) {
    for (const category of album.categories || []) {
      unique.add(category);
    }
  }

  return [...unique].sort((a, b) => a.localeCompare(b, "vi"));
}
