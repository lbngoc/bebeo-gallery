# Quickstart: Xác thực Cân Chỉnh Bố Cục Section Video & Footer

Dựa trên `spec.md` (User Story 1-2). Giả định `node_modules` đã có sẵn.

## 1. Chạy dev server

```bash
npm run build   # xác nhận vẫn build sạch (không đổi dữ liệu, chỉ layout)
npm run dev
```

## 2. User Story 1 — Footer hiển thị cùng màn hình với section Video (desktop)

- [ ] Resize trình duyệt về 1440×900. Dùng phím mũi tên (hoặc cuộn chuột)
      để đến section cuối cùng (Video).
- [ ] Xác nhận: toàn bộ nội dung footer (dòng bản quyền + "Lên đầu trang")
      hiển thị trong cùng màn hình, không cần thao tác cuộn/nhấn phím nào
      thêm.
- [ ] Đo bằng `footer.getBoundingClientRect()`: `top >= 0` và
      `bottom <= window.innerHeight`.
- [ ] Lặp lại ở 1366×768 (ngưỡng tối thiểu theo SC-002) — vẫn không bị cắt
      xén nội dung Video (tiêu đề, carousel, dots) và footer vẫn hiển thị
      đầy đủ.
- [ ] Nhấn "Lên đầu trang" trong footer: xác nhận cuộn mượt về Hero như
      bình thường (không có gì đổi ở hành vi này).

## 3. User Story 2 — Nội dung Video canh giữa theo chiều dọc

- [ ] Ở section Video (desktop), xác nhận khối tiêu đề + carousel + dots
      không dồn sát lên trên — có khoảng đệm cân đối phía trên và dưới
      trong phần không gian dành cho nội dung (không tính phần footer).
- [ ] Thử với dữ liệu video khác số lượng (ví dụ tạm sửa `videos.json` chỉ
      còn 1 video, hoặc rỗng) — xác nhận canh giữa vẫn ổn định, không vỡ
      layout, footer vẫn hiển thị đúng vị trí.

## 4. Không hồi quy (regression)

- [ ] Điều hướng phím mũi tên/cuộn chuột giữa Hero → Gallery → Video vẫn
      hoạt động đúng như trước (từ `001`).
- [ ] Carousel video (vuốt/cuộn ngang) và dots (bấm để chuyển, tự đồng bộ
      khi cuộn tay — từ `002`) vẫn hoạt động đúng.
- [ ] Modal video (mở/đóng, phím Esc, focus) vẫn hoạt động đúng.
- [ ] Resize về mobile (390×844): xác nhận layout và vị trí footer KHÔNG
      đổi gì so với trước thay đổi này (footer vẫn ở cuối trang qua cuộn
      tự nhiên).

## 5. Hoàn tất

Khi tất cả checkbox ở mục 2-4 đạt, coi tính năng đã xác thực xong ở mức
quickstart. Khuyến khích dùng Playwright MCP (như đã làm ở `001`/`002`) để
thực hiện các phép đo `getBoundingClientRect()` và chụp ảnh màn hình so
sánh trước/sau.
