---

description: "Task list template for feature implementation"
---

# Tasks: Cân Chỉnh Bố Cục Section Video & Footer

**Input**: Design documents from `/specs/003-video-section-footer-layout/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Không yêu cầu TDD/bộ test tự động (kế thừa quyết định từ `001`/`002` — không có framework test trong repo). Chiến lược xác thực là Playwright MCP thủ công theo `quickstart.md`. Vì vậy không có mục "Tests for User Story X" riêng.

**Organization**: Tasks nhóm theo 2 user story trong spec.md (US1 P1, US2 P2). US2 phụ thuộc vào cấu trúc flexbox mà US1 dựng lên (đã ghi rõ trong Dependencies bên dưới).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Có thể chạy song song (khác file, không phụ thuộc task chưa xong)
- **[Story]**: US1 hoặc US2 tương ứng spec.md
- Mỗi task nêu rõ đường dẫn file cụ thể

## Path Conventions

Single static frontend project đã có (`001`). Đây là bản vá layout nhỏ,
không có file hoàn toàn mới — chỉ sửa 4 file template đã tồn tại.

## Phase 1: Setup

- [X] T001 Chạy `npm run build` trên codebase hiện tại (chưa sửa gì) để xác nhận baseline sạch, làm mốc so sánh trước/sau

**Checkpoint**: Baseline xác nhận sạch, sẵn sàng vào US1.

---

## Phase 2: Foundational

**Purpose**: Không có prerequisite chặn nào khác ngoài baseline ở Phase 1 — toàn bộ cấu trúc cốt lõi (di chuyển footer, đổi `h-screen`/flex) thuộc về US1 vì US1 (P1) là điều kiện đủ để giải quyết vấn đề chính (footer bị che); US2 chỉ bổ sung canh giữa lên trên cấu trúc đó.

*(Không có task nào ở phase này cho feature nhỏ này.)*

---

## Phase 3: User Story 1 - Footer hiển thị cùng màn hình với section Video (Priority: P1) 🎯 MVP

**Goal**: Trên desktop, khi đến section Video (cuối cùng), footer hiển thị đầy đủ trong cùng màn hình, không cần cuộn thêm.

**Independent Test**: Resize 1440×900 và 1366×768, dùng phím/scroll đến section Video, xác nhận `footer.getBoundingClientRect()` nằm trọn trong viewport (quickstart.md mục 2).

### Implementation for User Story 1

- [X] T002 [US1] Sửa `src/_includes/layouts/base.njk`: xoá dòng `{% include "partials/footer.njk" %}` ngay sau `</main>` (footer sẽ được include từ nơi khác ở T003)
- [X] T003 [US1] Sửa `src/index.njk`: đổi class của `<section id="video">` từ `lg:min-h-screen` thành `lg:flex lg:h-screen lg:flex-col` (giữ nguyên `bg-water-50 dark:bg-earth-900 lg:snap-start`); thêm `{% include "partials/footer.njk" %}` làm dòng cuối cùng bên trong section này, ngay sau `{% include "partials/video-section.njk" %}` (FR-001, theo research.md mục 3)
- [X] T004 [US1] Sửa `src/_includes/partials/footer.njk`: thêm class `lg:flex-none` vào thẻ `<footer>` để nó giữ chiều cao tự nhiên, không bị flexbox kéo giãn (research.md mục 3)
- [X] T005 [US1] Xác thực trực quan qua Playwright MCP (dev server thật): resize 1440×900 và 1366×768, đến section Video bằng phím mũi tên/cuộn chuột, đo `footer.getBoundingClientRect()` để xác nhận `top >= 0` và `bottom <= innerHeight`; resize 390×844 (mobile) và xác nhận layout/footer KHÔNG đổi so với trước (FR-002, FR-003, SC-001, SC-002, SC-003)

**Checkpoint**: User Story 1 hoàn tất, test độc lập được — vấn đề chính (footer bị che) đã được giải quyết.

---

## Phase 4: User Story 2 - Nội dung section Video canh giữa theo chiều dọc (Priority: P2)

**Goal**: Trên desktop, tiêu đề/carousel/dots của section Video được canh giữa cân đối trong phần không gian còn lại (sau khi đã trừ chỗ cho footer ở US1), thay vì dồn lên trên.

**Independent Test**: Với cấu trúc flex từ US1 đã có, xác nhận nội dung Video có khoảng đệm cân đối trên/dưới trong vùng nội dung (không tính footer), ổn định với các số lượng video khác nhau (quickstart.md mục 3).

### Implementation for User Story 2

- [X] T006 [US2] Sửa `src/_includes/partials/video-section.njk`: thêm `lg:flex-1 lg:flex lg:flex-col lg:justify-center` vào class của `<div>` gốc (giữ nguyên `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`) để nội dung tự canh giữa trong phần không gian còn lại sau footer (FR-004, research.md mục 3)
- [X] T007 [US2] Nếu khi xác thực (T008) thấy nội dung bị dồn sát mép do padding `lg:py-24` quá lớn so với không gian còn lại, giảm nhẹ giá trị này (ví dụ `lg:py-16`) trong cùng file — quyết định số liệu dựa trên quan sát thực tế, không đoán trước
- [X] T008 [US2] Xác thực trực quan: chụp/kiểm tra section Video ở 1440×900 và 1366×768 với dữ liệu hiện có (3 video), rồi thử tạm với 1 video và với danh sách rỗng trong `videos.json` (khôi phục lại sau khi xác thực) — xác nhận canh giữa ổn định trong mọi trường hợp, không vỡ layout (FR-004, Edge case trong spec.md)

**Checkpoint**: User Story 1 + 2 hoạt động cùng nhau — section Video vừa không che footer, vừa canh giữa cân đối.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Xác nhận không hồi quy các tính năng đã có từ `001`/`002`

- [X] T009 [P] Xử lý dự phòng cho chiều cao màn hình quá thấp (Edge case): nếu quan sát thấy nội dung Video + footer tràn quá 100vh ở viewport rất thấp trong lúc xác thực T005/T008, thêm `lg:overflow-y-auto` cho vùng nội dung Video (không phải toàn section) trong `src/_includes/partials/video-section.njk` (research.md mục 4) — chỉ áp dụng nếu thực sự quan sát thấy tràn
- [X] T010 Chạy lại hồi quy đầy đủ theo `quickstart.md` mục 4: điều hướng phím/cuộn chuột giữa Hero-Gallery-Video (`001`), carousel + dots (`002`), mở/đóng modal video + phím Esc + focus (`001`/`002`)
- [X] T011 [P] Chạy `rm -rf _site && npm run build` để xác nhận build sạch từ đầu, không lỗi

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc — bắt đầu ngay
- **Foundational (Phase 2)**: Trống — không có gì chặn ngoài baseline
- **US1 (Phase 3)**: Sau Phase 1 — độc lập, tự giải quyết trọn vẹn vấn đề chính
- **US2 (Phase 4)**: **Phụ thuộc cấu trúc flex do US1 dựng lên** (T003) — không thể "canh giữa trong không gian còn lại sau footer" nếu chưa có không gian đó; về mặt test vẫn có Independent Test riêng, nhưng về thứ tự implement, T006 cần T003 đã xong
- **Polish (Phase 5)**: Phụ thuộc US1 + US2 đã xong

### Trong mỗi User Story

- US1: T002 (xoá include cũ) → T003 (include mới + đổi class section) → T004 (class footer) → T005 (xác thực). Thứ tự này quan trọng vì T003 tạo ra vị trí include mới mà T002 vừa dọn chỗ.
- US2: T006 (thêm class canh giữa) → T007 (tinh chỉnh padding nếu cần, dựa trên quan sát) → T008 (xác thực)

### Parallel Opportunities

- T001 không phụ thuộc gì, chạy ngay
- T009 và T011 (Polish) có thể chạy song song với nhau (khác mối quan tâm)
- Không có task nào trong US1/US2 an toàn để chạy song song với nhau trong cùng story vì đều sửa tuần tự cùng logic liên quan (footer/section video)

---

## Implementation Strategy

### MVP First (User Story 1)

1. Hoàn tất Phase 1 (baseline)
2. Hoàn tất Phase 3 (US1) — đây đã giải quyết trọn vẹn vấn đề "tốn công cuộn để xem footer"
3. **DỪNG và XÁC THỰC**: quickstart.md mục 2
4. Đây là bản vá hợp lệ, có thể dừng ở đây nếu chỉ cần sửa vấn đề footer

### Incremental Delivery

1. Setup → baseline
2. + US1 → xác thực độc lập → vấn đề chính đã hết
3. + US2 → xác thực độc lập → section Video còn cân đối về thị giác
4. Phase 5 (Polish) → xác nhận không hồi quy, build sạch

---

## Notes

- [P] = khác file, không phụ thuộc task chưa hoàn thành
- Không có phần "Tests" riêng theo story — xác thực bằng Playwright MCP thủ công theo `quickstart.md`
- Feature này chỉ sửa 4 file đã tồn tại, không tạo file mới, không đổi dữ liệu
- Commit sau mỗi task hoặc nhóm task hợp lý
- Nhớ khôi phục lại `videos.json` về trạng thái gốc sau khi thử nghiệm với 1 video/rỗng ở T008

---

## Phase 6: Convergence

Phát hiện qua `/speckit-converge` (2026-09-22), dựa trên 2 bug người dùng báo
cáo trực tiếp và đã được xác minh bằng Playwright (đo `getBoundingClientRect()`
và `getComputedStyle()` thực tế trên dev server) trước khi ghi nhận.

- [X] T012 Sửa `src/assets/scripts/section-scroll.js` per 003 FR-006 (kế thừa cơ chế điều hướng section từ 001 FR-011) (contradicts): cơ chế điều hướng phím/cuộn chuột hiện luôn nhảy thẳng tới section kế tiếp/trước theo `getBoundingClientRect().top` gần nhất, không phát hiện khi section hiện tại (ví dụ Gallery) cao hơn 100vh còn nội dung chưa hiện trong khung nhìn — xác minh thực tế: Gallery cao 1290px so với viewport 900px, 1 lần wheel từ đầu Gallery nhảy thẳng gần tới đầu Video, bỏ qua ~390px nội dung Gallery chưa xem. Cần điều chỉnh để cuộn hết phần nội dung còn lại của section hiện tại trước khi chuyển sang section kế tiếp.
- [X] T013 Sửa `src/_includes/partials/footer.njk` per 003 US1 (footer hiển thị cùng màn hình Video) (partial): inline style `padding-bottom: env(safe-area-inset-bottom, 0px)` đang ghi đè (thay vì cộng dồn) mất padding-bottom của class `py-6` — xác minh thực tế bằng `getComputedStyle`: `paddingTop: "24px"` nhưng `paddingBottom: "0px"`, khiến footer không có chiều cao/padding cân đối và text không canh giữa theo chiều dọc. Cần cộng dồn safe-area-inset vào padding cơ bản (ví dụ `calc(1.5rem + env(safe-area-inset-bottom, 0px))`) thay vì thay thế, để padding trên dưới đối xứng và text canh giữa ngang dọc trên mọi thiết bị.
