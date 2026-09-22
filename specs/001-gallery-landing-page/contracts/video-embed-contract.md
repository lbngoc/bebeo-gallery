# Contract: Video Embed URL theo `sourceType`

Hợp đồng này định nghĩa cách component modal video (`video-modal.js` /
`video-modal.njk`) dựng URL nhúng (`<iframe src="...">`) từ một bản ghi
`FeaturedVideo` (xem `data-model.md`), dựa trên trường `sourceType` và
`embedRef`. Đây là "giao diện" giữa dữ liệu nội dung (`videos.json`) và
logic hiển thị — thay đổi định dạng `embedRef` cho một `sourceType` là thay
đổi phá vỡ hợp đồng này và MUST được cập nhật đồng bộ ở cả dữ liệu lẫn code.

## 1. `sourceType: "youtube"`

- **`embedRef`**: YouTube video ID (ví dụ `"dQw4w9WgXcQ"`, không phải URL
  đầy đủ).
- **URL nhúng dựng ra**: `https://www.youtube-nocookie.com/embed/{embedRef}`
- **Ghi chú**: dùng domain `youtube-nocookie.com` để giảm cookie/tracking
  khi chưa play, phù hợp tinh thần "trang cá nhân/gia đình, tối giản".

## 2. `sourceType: "google-drive"`

- **`embedRef`**: Google Drive file ID (chuỗi ID trong URL chia sẻ, ví dụ
  phần `{fileId}` trong
  `https://drive.google.com/file/d/{fileId}/view?usp=sharing`).
- **URL nhúng dựng ra**: `https://drive.google.com/file/d/{embedRef}/preview`
- **Điều kiện tiên quyết**: file trên Drive phải ở chế độ chia sẻ "Anyone
  with the link" (hoặc tương đương công khai không cần đăng nhập), nếu
  không modal sẽ không phát được → áp dụng fallback (FR-015).

## 3. `sourceType: "pcloud"`

- **`embedRef`**: link preview/embed công khai do pCloud cấp cho file đã
  chia sẻ (không phải link tải trực tiếp) — chủ trang lấy link này từ tính
  năng "chia sẻ công khai" của pCloud khi thêm video vào `videos.json`.
- **URL nhúng dựng ra**: dùng trực tiếp `embedRef` làm `src` của iframe
  (không biến đổi thêm), vì pCloud cấp sẵn link dạng nhúng được.
- **Điều kiện tiên quyết**: link phải hỗ trợ nhúng qua iframe (một số kiểu
  share link của pCloud chỉ hỗ trợ xem trực tiếp trên trang pCloud, không
  nhúng được) — nếu không nhúng được, áp dụng fallback (FR-015) dùng
  `fallbackUrl`.

## Fallback chung (FR-015)

Nếu iframe không tải được nội dung (timeout/lỗi tải, hoặc nguồn từ chối
nhúng — ví dụ phản hồi `X-Frame-Options`), modal MUST hiển thị thông báo dự
phòng thân thiện kèm một liên kết mở trực tiếp `fallbackUrl` ở tab mới, thay
vì để khung iframe trống hoặc lỗi trắng.

## Bảng tóm tắt

| sourceType | `embedRef` chứa gì | URL nhúng |
|---|---|---|
| `youtube` | Video ID | `https://www.youtube-nocookie.com/embed/{embedRef}` |
| `google-drive` | File ID | `https://drive.google.com/file/d/{embedRef}/preview` |
| `pcloud` | Link preview công khai đầy đủ | `{embedRef}` (dùng trực tiếp) |
