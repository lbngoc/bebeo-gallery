# Implementation Plan: Hoàn Thiện Ngôn Ngữ & Hiệu Ứng Thị Giác Trang Chủ

**Branch**: `002-landing-page-visual-polish` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-landing-page-visual-polish/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Tinh chỉnh giao diện trang landing page đã có (`001-gallery-landing-page`):
(1) rà soát và Việt hoá toàn bộ text hiển thị còn sót (audit thực tế cho thấy
chỉ còn đúng 1 chỗ — link "Back to Top" ở footer; các từ như "Video"/"cloud"
là loanword phổ biến, giữ nguyên có chủ đích); (2) mỗi section chính (Hero/
Gallery/Video) có nền phân biệt rõ dùng lại đúng token màu Thủy/Thổ đã có,
không thêm màu mới; (3) Hero có lớp nền trang trí + hiệu ứng parallax khi
cuộn — mặc định là gradient trừu tượng dựng bằng CSS, tự động chuyển sang
ảnh thật (đã qua filter mono/tinted) nếu chủ trang cấu hình qua file JSON
mới `heroBackground.json`; (4) carousel Video bỏ nút mũi tên prev/next, thay
bằng dãy chấm điều hướng (dots) đồng bộ hai chiều với vị trí cuộn thực tế.
Toàn bộ thực hiện bằng CSS thuần + Alpine.js hiện có, không thêm dependency
mới, không đổi cấu trúc dữ liệu Album/Video/Chủ đề.

## Technical Context

**Language/Version**: JavaScript (ES2022+) trong Vite/Alpine.js đã có; không thêm ngôn ngữ/runtime mới

**Primary Dependencies**: Không thêm dependency mới — tái sử dụng Eleventy v3, `@11ty/eleventy-plugin-vite`, Tailwind CSS v4, Alpine.js v3, `@11ty/eleventy-img` đã cài từ `001-gallery-landing-page`. Parallax và dots điều hướng cài bằng vanilla JS/Alpine + CSS `transform`/`filter`/`mix-blend-mode`, không dùng thư viện parallax/carousel ngoài.

**Storage**: Thêm 1 file cấu hình phẳng mới `src/_data/heroBackground.json` (tuỳ chọn: đường dẫn ảnh nền Hero + kiểu filter màu); không có thay đổi nào khác về lưu trữ, vẫn không database.

**Testing**: Không thêm framework test mới — tiếp tục dùng `scripts/validate-content.mjs` (mở rộng nhẹ để validate `heroBackground.json` nếu tồn tại) + xác thực thủ công qua `quickstart.md` (đã dùng Playwright MCP để xác thực trực quan ở lần implement trước, sẽ lặp lại cách này).

**Target Platform**: Không đổi — trình duyệt web hiện đại (desktop + mobile/tablet), static site.

**Project Type**: web (single static frontend project, không đổi cấu trúc so với `001-gallery-landing-page`)

**Performance Goals**: Hiệu ứng parallax phải mượt (không giật khi cuộn) trên thiết bị tầm trung; lớp nền trang trí/ảnh Hero không được làm chậm thời gian hiển thị nội dung chữ trong Hero (text vẫn hiển thị ngay, nền có thể load/paint song song).

**Constraints**: Không phá vỡ cơ chế section-snap-scroll và điều hướng phím/chuột đã có ở `001` (FR-011/FR-018); hiệu ứng parallax MUST tắt khi `prefers-reduced-motion: reduce` (kế thừa nguyên tắc đã áp dụng cho section-scroll); không giới thiệu màu sắc mới ngoài bảng Thủy/Thổ hiện có; không đổi cấu trúc dữ liệu Album/Video/Chủ đề.

**Scale/Scope**: Chỉnh sửa trên đúng 1 trang (landing page hiện có); phạm vi thay đổi: 1 file text (footer), 3 section background, 1 section Hero (nền + parallax), 1 component carousel (video). Không có route/trang mới.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate (từ constitution.md) | Đánh giá | Kết quả |
|---|---|---|---|
| 1 | Nguyên tắc I — Đơn giản & không database phức tạp | `heroBackground.json` là file phẳng mới, không DB; không thêm dependency/thư viện parallax hay carousel ngoài | **PASS** |
| 2 | Nguyên tắc II — Ưu tiên di động (Mobile-First) | Parallax là hiệu ứng trang trí, suy giảm nhẹ nhàng trên mobile (ảnh/gradient vẫn hiển thị tĩnh); dots carousel hoạt động bằng chạm, không phụ thuộc hover | **PASS** |
| 3 | Nguyên tắc III — Không lưu trữ media gốc | Ảnh nền Hero (nếu có) là tài nguyên thiết kế giao diện tối ưu nhỏ gọn (tương tự thumbnail), không phải "album/video nổi bật" của gia đình — đã ghi rõ trong spec Assumptions | **PASS** |
| 4 | Nguyên tắc IV — Kiến trúc site tĩnh với stack quy định | Vẫn 11ty + Vite + Tailwind + Alpine; không thêm SPA framework/backend/DB/thư viện ngoài | **PASS** |
| 5 | Nguyên tắc V — Riêng tư & phạm vi gia đình | Không thay đổi cơ chế truy cập đã chốt (công khai, không auth) | **PASS** |
| 6 | Ràng buộc công nghệ & kiến trúc (Section 2) | `heroBackground.json` vẫn là file phẳng versioned trong git; ảnh Hero (nếu có) xử lý qua `eleventy-img` như thumbnail hiện có | **PASS** |
| 7 | Quy trình quản lý nội dung (Section 3) | Bật/tắt ảnh nền Hero = sửa 1 file JSON + rebuild/redeploy, không ghi runtime vào DB | **PASS** |

Không có vi phạm nào cần giải trình → **Complexity Tracking** để trống.

**Re-check sau Phase 1 (design)**: Đã rà lại 7 gate sau khi hoàn tất
`research.md`, `data-model.md`, `contracts/hero-background-schema.json`.
Quyết định thiết kế cụ thể (1 file JSON cấu hình phẳng mới, gradient CSS
thuần cho nền mặc định, parallax bằng vanilla JS không thư viện ngoài, dots
carousel mở rộng component Alpine đã có) không phát sinh vi phạm mới.
**Kết quả re-check: PASS toàn bộ.**

## Project Structure

### Documentation (this feature)

```text
specs/002-landing-page-visual-polish/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── hero-background-schema.json
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

Không thay đổi cấu trúc thư mục tổng thể so với `001-gallery-landing-page`
(vẫn single static frontend project dưới `src/`). Các file bị sửa/thêm:

```text
src/
├── _data/
│   └── heroBackground.json        # MỚI — cấu hình tuỳ chọn: ảnh nền Hero + kiểu filter
├── _includes/
│   ├── layouts/
│   │   └── base.njk               # không đổi
│   └── partials/
│       ├── header.njk             # không đổi (đã tiếng Việt, "Video" giữ nguyên có chủ đích)
│       ├── footer.njk              # SỬA — "Back to Top" → nhãn tiếng Việt
│       ├── hero.njk                # SỬA — thêm lớp nền trang trí (heroBackground shortcode) + hook parallax
│       ├── gallery.njk             # SỬA — thêm class nền riêng cho section (giữ tông hiện tại làm nền "trung tính")
│       ├── video-section.njk       # SỬA — thêm class nền riêng; bỏ nút prev/next; thêm dãy chấm điều hướng
│       └── video-modal.njk         # không đổi về mặt chức năng
├── assets/
│   ├── styles/
│   │   └── main.css                # SỬA — thêm utility cho gradient nền Hero trừu tượng + class filter mono/tinted
│   ├── scripts/
│   │   ├── main.js                 # SỬA — đăng ký thêm hero-parallax.js
│   │   ├── hero-parallax.js        # MỚI — hiệu ứng parallax cuộn cho Hero, tôn trọng prefers-reduced-motion
│   │   └── video-carousel.js       # SỬA — thêm state activeIndex, goToIndex(), đồng bộ theo vị trí cuộn thực tế
│   └── images/
│       └── hero/                   # MỚI (tuỳ chọn) — nơi đặt ảnh nền Hero thật nếu chủ trang cấu hình
├── index.njk                        # SỬA — thêm class nền riêng cho từng <section>
└── .eleventy.js                     # SỬA — thêm shortcode `heroBackground` (abstract-vs-photo + filter)

scripts/
└── validate-content.mjs             # SỬA (nhẹ) — validate thêm heroBackground.json nếu tồn tại
```

**Structure Decision**: Giữ nguyên **single static frontend project** đã có
từ `001-gallery-landing-page`; đây là một bản vá (patch) trên cùng codebase,
không tạo project/module mới, không thêm route. Toàn bộ thay đổi nằm trong
các file hiện có cộng 2 file mới (`heroBackground.json`, `hero-parallax.js`)
và 1 thư mục asset mới tuỳ chọn (`assets/images/hero/`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Không có vi phạm nào — bảng Constitution Check ở trên toàn bộ **PASS**.
