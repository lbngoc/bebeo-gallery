# Phase 0 Research: Hoàn Thiện Ngôn Ngữ & Hiệu Ứng Thị Giác Trang Chủ

Không còn mục `NEEDS CLARIFICATION` nào trong Technical Context của plan.md.
Tài liệu này ghi lại các quyết định kỹ thuật đã chốt trước khi thiết kế
(Phase 1), dựa trên rà soát trực tiếp mã nguồn hiện có của
`001-gallery-landing-page` (không phỏng đoán).

## 1. Kết quả audit văn bản tiếng Anh còn sót (US1)

**Decision**: Đã grep toàn bộ `src/_includes/**/*.njk` và `src/assets/scripts/**/*.js`
để tìm text hiển thị cho người dùng. Kết quả:

- **Duy nhất 1 chỗ cần sửa**: liên kết "Back to Top" ở `footer.njk` → đổi
  thành "Lên đầu trang" (tự nhiên, ngắn gọn, phổ biến trên site tiếng Việt).
- **Các từ mượn giữ nguyên có chủ đích** (đã xuất hiện nhất quán, không phải
  sơ suất): "Video" (nav, tiêu đề section, nút, aria-label), "cloud" (trong
  cụm "ảnh gốc trên cloud" / "video trên cloud" ở gallery.njk và
  video-modal.njk). Không có từ tiếng Việt nào tự nhiên hơn "cloud" trong
  ngữ cảnh lưu trữ đám mây phổ biến hiện nay; ép dịch thành "đám mây" sẽ nghe
  gượng gạo hơn trong câu.
- "BeBeo Gallery" là tên thương hiệu, không thuộc phạm vi dịch thuật.

**Rationale**: Audit trực tiếp trên mã nguồn thật (không suy đoán) cho thấy
phạm vi US1 nhỏ hơn nhiều so với vẻ ngoài của yêu cầu — chỉ 1 thay đổi text
thực sự cần thiết, phần còn lại là xác nhận/ghi nhận các quyết định giữ
nguyên tiếng Anh đã đúng đắn từ trước.

**Alternatives considered**: Dịch "cloud" thành "đám mây" trong mọi chỗ — bị
loại vì làm câu văn thiếu tự nhiên hơn so với cách người Việt dùng thực tế
("lưu trên cloud", "link cloud" là cách nói phổ biến).

## 2. Nền phân biệt theo section (US2)

**Decision**: Dùng lại đúng các token màu Thủy/Thổ đã định nghĩa trong
`main.css`, không thêm màu mới, phối theo kiểu "đổi hue xen kẽ" giữa 2
section nội dung (Gallery/Video), Hero có lớp nền riêng (xem mục 3):

| Section | Nền (light) | Nền (dark) |
|---|---|---|
| Gallery | `bg-earth-50` (giữ nguyên như hiện tại) | `dark:bg-water-900` (giữ nguyên) |
| Video | `bg-water-50` (mới — đổi hue) | `dark:bg-earth-900` (mới — đổi hue) |

**Rationale**: Đổi hue (ấm ↔ lạnh) giữa 2 section liền kề tạo khác biệt rõ
rệt hơn là chỉ đổi độ đậm/nhạt trong cùng 1 hue; đồng thời các class màu chữ
hiện có (`text-water-800 dark:text-earth-50`) trong `gallery.njk` và
`video-section.njk` vẫn giữ đủ độ tương phản trên cặp nền mới (do tương phản
phụ thuộc độ sáng/tối, không phụ thuộc hue) — không cần sửa lại màu chữ, chỉ
cần đổi class nền của `<section>` trong `index.njk`.

**Alternatives considered**: Dùng ảnh nền/hoạ tiết pattern riêng cho từng
section — vượt quá yêu cầu "phân rõ bằng background" ở mức đơn giản, tăng
chi phí tải trang không cần thiết cho một trang cá nhân/gia đình.

## 3. Nền trang trí + parallax cho Hero (US3)

**Decision — nền mặc định (trừu tượng)**: Dựng bằng CSS thuần (không ảnh):
2-3 lớp `radial-gradient`/`conic-gradient` "khối màu mềm" (soft blobs) dùng
token `water-300/400/500` và `earth-300/400`, đặt trong một lớp `<div>` phủ
toàn Hero, có `filter: blur(...)` để tạo cảm giác mềm mại, đặt phía sau nội
dung chữ (`z-index` thấp hơn).

**Decision — nền ảnh thật (khi cấu hình)**: Đọc `src/_data/heroBackground.json`
(xem data-model.md); nếu có `image` hợp lệ, dùng `@11ty/eleventy-img` (như
`cardImage` đã làm cho thumbnail) để tối ưu/responsive ảnh, phủ toàn Hero
bằng kỹ thuật "absolute cover" đã dùng cho album-card; áp dụng CSS filter:
- `mono`: `filter: grayscale(1) contrast(1.05)`
- `tinted`: `filter: grayscale(1) sepia(0.3)` kết hợp một lớp phủ màu
  (`::after` hoặc `<div>` riêng) dùng `mix-blend-mode: color` với tông
  `water-700`/`earth-500` tuỳ theme sáng/tối, để ảnh "nhuốm" đúng tông site
  thay vì giữ màu gốc.
Nếu ảnh cấu hình không đọc được (thiếu file), tự động dùng lại nền trừu
tượng mặc định — nhất quán với cách `cardImage` shortcode đã xử lý fallback
cho thumbnail album (`.eleventy.js`).

**Decision — cơ chế parallax**: JS thuần (không thư viện), lắng nghe sự kiện
`scroll` ở `window` (throttle qua `requestAnimationFrame`), tính toán vị trí
Hero so với viewport (`getBoundingClientRect`), áp `transform:
translate3d(0, {offset}px, 0)` lên lớp nền (khác tốc độ với nội dung tiền
cảnh vốn không bị transform). Khi `prefers-reduced-motion: reduce`, KHÔNG
gắn listener — lớp nền đứng yên hoàn toàn (đáp ứng FR-008), tái sử dụng đúng
pattern kiểm tra `matchMedia("(prefers-reduced-motion: reduce)")` đã có ở
`section-scroll.js`.

**Rationale**: `background-attachment: fixed` (CSS-only parallax) bị nhiều
trình duyệt mobile vô hiệu hoá vì lý do hiệu năng/pin, và có thể xung đột
khi phần tử cha có `transform`/`overflow` (vốn có thể xuất hiện do cơ chế
scroll-snap của `001`); dùng JS + `transform` cho kết quả nhất quán, dễ kiểm
soát việc tắt khi reduced-motion, và tái dùng đúng pattern đã có trong dự án
thay vì đưa vào một cách tiếp cận hoàn toàn khác.

**Alternatives considered**: Thư viện parallax ngoài (ví dụ rellax.js) — bị
loại vì thêm dependency không cần thiết cho một hiệu ứng đơn giản (Nguyên
tắc I); `background-attachment: fixed` thuần CSS — bị loại vì kém tin cậy
trên mobile và có nguy cơ xung đột với scroll-snap hiện có.

## 4. Cấu hình ảnh nền Hero (data)

**Decision**: 1 file JSON mới `src/_data/heroBackground.json`, ví dụ:
```json
{
  "image": null,
  "filter": "tinted"
}
```
`image`: đường dẫn tương đối tới ảnh trong `src/assets/images/hero/`, hoặc
`null`/vắng mặt = dùng nền trừu tượng mặc định. `filter`: `"mono"` hoặc
`"tinted"`; nếu vắng mặt khi có `image`, mặc định `"tinted"` (đáp ứng Edge
case "không chỉ định filter" trong spec).

**Rationale**: Nhất quán với cách `albums.json`/`videos.json` đã lưu cấu
hình dạng file phẳng, dễ chỉnh sửa thủ công bởi chủ trang không rành kỹ
thuật; tách biệt khỏi `site.js` (vốn là giá trị tính toán build-time, không
phải cấu hình do người dùng chỉnh sửa) để rõ ràng về vai trò.

**Alternatives considered**: Nhúng cấu hình này vào `site.js` — bị loại vì
trộn lẫn 2 loại dữ liệu khác bản chất (giá trị tính toán vs cấu hình thủ
công), làm giảm rõ ràng cho người chỉnh sửa.

## 5. Carousel Video: dots thay prev/next (US4)

**Decision**: Trong `video-carousel.js`, mở rộng component Alpine
`videoCarousel` thêm:
- `activeIndex` (số nguyên, mặc định 0)
- `goToIndex(i)`: cuộn track đến item thứ `i` bằng `scrollTo`/`scrollIntoView`
- Theo dõi vị trí cuộn thực tế bằng sự kiện `scroll` trên chính track
  (throttle nhẹ), tính `activeIndex` = item có khoảng cách gần `scrollLeft`
  nhất, để đồng bộ ngược khi người dùng tự vuốt/cuộn (không chỉ khi bấm dot)
  — đáp ứng FR-012/SC-006.

Trong `video-section.njk`: xoá 2 `<button>` mũi tên prev/next; thêm một
hàng chấm (`<button>` nhỏ hình tròn mỗi video) bên dưới track, `:class`
đổi kích thước/độ đậm theo `activeIndex === index`; ẩn hoàn toàn hàng chấm
khi `videos.length <= 1` (FR-010).

**Rationale**: Giữ nguyên cơ chế cuộn ngang (vuốt/scroll) đã hoạt động tốt,
chỉ thay lớp điều khiển hiển thị (nút mũi tên → dots) và bổ sung đồng bộ hai
chiều — thay đổi tối thiểu, không viết lại toàn bộ carousel.

**Alternatives considered**: Carousel dạng "1 slide toàn khung hình mỗi lần"
kiểu slideshow phân trang — bị loại theo đúng quyết định đã ghi trong spec
Assumptions (giữ multi-card scroll, dots chỉ bổ sung, không thay đổi mô hình
tương tác).

## 6. Kiểm thử

**Decision**: Không thêm framework test mới. Mở rộng `scripts/validate-content.mjs`
thêm 1 nhánh kiểm tra nhẹ cho `heroBackground.json` (nếu tồn tại): `filter`
phải thuộc `{mono, tinted}` nếu có mặt; `image` nếu có phải là chuỗi không
rỗng. Xác thực hành vi trực quan (nền phân biệt, parallax, dots) qua
`quickstart.md`, lặp lại cách tiếp cận Playwright MCP đã dùng khi implement
`001` (mở dev server thật, thao tác, kiểm tra bằng snapshot/screenshot).

**Rationale**: Nhất quán với chiến lược kiểm thử đã chọn ở `001` (tránh hạ
tầng test không tương xứng quy mô dự án — Nguyên tắc I).
