# Quickstart: Xác thực Trang Landing Page BeBeo Gallery

Hướng dẫn này giúp chạy thử tính năng end-to-end và xác nhận từng kịch bản
chấp nhận trong `spec.md` đã hoạt động đúng. Không lặp lại chi tiết kiến
trúc — xem `plan.md`, `data-model.md`, `contracts/` khi cần tham chiếu.

## 1. Chuẩn bị (Prerequisites)

- Node.js 20 LTS trở lên, npm.
- Repo đã có `package.json` với script `dev`, `build` (thiết lập ở giai đoạn
  implement, xem `plan.md` > Project Structure).

```bash
npm install
```

## 2. Thêm dữ liệu mẫu để test

Thêm tối thiểu 2-3 album vào `src/_data/albums.json` và 1-2 video vào
`src/_data/videos.json`, tuân theo schema ở
`contracts/content-schema.json` (tham khảo field ở `data-model.md`). Đảm
bảo:
- Ít nhất 2 album có `categories` khác nhau (ví dụ 1 album `"Du lịch"`, 1
  album `"Đám cưới"`) để test filter (US2).
- Ít nhất 1 album cố ý để `thumbnail` trỏ tới file không tồn tại, để test
  fallback placeholder (Edge case).
- Ít nhất 1 video với `sourceType: "youtube"` có `embedRef` là ID video công
  khai thật, để test phát trong modal (US3).
- Thêm thumbnail thật (ảnh nhỏ, đã tối ưu) vào
  `src/assets/images/thumbnails/albums/` và `.../videos/` tương ứng.

## 3. Chạy kiểm tra nội dung (build-time content validation)

```bash
npm run build
```

**Kỳ vọng**: build thành công khi dữ liệu hợp lệ; nếu cố tình làm sai một
field bắt buộc (ví dụ xoá `cloudUrl` của một album), `npm run build` MUST
báo lỗi rõ ràng chỉ ra album nào và field nào sai (xem
`scripts/validate-content.mjs`), dừng build thay vì xuất ra trang lỗi.

## 4. Chạy dev server và xác thực thủ công

```bash
npm run dev
```

Mở trình duyệt tới địa chỉ dev server hiển thị trong terminal.

### 4.1 User Story 1 — Header/Hero/Theme (P1)

- [ ] Hero hiển thị đoạn giới thiệu ngắn gọn ngay khi trang tải xong (SC-001).
- [ ] Header hiển thị đúng bố cục trái ("BeBeo Gallery" kiểu chữ viết tay) -
      phải (nav Giới thiệu/Ảnh/Video + nút theme).
- [ ] Nhấn "Ảnh" → cuộn mượt tới section Gallery. Nhấn "Video" → cuộn mượt
      tới section Video.
- [ ] Nhấn nút theme → toàn trang đổi sáng/tối ngay lập tức.
- [ ] Tải lại trang (F5) → theme vừa chọn vẫn giữ nguyên (SC-007).

### 4.2 User Story 2 — Gallery + Filter (P1)

- [ ] Mỗi thẻ album hiển thị đúng: ảnh thumbnail nền, tiêu đề, mô tả địa
      điểm - thời gian (SC-003).
- [ ] Thẻ album có `thumbnail` không hợp lệ hiển thị ảnh placeholder, không
      vỡ layout.
- [ ] Chọn 1 chip chủ đề (ví dụ "Du lịch") → chỉ album thuộc chủ đề đó còn
      hiển thị (đo bằng số lần chạm: chọn filter + nhấn album ≤ 2 lần,
      SC-002).
- [ ] Chọn "Tất cả" → toàn bộ album hiển thị lại.
- [ ] Chọn một chủ đề không có album nào khớp (nếu có thể dựng dữ liệu test
      như vậy) → hiển thị thông báo trạng thái rỗng thân thiện.
- [ ] Nhấn vào một thẻ album → tab mới mở đúng `cloudUrl` của album đó.

### 4.3 User Story 3 — Video Carousel + Modal (P2)

- [ ] Section Video hiển thị carousel với poster + tiêu đề cho từng video.
- [ ] Nhấn vào một video → modal mở và phát video ngay trên trang (không
      điều hướng ra khỏi trang, SC-004).
- [ ] Đóng modal → trở lại đúng vị trí cuộn trước đó trong section Video.
- [ ] (Nếu dựng được dữ liệu lỗi có chủ đích) video có `embedRef` sai/không
      nhúng được → modal hiển thị thông báo fallback kèm link mở trên cloud
      thay vì khung trống/lỗi.
- [ ] Không có video nào trong `videos.json` (thử tạm xoá hết) → section
      Video hiển thị thông báo nhẹ thay vì carousel trống/lỗi.

### 4.4 User Story 4 — Section-snap Desktop (P3)

Thực hiện ở kích thước cửa sổ desktop (≥ breakpoint desktop của Tailwind):

- [ ] Ở section Hero, nhấn phím mũi tên xuống → chuyển sang Gallery.
- [ ] Ở section Gallery, cuộn chuột lên một lần → chuyển về Hero (không cuộn
      tự do từng pixel, SC-006).
- [ ] Mở modal video, nhấn phím mũi tên lên/xuống → trang KHÔNG chuyển
      section trong lúc modal đang mở (FR-018). Đóng modal → phím mũi tên
      hoạt động lại bình thường.
- [ ] Bật "Reduce motion" trong hệ điều hành/trình duyệt → hiệu ứng cuộn
      mượt giữa section giảm/tắt (FR-016), không còn animation giật/mạnh.

### 4.5 Responsive / Mobile (Nguyên tắc II)

Thu nhỏ cửa sổ trình duyệt (hoặc dùng chế độ giả lập thiết bị di động):

- [ ] Toàn bộ nội dung 3 section vẫn hiển thị đầy đủ, không vỡ layout
      (SC-005).
- [ ] Cuộn bằng chạm diễn ra tự nhiên, liên tục — KHÔNG bị ép "nhảy" từng
      section như ở desktop (FR-012).
- [ ] Các thao tác chạm (chọn filter, mở modal, nhấn theme toggle, mở album)
      hoạt động tốt bằng ngón tay, không phụ thuộc hover.

## 5. Hoàn tất

Khi tất cả checkbox ở mục 4 đạt, tính năng được coi là xác thực xong ở mức
quickstart. Ghi lại bất kỳ mục nào không đạt kèm bước tái hiện, dùng làm đầu
vào để điều chỉnh trước khi chuyển sang `/speckit-tasks` → `/speckit-implement`
(nếu phát hiện lỗi sau khi đã implement).
