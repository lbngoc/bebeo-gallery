# Quickstart: Xác thực Hoàn Thiện Ngôn Ngữ & Hiệu Ứng Thị Giác Trang Chủ

Hướng dẫn xác thực nhanh sau khi implement, dựa trên `spec.md` (User Story
1-4). Giả định đã có sẵn `node_modules` từ `001-gallery-landing-page`
(`npm install` nếu chưa có).

## 1. Build & chạy dev server

```bash
npm run build   # xác nhận validate-content.mjs vẫn pass (kể cả khi chưa có heroBackground.json)
npm run dev
```

## 2. User Story 1 — Tiếng Việt toàn trang

- [ ] Mở footer: liên kết cuộn về đầu trang hiển thị nhãn tiếng Việt (không còn "Back to Top").
- [ ] Duyệt Header/Hero/Gallery/Video/Footer: không còn cụm tiếng Anh nào ngoài "Video" và "cloud" (đã ghi nhận là loanword có chủ đích trong `research.md` mục 1).

## 3. User Story 2 — Nền phân biệt theo section

- [ ] Cuộn từ Hero → Gallery → Video (desktop và mobile): xác nhận Gallery và Video có tông nền rõ ràng khác nhau (không còn 1 màu nền phẳng xuyên suốt).
- [ ] Chuyển đổi sáng/tối: xác nhận sự phân biệt nền vẫn rõ ở cả 2 chế độ.

## 4. User Story 3 — Nền + parallax Hero

### 4.1 Mặc định (không cấu hình `heroBackground.json`)

- [ ] Hero hiển thị nền trừu tượng (gradient/khối màu theo tông Thủy-Thổ), không phải nền phẳng đơn sắc.
- [ ] Cuộn qua Hero trên desktop: quan sát lớp nền di chuyển khác tốc độ so với tiêu đề/nút bấm (hiệu ứng parallax).
- [ ] Bật "giảm hiệu ứng chuyển động" (DevTools > Rendering > Emulate CSS prefers-reduced-motion, hoặc cài đặt hệ điều hành) và tải lại: cuộn qua Hero, xác nhận nền đứng yên (không parallax) nhưng vẫn hiển thị.

### 4.2 Có cấu hình ảnh thật

- [ ] Thêm 1 ảnh vào `src/assets/images/hero/`, tạo `src/_data/heroBackground.json`:
  ```json
  { "image": "/assets/images/hero/ten-anh.jpg", "filter": "tinted" }
  ```
- [ ] Build/dev lại: Hero hiển thị ảnh đã cấu hình, với tông màu đã lọc (không phải màu gốc ảnh).
- [ ] Đổi `filter` sang `"mono"`: xác nhận ảnh chuyển sang tông đơn sắc trắng/đen.
- [ ] Xoá field `filter` khỏi JSON (chỉ giữ `image`): xác nhận hệ thống tự áp dụng mặc định `tinted` (không lỗi, không hiển thị ảnh gốc chưa lọc).
- [ ] Sửa `image` trỏ tới file không tồn tại: xác nhận Hero tự động rơi về nền trừu tượng mặc định, `npm run build` vẫn thành công (không chặn build).

## 5. User Story 4 — Dots điều hướng carousel Video

- [ ] Trên desktop, section Video: xác nhận không còn nút mũi tên trước/tiếp.
- [ ] Xác nhận có 1 dãy chấm bên dưới carousel, số chấm khớp số video trong `videos.json`.
- [ ] Nhấn vào 1 chấm bất kỳ: carousel cuộn đến đúng video tương ứng, chấm đó được đánh dấu nổi bật.
- [ ] Tự vuốt/cuộn ngang track (không bấm chấm): xác nhận chấm nổi bật tự cập nhật đúng theo video đang hiển thị (SC-006).
- [ ] Sửa tạm `videos.json` chỉ còn 1 video (hoặc rỗng): xác nhận dãy chấm không hiển thị.
- [ ] Trên mobile: xác nhận dãy chấm vẫn hiển thị và bấm được (không chỉ desktop).

## 6. Hoàn tất

Khi tất cả checkbox ở mục 2-5 đạt, coi tính năng đã xác thực xong ở mức
quickstart. Nếu dùng Playwright MCP (như đã làm ở `001`), có thể lặp lại các
bước trên bằng `browser_navigate`/`browser_snapshot`/`browser_evaluate` để
xác thực tự động hoá thay vì thao tác thủ công hoàn toàn.
