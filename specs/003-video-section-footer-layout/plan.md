# Implementation Plan: Cân Chỉnh Bố Cục Section Video & Footer

**Branch**: `003-video-section-footer-layout` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-video-section-footer-layout/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Sửa 1 vấn đề bố cục cụ thể trên desktop: section Video (màn hình cuối cùng
trong chuỗi cuộn-từng-màn-hình) hiện dùng `lg:min-h-screen` khiến nó luôn
chiếm tối thiểu 100vh, đẩy `<footer>` (vốn nằm ngoài `<main>`, không phải
snap-section) ra ngoài khung nhìn — người dùng phải cuộn thêm 1 lần chỉ để
thấy 1 dòng footer. Giải pháp: biến `<section id="video">` thành **đúng
100vh** (`lg:h-screen` thay vì `lg:min-h-screen`) và dùng flexbox để (a)
đưa `<footer>` vào làm phần tử cuối cùng bên trong cùng khối 100vh đó (thay
vì là sibling sau `<main>`), và (b) căn giữa nội dung Video (tiêu đề,
carousel, dots) trong phần không gian còn lại sau khi trừ chiều cao footer.
Trên mobile/tablet (dưới breakpoint `lg`), toàn bộ class trên đều không
kích hoạt — hành vi giữ nguyên y hệt hiện tại (cuộn tự nhiên, không đổi).
Không có thay đổi dữ liệu, không thêm dependency.

## Technical Context

**Language/Version**: Không đổi — HTML/Nunjucks + Tailwind CSS v4 (utility class), không thêm JavaScript mới.

**Primary Dependencies**: Không thêm gì — chỉ dùng lại Tailwind utilities (`flex`, `h-screen`, `flex-1`, `justify-center`, `flex-none`) đã có sẵn từ `001`/`002`. Không đụng đến Alpine.js hay `@11ty/eleventy-plugin-vite`.

**Storage**: Không áp dụng — không có dữ liệu/cấu hình nào thay đổi (không đụng `albums.json`, `videos.json`, `heroBackground.json`).

**Testing**: Không có framework test trong repo (kế thừa từ `001`). Xác thực bằng Playwright MCP thủ công qua dev server thật, đúng cách đã làm ở `001`/`002`: resize viewport về vài độ phân giải desktop phổ biến (bao gồm 1366×768 theo SC-002), snap tới section Video, đo `getBoundingClientRect()` của footer để xác nhận nó nằm trong viewport.

**Target Platform**: Không đổi — trình duyệt desktop (thay đổi chính ở đây) + mobile/tablet (phải xác nhận KHÔNG đổi, xem FR-003).

**Project Type**: web (single static frontend project, không đổi cấu trúc)

**Performance Goals**: Không có yêu cầu hiệu năng mới — đây thuần là thay đổi CSS/layout, không ảnh hưởng thời gian tải hay kích thước bundle.

**Constraints**: MUST không phá vỡ cơ chế `section-scroll.js` (điều hướng phím/cuộn chuột giữa Hero/Gallery/Video đã có từ `001`, FR-006 của spec này) — vì `section-scroll.js` chỉ dựa vào `[data-section]` và `getBoundingClientRect()`, việc di chuyển vị trí DOM của `<footer>` vào bên trong `<section id="video">` không ảnh hưởng nó, nhưng vẫn cần xác thực lại bằng Playwright sau khi sửa. MUST giữ nguyên tỉ lệ `aspect-video` của thumbnail (FR-005).

**Scale/Scope**: Chỉnh sửa 3 file template (`base.njk`, `index.njk`, `video-section.njk`) + có thể điều chỉnh nhẹ class trong `footer.njk`; không có route/trang mới, không có file hoàn toàn mới.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate (từ constitution.md) | Đánh giá | Kết quả |
|---|---|---|---|
| 1 | Nguyên tắc I — Đơn giản & không database phức tạp | Không thêm dữ liệu/dependency nào; thuần CSS utility class có sẵn | **PASS** |
| 2 | Nguyên tắc II — Ưu tiên di động (Mobile-First) | Mọi thay đổi đều `lg:`-prefixed (theo đúng breakpoint desktop-only đã dùng từ `001`); mobile/tablet không đổi hành vi (FR-003) | **PASS** |
| 3 | Nguyên tắc III — Không lưu trữ media gốc | Không liên quan — không đụng dữ liệu album/video/ảnh | **PASS** |
| 4 | Nguyên tắc IV — Kiến trúc site tĩnh với stack quy định | Vẫn 11ty + Vite + Tailwind + Alpine, không thêm gì | **PASS** |
| 5 | Nguyên tắc V — Riêng tư & phạm vi gia đình | Không liên quan | **PASS** |
| 6 | Ràng buộc công nghệ & kiến trúc (Section 2) | Không đổi build/deploy/lưu trữ | **PASS** |
| 7 | Quy trình quản lý nội dung (Section 3) | Không đổi quy trình thêm album/video | **PASS** |

Không có vi phạm nào cần giải trình → **Complexity Tracking** để trống.

**Re-check sau Phase 1 (design)**: Đã rà lại 7 gate sau khi hoàn tất
`research.md`/`data-model.md`/`quickstart.md`. Quyết định kỹ thuật (chuyển
footer vào trong section Video + `h-screen`/flexbox thay vì hard-code chiều
cao) không phát sinh vi phạm mới, không thêm dữ liệu/dependency.
**Kết quả re-check: PASS toàn bộ.**

## Project Structure

### Documentation (this feature)

```text
specs/003-video-section-footer-layout/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command) — ghi rõ "không áp dụng"
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

Không tạo `contracts/` cho feature này — không có dữ liệu/API/schema nào
được thêm hoặc thay đổi (thuần layout/CSS trên 3 section đã có).

### Source Code (repository root)

Không đổi cấu trúc thư mục — vẫn single static frontend project từ `001`.
Các file bị sửa:

```text
src/
├── _includes/
│   ├── layouts/
│   │   └── base.njk           # SỬA — bỏ include footer.njk ở đây (footer chuyển vào trong <section id="video">)
│   └── partials/
│       ├── footer.njk          # SỬA nhẹ — thêm class flex-sizing (lg:flex-none) để làm việc đúng trong flex column mới
│       └── video-section.njk   # SỬA — bọc content bằng flex-1 + justify-center để căn giữa trong không gian còn lại
└── index.njk                    # SỬA — <section id="video"> đổi lg:min-h-screen → lg:flex lg:h-screen lg:flex-col; include footer.njk làm phần tử cuối bên trong section này
```

**Structure Decision**: Giữ nguyên kiến trúc hiện có; đây là một bản vá CSS/
layout nhỏ. Điểm cần lưu ý: footer chuyển từ "layout chrome dùng chung trong
`base.njk`" sang "phần tử cuối cùng bên trong section Video ở `index.njk`" —
chấp nhận được vì đây là site 1 trang duy nhất (không có trang thứ 2 nào
dùng `base.njk` mà không có section Video), đã ghi rõ trong `research.md`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Không có vi phạm nào — bảng Constitution Check ở trên toàn bộ **PASS**.
