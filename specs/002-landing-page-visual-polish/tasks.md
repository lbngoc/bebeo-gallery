---

description: "Task list template for feature implementation"
---

# Tasks: Hoàn Thiện Ngôn Ngữ & Hiệu Ứng Thị Giác Trang Chủ

**Input**: Design documents from `/specs/002-landing-page-visual-polish/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Không yêu cầu TDD/bộ test tự động theo story (kế thừa quyết định ở `001`, xem `research.md` mục 6) — chiến lược kiểm thử là mở rộng nhẹ `validate-content.mjs` (build-time) + checklist thủ công/Playwright trong `quickstart.md`. Vì vậy không có mục "Tests for User Story X" riêng.

**Organization**: Tasks nhóm theo 4 user story trong spec.md (US1-US4, theo priority), có thể implement/test độc lập từng story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Có thể chạy song song (khác file, không phụ thuộc task chưa xong)
- **[Story]**: US1-US4 tương ứng spec.md
- Mỗi task nêu rõ đường dẫn file cụ thể

## Path Conventions

Vẫn là **single static frontend project** đã có từ `001-gallery-landing-page`
(`src/`, `scripts/` ở root). Đây là bản vá trên codebase hiện có — hầu hết
task là SỬA file đã tồn tại, chỉ 3 file hoàn toàn mới
(`src/_data/heroBackground.json`, `src/assets/scripts/hero-parallax.js`, thư
mục `src/assets/images/hero/`).

## Phase 1: Setup

**Purpose**: Chuẩn bị tối thiểu — không có dependency mới cần cài (xem plan.md > Technical Context)

- [X] T001 [P] Tạo thư mục `src/assets/images/hero/` (rỗng, sẵn sàng chứa ảnh nền Hero tuỳ chọn cho US3)

**Checkpoint**: Không có gì chặn — sẵn sàng vào Foundational.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xác nhận baseline sạch trước khi chỉnh sửa nhiều file của codebase đã implement từ `001`

- [X] T002 Chạy `npm run build` trên codebase hiện tại (chưa sửa gì) để xác nhận xuất phát từ trạng thái build thành công, làm mốc so sánh trước/sau

**Checkpoint**: Baseline xác nhận sạch — 4 user story bên dưới độc lập với nhau, có thể làm song song hoặc theo thứ tự ưu tiên.

---

## Phase 3: User Story 1 - Trải nghiệm trang hoàn toàn bằng tiếng Việt (Priority: P1) 🎯 MVP

**Goal**: Không còn văn bản tiếng Anh sót lại ngoài các từ mượn đã ghi nhận có chủ đích.

**Independent Test**: Duyệt toàn bộ trang, xác nhận footer không còn "Back to Top"; xác nhận mọi text khác đã là tiếng Việt hoặc là loanword đã ghi nhận (quickstart.md mục 2).

### Implementation for User Story 1

- [X] T003 [US1] Sửa `src/_includes/partials/footer.njk`: đổi nhãn liên kết "Back to Top" → "Lên đầu trang" (FR-003)
- [X] T004 [US1] Đối chiếu lại toàn bộ text hiển thị trong `src/_includes/**/*.njk` và `aria-label` trong `src/assets/scripts/**/*.js` với kết quả audit ở `research.md` mục 1 — xác nhận không còn tiếng Anh nào khác ngoài "Video"/"cloud" (FR-001, FR-002); nếu phát hiện sót, sửa ngay tại đây

**Checkpoint**: User Story 1 hoàn tất, test độc lập được (quickstart.md mục 2).

---

## Phase 4: User Story 2 - Mỗi mục trên trang chủ có nền phân biệt rõ ràng (Priority: P2)

**Goal**: Gallery và Video có tông nền khác biệt rõ ràng, không còn dùng chung 1 màu nền phẳng.

**Independent Test**: Cuộn qua Gallery/Video trên cả desktop/mobile, cả sáng/tối, xác nhận nền khác biệt rõ (quickstart.md mục 3).

### Implementation for User Story 2

- [X] T005 [US2] Cập nhật `src/index.njk`: thêm class `bg-earth-50 dark:bg-water-900` cho `<section id="gallery">` (giữ nguyên tông hiện tại) và `bg-water-50 dark:bg-earth-900` cho `<section id="video">` (tông mới, đổi hue) — theo `research.md` mục 2 (FR-004, FR-005)
- [X] T006 [US2] Xác nhận trực quan (trình duyệt) độ tương phản chữ hiện có trong `gallery.njk`/`video-section.njk` trên nền mới, ở cả giao diện sáng và tối — không cần đổi màu chữ nếu tương phản vẫn tốt (theo phân tích ở `research.md` mục 2)

**Checkpoint**: User Story 1 + 2 hoạt động độc lập và cùng nhau (quickstart.md mục 2-3).

---

## Phase 5: User Story 3 - Hiệu ứng nền và parallax ấn tượng cho Hero (Priority: P2)

**Goal**: Hero có lớp nền trang trí (trừu tượng mặc định, hoặc ảnh thật đã lọc màu nếu được cấu hình) và hiệu ứng parallax khi cuộn, tôn trọng `prefers-reduced-motion`.

**Independent Test**: Mở Hero (không cấu hình ảnh) → thấy nền trừu tượng + parallax khi cuộn; cấu hình `heroBackground.json` với ảnh → thấy ảnh đã lọc màu thay cho nền trừu tượng; bật giảm chuyển động → parallax tắt (quickstart.md mục 4).

### Implementation for User Story 3

- [X] T007 [P] [US3] Tạo `src/_data/heroBackground.json` mặc định: `{"image": null, "filter": "tinted"}` (data-model.md > HeroBackgroundConfig)
- [X] T008 [US3] Cập nhật `src/index.njk`: thêm `relative overflow-hidden isolate` + màu nền fallback cho `<section id="hero">` để chứa lớp nền trang trí (không đụng tới class của Gallery/Video đã thêm ở T005)
- [X] T009 [US3] Thêm shortcode `heroBackground` trong `.eleventy.js`: đọc `heroBackground.json`; nếu không có `image` hợp lệ trả về markup nền trừu tượng (gradient blobs); nếu có, xử lý ảnh qua `@11ty/eleventy-img` (như `cardImage` đã làm) kèm class filter tương ứng (`mono`/`tinted`, mặc định `tinted`); fallback về nền trừu tượng nếu ảnh lỗi/thiếu (FR-006, FR-006a, FR-006b, FR-006c) — xem `contracts/hero-background-schema.json`
- [X] T010 [US3] Thêm utility CSS trong `src/assets/styles/main.css`: các lớp gradient nền trừu tượng (blobs `water-300/400/500` + `earth-300/400`, `filter: blur(...)`) và 2 class filter `.hero-filter-mono` (`grayscale(1) contrast(1.05)`), `.hero-filter-tinted` (`grayscale(1) sepia(0.3)` + lớp phủ `mix-blend-mode: color`) — theo `research.md` mục 3
- [X] T011 [US3] Cập nhật `src/_includes/partials/hero.njk`: gọi shortcode `heroBackground` (từ T009), đặt lớp nền ở dưới cùng (z-index thấp hơn nội dung), đánh dấu bằng attribute `data-hero-parallax-layer` để `hero-parallax.js` nhận diện
- [X] T012 [US3] Tạo `src/assets/scripts/hero-parallax.js`: lắng nghe `scroll` trên `window` (throttle qua `requestAnimationFrame`), tính `transform: translate3d(0, {offset}px, 0)` cho phần tử `[data-hero-parallax-layer]` dựa trên vị trí Hero so với viewport; KHÔNG gắn listener khi `matchMedia("(prefers-reduced-motion: reduce)")` khớp (FR-007, FR-008) — theo pattern đã có ở `section-scroll.js`
- [X] T013 [US3] Đăng ký `hero-parallax.js` trong `src/assets/scripts/main.js` (thêm dòng import, cùng chỗ với các script khác)
- [X] T014 [US3] Mở rộng `scripts/validate-content.mjs`: nếu `src/_data/heroBackground.json` tồn tại, validate theo `contracts/hero-background-schema.json` (`filter` ∈ {mono, tinted} nếu có; `image` nếu có phải là chuỗi không rỗng); không lỗi nếu file không tồn tại

**Checkpoint**: User Story 1 + 2 + 3 hoạt động độc lập và cùng nhau (quickstart.md mục 2-4).

---

## Phase 6: User Story 4 - Điều hướng carousel video bằng chấm thay vì nút mũi tên trên desktop (Priority: P3)

**Goal**: Carousel Video dùng dãy chấm điều hướng (đồng bộ 2 chiều với vị trí cuộn) thay cho nút mũi tên prev/next.

**Independent Test**: Không còn nút mũi tên; nhấn 1 chấm chuyển đúng video; tự vuốt/cuộn thì chấm nổi bật tự cập nhật đúng; ẩn dots khi ≤1 video (quickstart.md mục 5).

### Implementation for User Story 4

- [X] T015 [US4] Cập nhật `src/assets/scripts/video-carousel.js`: thêm state `activeIndex` (mặc định 0), method `goToIndex(i)` (cuộn track đến item thứ `i`), và lắng nghe `scroll` trên `$refs.track` (throttle nhẹ) để tính lại `activeIndex` theo vị trí cuộn thực tế khi người dùng tự vuốt/cuộn (FR-011, FR-012; data-model.md > activeIndex)
- [X] T016 [US4] Cập nhật `src/_includes/partials/video-section.njk`: xoá 2 `<button>` mũi tên trước/tiếp; thêm 1 hàng dots bên dưới track (1 `<button>` tròn nhỏ mỗi video, `@click="goToIndex(index)"`, `:class` đổi kích thước/độ đậm khi `activeIndex === index`); ẩn hoàn toàn hàng dots khi `videos.length <= 1` (FR-009, FR-010)
- [X] T017 [US4] Xác nhận (trình duyệt, cả desktop & mobile) hàng dots hiển thị và bấm được ở mọi kích thước màn hình, không giới hạn desktop (FR-013, theo Assumptions trong spec.md)

**Checkpoint**: Cả 4 user story hoạt động độc lập và cùng nhau (quickstart.md mục 2-5).

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Xác thực toàn diện và hoàn thiện phụ trợ

- [X] T018 [P] Chạy `npm run build` (kể cả khi có và khi không có `heroBackground.json`), xác nhận `validate-content.mjs` (T014) pass trong cả 2 trường hợp
- [X] T019 Thực hiện toàn bộ checklist trong `quickstart.md` (mục 2-5); khuyến khích dùng Playwright MCP (đã dùng ở `001`) để xác thực trực quan nền phân biệt, parallax, và dots; ghi lại kết quả, sửa các mục không đạt
- [X] T020 [P] Rà soát accessibility cho phần mới: `aria-label`/`aria-current` cho từng dot (ví dụ "Xem video số {n}"), trạng thái focus-visible rõ ràng cho dot và mọi phần tử tương tác mới
- [X] T021 [P] Rà soát responsive & dark mode toàn trang sau khi đổi nền section + thêm nền Hero, đối chiếu SC-002/SC-003

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc — bắt đầu ngay
- **Foundational (Phase 2)**: Chỉ là bước xác nhận baseline, không thực sự chặn kỹ thuật — nhưng nên làm trước để có mốc so sánh
- **User Stories (Phase 3-6)**: Cả 4 story độc lập với nhau về mặt kỹ thuật (không chia sẻ file theo cách xung đột — xem ghi chú dưới); có thể làm song song hoặc theo thứ tự ưu tiên P1 → P2 → P2 → P3
- **Polish (Phase 7)**: Phụ thuộc các story muốn đưa vào bản phát hành đã hoàn tất

### Ghi chú về `src/index.njk` (dùng chung bởi US2 và US3)

- T005 (US2) sửa class của `<section id="gallery">` và `<section id="video">`.
- T008 (US3) sửa class của `<section id="hero">`.
- Đây là 2 task **khác dòng, cùng file** — làm được song song bởi 2 người/2 luồng khác nhau miễn là merge tuần tự (không đánh dấu `[P]` với nhau trong tài liệu này để tránh hiểu nhầm là an toàn tuyệt đối khi tự động hoá, nhưng về mặt nội dung không xung đột thật sự).

### Trong mỗi User Story

- Dữ liệu/cấu hình (nếu có, ví dụ T007) trước khi component đọc nó (T009)
- Shortcode/utility CSS (T009, T010) trước khi template gọi tới (T011)
- Script mới (T012) trước khi đăng ký vào `main.js` (T013)
- Story hoàn chỉnh trước khi coi là "xong"

### Parallel Opportunities

- T001 (Setup) không phụ thuộc gì, chạy ngay
- T007 (US3, tạo file JSON mới) có thể làm song song với T003/T004 (US1) hoặc T005/T006 (US2) vì khác file hoàn toàn
- T018, T020, T021 (Polish) có thể chạy song song với nhau (khác mối quan tâm, không sửa cùng dòng file)
- 4 user story (Phase 3-6) có thể do 4 người khác nhau làm song song sau Phase 2, ngoại trừ lưu ý phối hợp ở `index.njk` giữa US2/US3 nêu trên

---

## Parallel Example: User Story 3

```bash
# Có thể làm song song ngay từ đầu US3:
Task: "Tạo src/_data/heroBackground.json mặc định"
# (T009-T013 phụ thuộc tuần tự lẫn nhau như mô tả ở trên, không chạy song song được)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Hoàn tất Phase 1: Setup
2. Hoàn tất Phase 2: Foundational (xác nhận baseline)
3. Hoàn tất Phase 3: User Story 1 (Việt hoá — thay đổi nhỏ, rủi ro thấp)
4. **DỪNG và XÁC THỰC**: chạy quickstart.md mục 2
5. Đây đã là một bản phát hành hợp lệ, độc lập

### Incremental Delivery

1. Setup + Foundational → mốc baseline
2. + US1 (Việt hoá) → xác thực độc lập → có thể release ngay
3. + US2 (nền phân biệt section) → xác thực độc lập → release
4. + US3 (Hero background + parallax) → xác thực độc lập (cả nhánh có/không ảnh) → release
5. + US4 (dots carousel) → xác thực độc lập → release
6. Phase 7 (Polish) → xác thực toàn diện bằng quickstart.md đầy đủ

### Parallel Team Strategy

Với nhiều người triển khai: sau Phase 2, người A làm US1, người B làm US2,
người C làm US3 (nhiều task nhất, nên ưu tiên người rảnh nhất), người D làm
US4 — chỉ cần phối hợp khi merge `src/index.njk` (US2 và US3 cùng chạm file
này, khác section) và `src/assets/scripts/main.js` (US3 thêm import
`hero-parallax.js`, không ảnh hưởng import đã có của US4 trong
`video-carousel.js`).

---

## Notes

- [P] = khác file, không phụ thuộc task chưa hoàn thành
- [Story] gắn task với user story cụ thể để truy vết
- Không có phần "Tests" riêng theo story — chiến lược kiểm thử là mở rộng
  `validate-content.mjs` (T014) + `quickstart.md` (xác thực cuối, T019)
- Mỗi user story nên hoàn thành và test độc lập được trước khi coi là "xong"
- Commit sau mỗi task hoặc nhóm task hợp lý
- Dừng ở bất kỳ checkpoint nào để xác thực story độc lập trước khi tiếp tục
- Tránh: task mơ hồ, hai task cùng sửa một DÒNG file chạy song song không phối hợp, phụ thuộc chéo giữa story phá vỡ tính độc lập
