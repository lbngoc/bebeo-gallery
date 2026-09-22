# Phase 1 Data Model: Hoàn Thiện Ngôn Ngữ & Hiệu Ứng Thị Giác Trang Chủ

Feature này không thay đổi entity dữ liệu nội dung (Album, Video nổi bật,
Chủ đề) đã định nghĩa ở `001-gallery-landing-page/data-model.md`. Chỉ thêm
**1 entity cấu hình giao diện mới** và **1 state phía client** (không phải
dữ liệu lưu trữ).

## Cấu Hình Nền Hero (HeroBackgroundConfig)

Lưu tại `src/_data/heroBackground.json` — file phẳng, toàn cục, tuỳ chọn
(có thể vắng mặt hoàn toàn hoặc để `image: null`).

| Field | Type | Required | Mô tả / Ràng buộc |
|---|---|---|---|
| `image` | string \| null | Không | Đường dẫn tương đối tới ảnh nền Hero trong `src/assets/images/hero/`. `null`, chuỗi rỗng, hoặc vắng mặt ⇒ dùng nền trừu tượng mặc định (FR-006c). |
| `filter` | enum: `"mono"` \| `"tinted"` | Không | Kiểu bộ lọc màu áp dụng khi có `image` (FR-006b). Nếu vắng mặt nhưng `image` có giá trị, mặc định `"tinted"` (Edge case). Bỏ qua nếu không có `image`. |

**Validation rules** (thực thi trong `scripts/validate-content.mjs`, xem
`contracts/hero-background-schema.json`):
- Nếu file `heroBackground.json` tồn tại, nội dung phải là object hợp lệ.
- `image`, nếu có mặt và khác `null`, phải là chuỗi không rỗng.
- `filter`, nếu có mặt, phải thuộc `{mono, tinted}`.
- Nếu `image` trỏ tới file không tồn tại trên đĩa tại build time, hệ thống
  (shortcode `heroBackground` trong `.eleventy.js`) MUST tự động rơi về nền
  trừu tượng mặc định thay vì làm hỏng build (nhất quán cách `cardImage` xử
  lý thumbnail thiếu) — đây là hành vi runtime/build-time, không phải lỗi
  validate chặn build (khác với album/video, nơi field bắt buộc thiếu sẽ
  chặn build; ở đây `image` vốn là tuỳ chọn nên "thiếu file" chỉ kích hoạt
  fallback, không phải lỗi).

**Lifecycle**: Tĩnh, chỉnh sửa thủ công bởi chủ trang qua file + rebuild,
giống hệt quy trình quản lý nội dung album/video đã có.

## State Phía Client: Vị Trí Carousel Video (không lưu trữ)

Không phải dữ liệu file — là state runtime trong component Alpine
`videoCarousel` (`src/assets/scripts/video-carousel.js`), tồn tại chỉ trong
phiên xem của trình duyệt, ghi ở đây để làm rõ hợp đồng hành vi giữa
`video-section.njk` (render dots) và `video-carousel.js` (logic):

| Field | Type | Mô tả |
|---|---|---|
| `activeIndex` | integer (0-based) | Chỉ số video hiện đang ở đầu khung nhìn của track carousel; cập nhật khi: (a) người dùng bấm 1 dot → `goToIndex(i)` set trực tiếp, hoặc (b) người dùng tự cuộn/vuốt track → tính lại từ vị trí cuộn thực tế (FR-012). |

Không có ràng buộc validate (state phía client, không phải nội dung do
người dùng nhập).

## Quan hệ

```text
HeroBackgroundConfig  — độc lập, không liên kết Album/Video/Chủ đề
videoCarousel.activeIndex — tham chiếu tới videos[index] (index khớp thứ tự
                              render trong video-section.njk, cùng nguồn dữ
                              liệu videos.json đã có từ 001)
```
