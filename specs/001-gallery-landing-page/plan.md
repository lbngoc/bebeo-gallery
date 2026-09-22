# Implementation Plan: Trang Landing Page BeBeo Gallery

**Branch**: `001-gallery-landing-page` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-gallery-landing-page/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Xây dựng một landing page tĩnh, một trang (single-page), gồm 3 section chính
(Hero, Gallery, Video) cộng header/footer, cho phép gia đình duyệt album ảnh
(lọc theo chủ đề, mở link gốc trên cloud) và xem video nổi bật (phát trong
modal ngay trên trang). Toàn bộ nội dung (album, video, chủ đề) là metadata +
thumbnail lưu dưới dạng file JSON tĩnh trong repo — không có database, không
có backend runtime. Trang build bằng Eleventy (11ty) + Vite (qua plugin chính
thức `@11ty/eleventy-plugin-vite`), style bằng Tailwind CSS v4, tương tác
client (filter, modal, theme toggle, section-snap scroll trên desktop) bằng
Alpine.js — đúng theo stack quy định của hiến pháp dự án.

## Technical Context

**Language/Version**: JavaScript (ES2022+), Node.js 20 LTS (build tooling only — output là static HTML/CSS/JS, không có server runtime)

**Primary Dependencies**: Eleventy (11ty) v3, `@11ty/eleventy-plugin-vite` v7 (tích hợp Vite chính thức), Vite v5+, Tailwind CSS v4 (qua `@tailwindcss/vite`), Alpine.js v3, `@11ty/eleventy-img` (tối ưu/responsive thumbnail)

**Storage**: File phẳng — `src/_data/albums.json` và `src/_data/videos.json` (11ty global data), versioned trong git; ảnh thumbnail đã tối ưu lưu trong `src/assets/images/thumbnails/`. Không có database, không có ORM (theo Nguyên tắc I của hiến pháp).

**Testing**: Script Node kiểm tra schema nội dung khi build (`scripts/validate-content.mjs`, chạy trong `npm run build`) + checklist xác thực thủ công (`quickstart.md`) cho các hành vi tương tác/hiển thị (filter, modal, section-snap, theme toggle, responsive). Không dùng framework e2e nặng (Playwright/Cypress) ở v1 — không tương xứng với quy mô một trang cá nhân/gia đình (xem research.md).

**Target Platform**: Trình duyệt web hiện đại (desktop + mobile/tablet), deploy dưới dạng static site lên bất kỳ static host nào (Netlify/Vercel/GitHub Pages/self-host)

**Project Type**: web (single static frontend project — không có phần backend riêng)

**Performance Goals**: Hero hiển thị nhanh (không chờ tải toàn bộ ảnh gallery); ảnh thumbnail lazy-load khi cuộn tới; hiệu ứng cuộn/section-snap và mở modal mượt (target 60fps, không giật trên thiết bị di động tầm trung)

**Constraints**: Không database/backend runtime (Nguyên tắc I); không lưu media gốc, chỉ metadata + thumbnail nhỏ (Nguyên tắc III); giao diện MUST mobile-first, không phụ thuộc hover/màn hình rộng (Nguyên tắc II); MUST tôn trọng `prefers-reduced-motion` (FR-016); quy mô nội dung ~10-50 album, 5-15 video nổi bật, không cần phân trang (FR-017, đã chốt ở Clarifications)

**Scale/Scope**: 1 landing page (single route), 3 section chính + header/footer, ~10-50 album ảnh, 5-15 video nổi bật, lượng truy cập thấp (phạm vi gia đình, không thiết kế cho traffic công cộng quy mô lớn)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate (từ constitution.md) | Đánh giá | Kết quả |
|---|---|---|---|
| 1 | Nguyên tắc I — Đơn giản & không database phức tạp | Metadata lưu ở `src/_data/*.json` (flat file, versioned), không ORM, không DB server, không backend runtime | **PASS** |
| 2 | Nguyên tắc II — Ưu tiên di động (Mobile-First) | Tailwind mobile-first breakpoints; FR-012 yêu cầu cuộn tự nhiên trên mobile/tablet thay vì snap-scroll; không tính năng nào chỉ hoạt động qua hover | **PASS** |
| 3 | Nguyên tắc III — Không lưu trữ media gốc | Chỉ lưu metadata + thumbnail tối ưu (`eleventy-img`); album/video trỏ tới URL cloud gốc (FR-007, FR-014) | **PASS** |
| 4 | Nguyên tắc IV — Kiến trúc site tĩnh với stack quy định | Dùng đúng 11ty + Vite + Tailwind CSS + Alpine.js; output static assets; không thêm SPA framework/backend/DB | **PASS** |
| 5 | Nguyên tắc V — Riêng tư & phạm vi gia đình | Đã chốt ở Clarifications: trang công khai, không auth — nhất quán với Nguyên tắc I (không kéo theo hệ thống xác thực phức tạp) | **PASS** |
| 6 | Ràng buộc công nghệ & kiến trúc (Section 2) | Lưu trữ dữ liệu = file phẳng versioned trong git; build/deploy = static output; thumbnail tối ưu trước khi commit | **PASS** |
| 7 | Quy trình quản lý nội dung (Section 3) | Thêm album/video = thêm entry JSON + thumbnail, không ghi runtime vào DB; mọi thay đổi qua sửa file + rebuild/redeploy | **PASS** |

Không có vi phạm nào cần giải trình → mục **Complexity Tracking** bên dưới để trống.

**Re-check sau Phase 1 (design)**: Đã rà lại toàn bộ 7 gate ở trên sau khi
hoàn tất `research.md`, `data-model.md`, và `contracts/`. Các quyết định
thiết kế (2 file JSON phẳng cho album/video, category tính toán từ dữ liệu
album thay vì file riêng, iframe cho cả 3 nguồn video, CSS snap + lớp JS mỏng
cho section-scroll, không thêm framework/DB/backend nào) không phát sinh vi
phạm mới. **Kết quả re-check: PASS toàn bộ, không có thay đổi so với lần
đánh giá trước Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-gallery-landing-page/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── content-schema.json
│   └── video-embed-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── _data/
│   ├── albums.json          # Danh sách album (metadata + thumbnail ref + categories + cloudUrl)
│   ├── videos.json           # Danh sách video nổi bật (metadata + source + embed ref)
│   └── categories.11tydata.js  # Computed data: rút danh sách chủ đề duy nhất từ albums.json
├── _includes/
│   ├── layouts/
│   │   └── base.njk          # Layout gốc: <head>, theme init script, header, footer
│   └── partials/
│       ├── header.njk        # Logo + nav trái-phải + theme toggle
│       ├── footer.njk        # Copyright + Back to Top
│       ├── hero.njk          # Section Hero
│       ├── gallery.njk       # Section Gallery: grid/masonry + filter chips
│       ├── album-card.njk    # 1 thẻ album (thumbnail nền + tiêu đề + mô tả)
│       ├── video-section.njk # Section Video: carousel
│       └── video-modal.njk   # Modal phát video (iframe theo nguồn)
├── assets/
│   ├── styles/
│   │   └── main.css          # Tailwind entry (@import "tailwindcss")
│   ├── scripts/
│   │   ├── main.js           # Khởi tạo Alpine + đăng ký các component/store
│   │   ├── theme-store.js    # Alpine store: theme sáng/tối + localStorage
│   │   ├── gallery-filter.js # Alpine component: lọc album theo chủ đề
│   │   ├── video-modal.js    # Alpine component: mở/đóng modal + chọn nguồn embed
│   │   └── section-scroll.js # Wheel/keydown handler cho snap-scroll desktop (tôn trọng FR-012/016/018)
│   ├── images/
│   │   └── thumbnails/
│   │       ├── albums/       # Thumbnail gốc cho từng album (trước khi eleventy-img xử lý)
│   │       └── videos/       # Poster/thumbnail cho từng video nổi bật
│   └── fonts/                # Font viết tay cho logo + font chữ chính (self-hosted)
├── index.njk                  # Trang landing page (ghép Hero + Gallery + Video)
├── .eleventy.js                # Cấu hình Eleventy + eleventy-plugin-vite + eleventy-img
├── vite.config.js
└── tailwind.config.js         # (hoặc cấu hình CSS-first trong main.css nếu dùng Tailwind v4 thuần)

scripts/
└── validate-content.mjs       # Kiểm tra schema albums.json/videos.json khi build (xem contracts/content-schema.json)

package.json
```

**Structure Decision**: Chọn **single static frontend project** (không tách
`frontend/`/`backend/` vì không có backend runtime — nhất quán với Nguyên tắc
I và IV của hiến pháp). Toàn bộ mã nguồn nằm dưới `src/` theo cấu trúc chuẩn
của Eleventy (data cascade qua `_data/`, template qua `_includes/`, asset qua
`assets/` được Vite xử lý), cộng thêm `scripts/validate-content.mjs` ở root
làm bước kiểm tra chất lượng dữ liệu khi build. Không có thư mục `tests/`
dạng unit/integration/contract truyền thống vì chiến lược kiểm thử ở mức này
là script validate schema + quickstart thủ công (xem Technical Context và
research.md).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Không có vi phạm nào — bảng Constitution Check ở trên toàn bộ **PASS**, không
cần ghi nhận complexity tracking cho tính năng này.
