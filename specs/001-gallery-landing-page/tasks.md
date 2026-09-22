---

description: "Task list template for feature implementation"
---

# Tasks: Trang Landing Page BeBeo Gallery

**Input**: Design documents from `/specs/001-gallery-landing-page/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Spec/plan không yêu cầu TDD hay bộ test tự động theo user story (xem `research.md` mục 9 — chiến lược kiểm thử là script validate schema build-time + checklist thủ công trong `quickstart.md`). Vì vậy danh sách dưới đây KHÔNG có phần "Tests for User Story X"; `quickstart.md` đóng vai trò xác thực chấp nhận sau khi implement.

**Organization**: Tasks được nhóm theo user story (US1-US4, theo priority trong spec.md) để có thể implement và test độc lập từng story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Có thể chạy song song (khác file, không phụ thuộc task chưa xong)
- **[Story]**: User story mà task thuộc về (US1, US2, US3, US4)
- Mỗi task nêu rõ đường dẫn file cụ thể

## Path Conventions

Dự án là **single static frontend project** (xem `plan.md` > Project Structure): mã nguồn dưới `src/`, script build-time dưới `scripts/`, không có `backend/`/`frontend/` tách riêng, không có thư mục `tests/` unit/integration truyền thống (xem lý do ở mục Tests phía trên).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Khởi tạo project, cài đặt và cấu hình đúng stack quy định (11ty + Vite + Tailwind CSS v4 + Alpine.js)

- [X] T001 Khởi tạo `package.json` và cài dependencies: `@11ty/eleventy`, `@11ty/eleventy-plugin-vite`, `vite`, `tailwindcss`, `@tailwindcss/vite`, `alpinejs`, `@11ty/eleventy-img` (theo `plan.md` > Primary Dependencies)
- [X] T002 [P] Tạo cấu trúc thư mục dự án theo `plan.md` > Project Structure: `src/_data/`, `src/_includes/layouts/`, `src/_includes/partials/`, `src/assets/styles/`, `src/assets/scripts/`, `src/assets/images/thumbnails/albums/`, `src/assets/images/thumbnails/videos/`, `src/assets/fonts/`, `scripts/`
- [X] T003 Cấu hình Eleventy trong `.eleventy.js`: đăng ký `@11ty/eleventy-plugin-vite`, đăng ký shortcode ảnh của `@11ty/eleventy-img`, set input `src/` / output `_site/`
- [X] T004 [P] Cấu hình `vite.config.js` + tích hợp Tailwind CSS v4 qua `@tailwindcss/vite`, entry CSS `src/assets/styles/main.css` với `@import "tailwindcss";`
- [X] T005 [P] Định nghĩa design token trong `src/assets/styles/main.css`/Tailwind config: bảng màu chủ đạo Thủy (xanh lam/xanh ngọc điềm tĩnh) kết hợp Thổ (beige/nâu đất/vàng đất), font-family (logo viết tay + font chính nhẹ nhàng thân thiện), dark mode theo class `dark` (FR-013, research.md mục 2/8)
- [X] T006 Thêm npm scripts vào `package.json`: `dev` (11ty + vite dev server), `build` (chạy `validate:content` rồi eleventy build qua vite), `validate:content` (chạy `scripts/validate-content.mjs`)

**Checkpoint**: Toolchain sẵn sàng — `npm run dev` và `npm run build` chạy được (dù chưa có nội dung/markup thật).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Hạ tầng lõi mà MỌI user story đều phụ thuộc — layout gốc, khung 3 section, bootstrap Alpine, và cơ chế validate dữ liệu

**⚠️ CRITICAL**: Không bắt đầu bất kỳ user story nào trước khi phase này hoàn tất

- [X] T007 Tạo layout gốc `src/_includes/layouts/base.njk`: khung `<html>`/`<head>`/`<body>`, meta viewport, script inline chống "nhấp nháy" theme (đọc `localStorage` trước khi vẽ trang — chuẩn bị cho FR-003), link tới CSS/JS do Vite build
- [X] T008 Tạo `src/index.njk` dùng layout T007: `<header id="site-header">` (rỗng, US1 sẽ điền), `<main>` chứa `<section id="hero">`, `<section id="gallery">`, `<section id="video">` (rỗng, US1/US2/US3 sẽ điền), `<footer id="site-footer">` (rỗng, điền ở Polish)
- [X] T009 [P] Bootstrap Alpine.js trong `src/assets/scripts/main.js`: import `alpinejs`, tạo nơi đăng ký store/component dùng chung, gọi `Alpine.start()`
- [X] T010 [P] Viết script validate nội dung `scripts/validate-content.mjs` theo `contracts/content-schema.json`: kiểm tra `src/_data/albums.json` và `src/_data/videos.json`, in lỗi rõ ràng theo từng field/bản ghi và thoát khác 0 khi có lỗi (wired vào `npm run build` qua T006)
- [X] T011 [P] Tạo file dữ liệu rỗng `src/_data/albums.json` (`[]`) và `src/_data/videos.json` (`[]`) để Eleventy data cascade và `validate-content.mjs` chạy sạch trước khi US2/US3 điền dữ liệu thật

**Checkpoint**: Trang build ra HTML rỗng nhưng đúng khung (header/hero/gallery/video/footer container) — sẵn sàng để các user story implement song song.

---

## Phase 3: User Story 1 - Xem giới thiệu và điều hướng trang (Priority: P1) 🎯 MVP

**Goal**: Header (logo + nav + theme toggle) và Hero hoạt động đầy đủ: người dùng hiểu mục đích trang trong vài giây, điều hướng nhanh bằng nav, và giao diện sáng/tối được ghi nhớ.

**Independent Test**: Mở trang, xác nhận Hero hiển thị giới thiệu ngắn gọn; nhấn từng mục nav và xác nhận cuộn đến đúng section; nhấn nút theme và xác nhận đổi màu ngay + giữ nguyên sau khi tải lại (spec.md > User Story 1).

### Implementation for User Story 1

- [X] T012 [P] [US1] Thêm font tự host (font viết tay cho logo + font chính nhẹ nhàng) vào `src/assets/fonts/`, khai báo `@font-face` trong `src/assets/styles/main.css`, map vào font-family token từ T005
- [X] T013 [US1] Viết nội dung và markup Hero trong `src/_includes/partials/hero.njk`, include vào `#hero` (đoạn giới thiệu ngắn gọn, súc tích — FR-004)
- [X] T014 [US1] Xây dựng Header trong `src/_includes/partials/header.njk`, include vào `#site-header`: bố cục trái (logo "BeBeo Gallery" font viết tay) - phải (nav "Giới thiệu | Ảnh | Video" + nút toggle theme), mobile-first (FR-001)
- [X] T015 [US1] Xây dựng điều hướng cuộn mượt trong `src/assets/scripts/section-nav.js` (đăng ký trong main.js): click nav → `scrollIntoView({behavior})` tới `#hero`/`#gallery`/`#video`; dùng `behavior: 'auto'` khi `prefers-reduced-motion: reduce` (FR-002, FR-016)
- [X] T016 [US1] Xây dựng theme store trong `src/assets/scripts/theme-store.js` (đăng ký trong main.js): `Alpine.store('theme', ...)` đọc/ghi `localStorage` (`bebeo-theme`), toggle class `dark` trên `<html>`; nối với nút toggle trong header (FR-003)
- [X] T017 [US1] Style Header + Hero bằng Tailwind (màu/font từ T005/T012) ở cả light/dark, đảm bảo tap target đủ lớn và không phụ thuộc hover trên mobile (Nguyên tắc II)

**Checkpoint**: User Story 1 hoạt động đầy đủ và test độc lập được (quickstart.md mục 4.1).

---

## Phase 4: User Story 2 - Duyệt và lọc album ảnh gia đình theo chủ đề (Priority: P1)

**Goal**: Section Gallery hiển thị album dạng grid/masonry với thumbnail/tiêu đề/mô tả, hỗ trợ lọc nhanh theo chủ đề, và mở link cloud gốc khi nhấn vào album.

**Independent Test**: Vào section Gallery, xác nhận danh sách album hiển thị đúng; chọn bộ lọc chủ đề và xác nhận chỉ album phù hợp hiển thị; nhấn một album và xác nhận link cloud gốc mở ra (spec.md > User Story 2).

### Implementation for User Story 2

- [X] T018 [P] [US2] Điền dữ liệu mẫu thật vào `src/_data/albums.json` (≥ 2 album, ít nhất 2 chủ đề khác nhau, 1 album cố ý thiếu thumbnail hợp lệ để test fallback) theo `contracts/content-schema.json` / `data-model.md`
- [X] T019 [P] [US2] Tạo computed data `src/_data/categories.11tydata.js`: rút danh sách chủ đề duy nhất (đã sắp xếp) từ `albums.json` (data-model.md > Category)
- [X] T020 [US2] Xây dựng partial thẻ album `src/_includes/partials/album-card.njk`: thumbnail nền (qua shortcode `eleventy-img` từ T003), tiêu đề, mô tả địa điểm - thời gian, ảnh placeholder khi thumbnail lỗi (FR-005, FR-015)
- [X] T021 [US2] Xây dựng partial `src/_includes/partials/gallery.njk`, include vào `#gallery`: layout grid/masonry render toàn bộ album-card (FR-005) + thanh chip lọc chủ đề (từ T019, kèm "Tất cả") (FR-006)
- [X] T022 [US2] Xây dựng component lọc `src/assets/scripts/gallery-filter.js` (đăng ký trong main.js): state chủ đề đang chọn, ẩn/hiện album theo `categories`, hiển thị trạng thái rỗng thân thiện khi không có album khớp (FR-006, Edge case)
- [X] T023 [US2] Thêm lazy-load ảnh thumbnail cho album-card (thuộc tính `loading="lazy"` + kích thước phù hợp `eleventy-img`) để phù hợp quy mô ~10-50 album, không phân trang (FR-017)
- [X] T024 [US2] Nối sự kiện nhấn thẻ album để mở `cloudUrl` ở tab mới (`target="_blank" rel="noopener"`) (FR-007)
- [X] T025 [US2] Style Gallery responsive mobile-first (grid → masonry theo breakpoint, chip lọc cuộn ngang trên mobile) dùng màu/font từ T005/T012

**Checkpoint**: User Story 1 + 2 hoạt động độc lập và cùng nhau (quickstart.md mục 4.2). Đây là phạm vi **MVP** (2 story P1).

---

## Phase 5: User Story 3 - Xem và phát video nổi bật ngay trên trang (Priority: P2)

**Goal**: Section Video hiển thị carousel video nổi bật; nhấn vào video phát ngay trong modal trên trang, không rời trang.

**Independent Test**: Vào section Video, xác nhận carousel hiển thị poster/tiêu đề; nhấn một video và xác nhận phát trong modal; đóng modal và quay lại đúng vị trí (spec.md > User Story 3).

### Implementation for User Story 3

- [X] T026 [P] [US3] Điền dữ liệu mẫu thật vào `src/_data/videos.json` (≥ 1 video/`sourceType` nếu có thể: youtube, google-drive, pcloud) theo `contracts/content-schema.json` / `data-model.md`
- [X] T027 [US3] Xây dựng partial `src/_includes/partials/video-section.njk`, include vào `#video`: carousel hiển thị poster + tiêu đề từng video (FR-008); thông báo nhẹ ("Chưa có video nào") khi `videos.json` rỗng (Edge case)
- [X] T028 [US3] Xây dựng điều hướng carousel trong `src/assets/scripts/video-carousel.js` (đăng ký trong main.js): next/prev, hỗ trợ vuốt/chạm mobile-first
- [X] T029 [US3] Xây dựng partial modal `src/_includes/partials/video-modal.njk` + component `src/assets/scripts/video-modal.js`: mở modal khi nhấn video, dựng `src` iframe theo `sourceType`/`embedRef` đúng `contracts/video-embed-contract.md` (FR-009)
- [X] T030 [US3] Xây dựng trạng thái fallback trong modal khi nhúng thất bại: thông báo thân thiện + link `fallbackUrl` mở tab mới (FR-015)
- [X] T031 [US3] Xử lý đóng modal (nút đóng, phím Esc, click nền) và khôi phục đúng vị trí cuộn của section Video trước khi mở modal (US3 acceptance scenario 3)
- [X] T032 [US3] Thêm Alpine store dùng chung `isVideoModalOpen` (cập nhật khi modal mở/đóng trong `video-modal.js`) — US4 sẽ đọc store này ở T035 (chuẩn bị cho FR-018)
- [X] T033 [US3] Style Video section + modal responsive mobile-first (nút đóng modal dễ chạm, không phụ thuộc hover) dùng màu/font từ T005/T012

**Checkpoint**: User Story 1 + 2 + 3 hoạt động độc lập và cùng nhau (quickstart.md mục 4.3).

---

## Phase 6: User Story 4 - Điều hướng từng section bằng phím hoặc cuộn chuột trên desktop (Priority: P3)

**Goal**: Trên desktop, mỗi section chiếm tối thiểu 1 màn hình và người dùng có thể dùng phím mũi tên/cuộn chuột để nhảy tuần tự giữa các section; trên mobile vẫn cuộn tự nhiên.

**Independent Test**: Trên desktop, nhấn phím mũi tên xuống chuyển section kế tiếp; cuộn chuột một lần chuyển đúng 1 section; trên mobile cuộn chạm vẫn tự nhiên liên tục (spec.md > User Story 4).

### Implementation for User Story 4

- [X] T034 [US4] Thêm CSS scroll-snap cho `<main>`/section trong `src/assets/styles/main.css` (hoặc class Tailwind), chỉ active ở breakpoint desktop: `scroll-snap-type: y mandatory` trên container, `scroll-snap-align: start` + `min-height: 100vh` cho mỗi `<section>` (FR-011)
- [X] T035 [US4] Xây dựng `src/assets/scripts/section-scroll.js` (đăng ký trong main.js): lắng nghe `keydown` (ArrowUp/ArrowDown) ở `window`, chỉ active khi `matchMedia` khớp breakpoint desktop, gọi `scrollIntoView` tới section kế/trước; đọc store `isVideoModalOpen` (T032) để bỏ qua xử lý phím khi modal đang mở (FR-018)
- [X] T036 [US4] Xử lý `prefers-reduced-motion: reduce` trong `section-scroll.js`: dùng `behavior: 'auto'` thay vì `'smooth'` khi thiết lập này bật (FR-016)
- [X] T037 [US4] Debounce sự kiện `wheel` trong `section-scroll.js` để mỗi lần cuộn chuột chỉ chuyển đúng 1 section, kể cả khi người dùng cuộn nhanh liên tiếp (Edge case)
- [X] T038 [US4] Xác nhận và đảm bảo (qua Tailwind breakpoint guard) rằng cơ chế snap-scroll ở T034-T037 KHÔNG kích hoạt trên mobile/tablet — trang dùng cuộn tự nhiên liên tục (FR-012)

**Checkpoint**: Cả 4 user story hoạt động độc lập và cùng nhau (quickstart.md mục 4.4 + 4.5).

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Hoàn thiện các phần dùng chung không thuộc riêng một user story, và xác thực toàn diện

- [X] T039 [P] Xây dựng Footer trong `src/_includes/partials/footer.njk`, include vào `#site-footer`: dòng copyright đơn giản + link "Back to Top" cuộn mượt về đầu trang (FR-010)
- [X] T040 [P] Rà soát accessibility cơ bản: trạng thái focus rõ ràng cho nav/chip lọc/nút theme/nút đóng modal, `alt` text cho ảnh thumbnail, `aria-label`/`role` phù hợp cho modal video
- [X] T041 [P] Rà soát responsive toàn trang trên các kích thước phổ biến (điện thoại, tablet, desktop) đối chiếu SC-005 và Nguyên tắc II
- [X] T042 Chạy `npm run build`, xác nhận `validate-content.mjs` (T010) pass với dữ liệu thật (T018, T026) và không còn placeholder/nội dung mẫu chưa thay trong markup
- [X] T043 Thực hiện toàn bộ checklist trong `quickstart.md` (mục 4.1-4.5), ghi lại kết quả và sửa các mục không đạt

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc — bắt đầu ngay
- **Foundational (Phase 2)**: Phụ thuộc Setup hoàn tất — CHẶN mọi user story
- **User Stories (Phase 3-6)**: Đều phụ thuộc Foundational hoàn tất
  - US1, US2 (cả hai P1) có thể làm song song hoặc tuần tự — độc lập với nhau
  - US3 (P2) độc lập về mã nguồn với US1/US2, nhưng dùng chung store Alpine khởi tạo ở T009
  - US4 (P3) phụ thuộc store `isVideoModalOpen` do US3 tạo ở T032 (chỉ để tạm ngắt phím khi modal mở — nếu US3 chưa làm, US4 vẫn hoạt động cơ bản nhưng bỏ qua FR-018)
- **Polish (Phase 7)**: Phụ thuộc các user story muốn đưa vào bản phát hành đã hoàn tất

### User Story Dependencies

- **US1 (P1)**: Sau Foundational — không phụ thuộc story khác
- **US2 (P1)**: Sau Foundational — không phụ thuộc story khác (không cần US1 để test độc lập, vì `#gallery` đã có sẵn từ Foundational)
- **US3 (P2)**: Sau Foundational — không phụ thuộc US1/US2 để hoạt động cơ bản
- **US4 (P3)**: Sau Foundational; FR-018 (tạm ngắt phím khi modal mở) cần T032 của US3 — nếu triển khai US4 trước US3, hoãn T035 phần đọc `isVideoModalOpen` cho tới khi US3 xong

### Trong mỗi User Story

- Dữ liệu mẫu (albums.json/videos.json) trước khi xây template render dữ liệu đó
- Partial/markup trước component Alpine tương tác trên markup đó
- Component tương tác trước khi style hoàn thiện (style có thể làm song song nếu markup đã có class hook)
- Story hoàn chỉnh trước khi coi là "xong" để chuyển ưu tiên khác

### Parallel Opportunities

- Task Setup đánh dấu [P] (T002, T004, T005) chạy song song sau T001
- Task Foundational đánh dấu [P] (T009, T010, T011) chạy song song sau T007-T008
- Sau khi Foundational xong: US1 và US2 có thể làm song song (2 người/2 luồng khác nhau); US3 có thể bắt đầu song song nhưng T035 (US4) chờ T032 (US3)
- Trong mỗi story, các task [P] (khác file, ví dụ T018+T019, T012 riêng T013-T017) chạy song song

---

## Parallel Example: User Story 2

```bash
# Sau khi Foundational hoàn tất, chạy song song:
Task: "Điền dữ liệu mẫu thật vào src/_data/albums.json"
Task: "Tạo computed data src/_data/categories.11tydata.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 — cả hai đều P1)

1. Hoàn tất Phase 1: Setup
2. Hoàn tất Phase 2: Foundational (BẮT BUỘC — chặn mọi story)
3. Hoàn tất Phase 3: User Story 1 (Header/Hero/Nav/Theme)
4. Hoàn tất Phase 4: User Story 2 (Gallery + Filter)
5. **DỪNG và XÁC THỰC**: chạy `quickstart.md` mục 4.1-4.2 độc lập
6. Deploy/demo nếu đạt yêu cầu — đây đã là giá trị cốt lõi của trang

### Incremental Delivery

1. Setup + Foundational → nền tảng sẵn sàng
2. + US1 → xác thực độc lập → có header/hero hoạt động
3. + US2 → xác thực độc lập → **MVP hoàn chỉnh** (2 story P1)
4. + US3 → xác thực độc lập → thêm giá trị video
5. + US4 → xác thực độc lập → thêm trải nghiệm desktop nâng cao
6. Phase 7 (Polish) → hoàn thiện footer, accessibility, responsive audit, chạy quickstart đầy đủ

### Parallel Team Strategy

Với nhiều người triển khai:

1. Cùng hoàn tất Setup + Foundational
2. Sau đó: người A làm US1, người B làm US2, người C bắt đầu US3 (T026-T031 độc lập với A/B)
3. US4 chờ T032 (US3) trước khi hoàn thiện phần đọc `isVideoModalOpen`, nhưng phần CSS scroll-snap (T034) và debounce wheel (T037) có thể làm song song sớm

---

## Notes

- [P] = khác file, không phụ thuộc task chưa hoàn thành
- [Story] gắn task với user story cụ thể để truy vết
- Không có phần "Tests" riêng theo story — chiến lược kiểm thử là `scripts/validate-content.mjs` (Foundational, T010) + `quickstart.md` (xác thực cuối, T043)
- Mỗi user story nên hoàn thành và test độc lập được trước khi coi là "xong"
- Commit sau mỗi task hoặc nhóm task hợp lý
- Dừng ở bất kỳ checkpoint nào để xác thực story độc lập trước khi tiếp tục
- Tránh: task mơ hồ, hai task cùng sửa một file chạy song song, phụ thuộc chéo giữa story phá vỡ tính độc lập
