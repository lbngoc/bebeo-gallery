# Phase 1 Data Model: Trang Landing Page BeBeo Gallery

Nguồn: mục "Key Entities" của `spec.md` + các quyết định lưu trữ ở
`research.md` (mục 4). Toàn bộ dữ liệu là file phẳng JSON, không có
database — các "entity" dưới đây tương ứng với cấu trúc bản ghi trong
`src/_data/albums.json` và `src/_data/videos.json`.

## Album

Đại diện cho một album ảnh gia đình đã lưu trên dịch vụ cloud (FR-005,
FR-006, FR-007, FR-014).

| Field | Type | Required | Mô tả / Ràng buộc |
|---|---|---|---|
| `id` | string (slug) | Yes | Định danh duy nhất, dùng làm key React/Alpine `x-for` và cho liên kết nội bộ (nếu cần). Duy nhất trong toàn bộ `albums.json`. |
| `title` | string | Yes | Tiêu đề album hiển thị trên thẻ (FR-005). Không rỗng. |
| `location` | string | Yes | Địa điểm, hiển thị cùng `date` trong mô tả thẻ (FR-005). |
| `date` | string (ISO 8601, `YYYY-MM` hoặc `YYYY-MM-DD`) | Yes | Thời gian của album; dùng để hiển thị và có thể dùng sắp xếp mặc định (mới nhất trước). |
| `description` | string | No | Mô tả bổ sung ngắn (tuỳ chọn), không bắt buộc theo FR-005 (chỉ yêu cầu địa điểm - thời gian là tối thiểu). |
| `categories` | array<string> | Yes, tối thiểu 1 phần tử | Một hoặc nhiều chủ đề/tag (ví dụ `"Đám cưới"`, `"Du lịch"`); nguồn cho bộ lọc nhanh (FR-006). |
| `thumbnail` | string (đường dẫn tương đối) | Yes | Đường dẫn tới ảnh thumbnail nguồn trong `src/assets/images/thumbnails/albums/`, được `eleventy-img` xử lý (research.md mục 5). Nếu thiếu/không hợp lệ → dùng ảnh placeholder (FR-015). |
| `cloudUrl` | string (URL) | Yes | Đường dẫn gốc của album trên dịch vụ cloud (Google Drive/pCloud/...); mở ở tab mới khi nhấn thẻ (FR-007). |
| `cloudProvider` | enum: `google-drive` \| `pcloud` \| `other` | No | Dùng để hiển thị icon/nhãn nguồn (tuỳ chọn UI), không ảnh hưởng logic bắt buộc. |

**Validation rules** (thực thi bởi `scripts/validate-content.mjs`, xem
`contracts/content-schema.json`):
- `id` duy nhất trong toàn bộ danh sách.
- `title`, `location`, `date`, `thumbnail`, `cloudUrl` không được rỗng.
- `categories` phải có ít nhất 1 phần tử, mỗi phần tử là chuỗi không rỗng.
- `cloudUrl` phải là URL hợp lệ (bắt đầu bằng `http://` hoặc `https://`).

**Lifecycle**: Không có trạng thái động — album được thêm/sửa/xoá bằng cách
sửa trực tiếp `albums.json` + rebuild/redeploy (Quy trình quản lý nội dung,
constitution). Không có ghi runtime.

## Video Nổi Bật (FeaturedVideo)

Đại diện cho một video được chọn hiển thị trong carousel Section Video
(FR-008, FR-009, FR-018).

| Field | Type | Required | Mô tả / Ràng buộc |
|---|---|---|---|
| `id` | string (slug) | Yes | Định danh duy nhất trong `videos.json`. |
| `title` | string | Yes | Tiêu đề video hiển thị trong carousel/modal. |
| `poster` | string (đường dẫn tương đối) | Yes | Ảnh đại diện (thumbnail) trong `src/assets/images/thumbnails/videos/`, xử lý qua `eleventy-img`. |
| `sourceType` | enum: `youtube` \| `google-drive` \| `pcloud` | Yes | Xác định cách dựng URL nhúng trong modal (research.md mục 6). |
| `embedRef` | string | Yes | Giá trị dùng để dựng URL nhúng: video ID (YouTube), file ID (Google Drive), hoặc link preview công khai (pCloud). Ý nghĩa cụ thể phụ thuộc `sourceType`. |
| `fallbackUrl` | string (URL) | Yes | URL gốc trên cloud để mở trực tiếp khi nhúng thất bại (FR-015). |
| `order` | integer | No | Thứ tự hiển thị trong carousel; nếu thiếu, dùng thứ tự xuất hiện trong file. |

**Validation rules**:
- `id` duy nhất trong toàn bộ danh sách.
- `title`, `poster`, `embedRef`, `fallbackUrl` không được rỗng.
- `sourceType` phải thuộc tập `{youtube, google-drive, pcloud}`.
- `fallbackUrl` phải là URL hợp lệ.

**Lifecycle**: Tương tự Album — tĩnh, chỉnh sửa qua file + rebuild. Trạng
thái "đang phát/đang đóng" của modal là state phía client (Alpine), không
thuộc data model nội dung.

## Chủ Đề (Category) — Computed, không phải file riêng

Không lưu trữ như một entity/file độc lập. Tại build time, Eleventy computed
data (`src/_data/categories.11tydata.js`) duyệt qua toàn bộ `albums.json`,
gom tập hợp duy nhất các giá trị trong trường `categories` của mọi album, và
xuất ra một mảng chuỗi đã sắp xếp — dùng để render danh sách chip filter
trong Gallery (FR-006), kèm tuỳ chọn "Tất cả" luôn hiển thị đầu tiên.

**Rationale cho việc không có entity riêng**: tránh hai nguồn sự thật (mảng
category cố định riêng có thể lệch với tag thực tế trên album) — nhất quán
với nguyên tắc "single source of truth" và Nguyên tắc I (không thêm cấu trúc
dữ liệu không cần thiết).

## Quan hệ giữa các entity

```text
Album 1---* categories (giá trị chuỗi, không phải bảng riêng)
Category (computed) *---1 derived-from Album.categories (mọi album)
FeaturedVideo (độc lập, không có quan hệ với Album)
```

- Một Album có thể thuộc nhiều Category (many tag trên 1 album).
- Category không tồn tại độc lập — chỉ tồn tại nếu có ít nhất 1 Album tham
  chiếu tới nó (không có "chủ đề rỗng" không gắn album nào).
- FeaturedVideo không liên kết với Album trong scope của spec hiện tại
  (không có yêu cầu "video thuộc về album nào" — đây là danh sách độc lập).
