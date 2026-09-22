# Phase 0 Research: Cân Chỉnh Bố Cục Section Video & Footer

Không còn mục `NEEDS CLARIFICATION` nào trong Technical Context. Tài liệu
này ghi lại phân tích cơ chế hiện tại (đọc trực tiếp mã nguồn, không suy
đoán) và quyết định kỹ thuật đã chọn.

## 1. Vì sao footer bị che ở section cuối — cơ chế thực tế

Đọc `src/_includes/layouts/base.njk`, `src/index.njk`,
`src/assets/scripts/section-scroll.js`:

- `<html class="lg:snap-y lg:snap-mandatory">`; mỗi `<section>` (Hero,
  Gallery, Video) có `lg:min-h-screen lg:snap-start`.
- `<footer>` được include TRỰC TIẾP sau `</main>` trong `base.njk` — là
  **sibling** của `<main>`, KHÔNG có `data-section`, KHÔNG phải một snap
  point, và không có `min-height` nào.
- Vì Video (section cuối) có `min-h-screen` (LUÔN chiếm ít nhất 100vh),
  khi trình duyệt snap tới đỉnh section này, viewport (100vh) đã bị lấp
  đầy hoàn toàn bởi section Video — `<footer>` (nằm ngay sau, cao ~70-100px)
  luôn nằm ngoài khung nhìn, bất kể chiều cao thật của nội dung Video.
- `section-scroll.js` chỉ biết đến các phần tử có `[data-section]` (3
  section) khi tính "section kế tiếp/trước" cho phím mũi tên và wheel —
  footer chưa từng nằm trong chuỗi điều hướng này, nên về mặt UX, nó là một
  "phần dư" ngoài tầm với của cơ chế cuộn-từng-màn-hình.

**Kết luận**: đây không phải lỗi ngẫu nhiên mà là hệ quả tất yếu của việc
`min-h-screen` (chiều cao TỐI THIỂU, không phải chính xác) kết hợp với
`footer` nằm ngoài `<main>`. Sửa đúng gốc rễ cần thay đổi 1 trong 2: (a)
chiều cao ép buộc của section Video, hoặc (b) vị trí của footer so với
section Video.

## 2. Phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm | Quyết định |
|---|---|---|---|
| **(A) Bỏ hẳn `min-h-screen` ở Video** (để section co theo nội dung, footer theo sau tự nhiên) | Đơn giản nhất, không cần đổi cấu trúc DOM | Không đảm bảo tổng chiều cao (Video + footer) luôn ≤ 100vh trong mọi trường hợp; phần viewport còn thừa dưới footer chỉ hiện màu nền `<body>` trần trụi, trông như "hụt" — không đạt SC-004 (cảm giác cân đối) | Loại |
| **(B) Ép `min-h-screen` trừ đi 1 giá trị cố định ước lượng chiều cao footer** (`calc(100vh - Xpx)`) | Không cần đổi DOM | Giá trị X cố định dễ sai lệch khi footer đổi nội dung/font-size/wrap dòng ở màn hình hẹp — giòn (fragile), vi phạm tinh thần "đơn giản, dễ bảo trì" | Loại |
| **(C) Đưa footer vào làm phần tử cuối bên trong `<section id="video">`, đổi `min-h-screen` → `h-screen` (chính xác 100vh) + flexbox** (`flex flex-col`: nội dung Video là `flex-1` tự căn giữa trong phần còn lại, footer là `flex-none` ở cuối) | Không cần biết trước chiều cao footer (flexbox tự tính); đảm bảo 100% footer luôn nằm trong cùng khung nhìn 100vh; đồng thời giải quyết luôn yêu cầu canh giữa (FR-004) vì nội dung Video giờ nằm trong 1 vùng `flex-1` có thể `justify-center` | Cần di chuyển vị trí include của `footer.njk` (từ `base.njk` sang bên trong `index.njk`/section Video) — thay đổi nhỏ về nơi "layout chrong dùng chung" được lắp ráp | **Chọn (C)** |

**Rationale chọn (C)**: đây là kỹ thuật flexbox tiêu chuẩn ("footer ghim
đáy trong 1 khối chiều cao cố định"), không cần số liệu chiều cao cứng nào,
tự động đúng bất kể nội dung Video hay footer dài/ngắn ra sao — mạnh mẽ hơn
hẳn phương án (B) và giải quyết trọn vẹn cả 2 yêu cầu (FR-001 và FR-004)
bằng cùng một thay đổi cấu trúc, thay vì 2 thay đổi rời rạc.

**Vì sao chấp nhận việc "footer chuyển vào trong section Video"**: Đây là
site tĩnh 1 trang duy nhất (`index.njk` là trang duy nhất dùng `base.njk`);
không có rủi ro "trang khác thiếu footer". Đổi lại, ta có được giải pháp
đơn giản, không giòn, đúng tinh thần Nguyên tắc I của hiến pháp.

## 3. Chi tiết kỹ thuật (Tailwind utility, không CSS tuỳ biến mới)

- `index.njk`: `<section id="video">` đổi class `lg:min-h-screen` thành
  `lg:flex lg:h-screen lg:flex-col`; giữ nguyên `bg-water-50 dark:bg-earth-900
  lg:snap-start`. Thêm `{% include "partials/footer.njk" %}` làm dòng cuối
  cùng bên trong section này (sau `{% include "partials/video-section.njk" %}`).
- `base.njk`: xoá dòng `{% include "partials/footer.njk" %}` sau `</main>`.
- `video-section.njk`: thêm `lg:flex-1 lg:flex lg:flex-col lg:justify-center`
  vào class của `<div>` gốc (giữ nguyên `mx-auto max-w-6xl px-4 py-16
  sm:px-6 lg:py-24` — có thể giảm nhẹ `lg:py-24` xuống một giá trị nhỏ hơn
  khi implement nếu cần thêm chỗ cho footer, xác định bằng xác thực trực
  quan chứ không đoán trước con số).
- `footer.njk`: thêm `lg:flex-none` (không co giãn, giữ chiều cao tự nhiên)
  vào `<footer>` để nó không bị flexbox kéo giãn chiếm phần không gian
  đáng lẽ dành cho nội dung Video.
- Trên mobile/tablet (dưới breakpoint `lg`), KHÔNG có class `flex`/`h-screen`
  nào kích hoạt (tất cả đều `lg:`-prefixed) → `<section id="video">` và
  `<footer>` bên trong nó vẫn xếp theo flow khối bình thường, cùng thứ tự
  hiển thị như hiện tại — không thay đổi hành vi (FR-003).

## 4. Rủi ro chiều cao cực thấp (Edge case đã ghi trong spec)

Với `lg:h-screen` + `flex-1` cho nội dung, nếu tổng chiều cao thực (tiêu đề
+ carousel + dots + footer) vượt quá 100vh ở một cửa sổ desktop rất thấp
(hiếm, nhưng có thể xảy ra khi thu nhỏ trình duyệt), nội dung `flex-1` sẽ bị
ép co lại theo kích thước tối thiểu của nó — nếu vẫn không đủ, thêm
`lg:overflow-y-auto` cho vùng nội dung Video (không phải cho toàn section)
làm phương án dự phòng, cho phép cuộn nội bộ nhẹ trong trường hợp cực hạn
thay vì vỡ layout hay đẩy footer ra ngoài — nhất quán với Edge Case đã ghi
trong `spec.md` ("có thể chấp nhận cuộn nhẹ trong trường hợp cực hạn").

## 5. Kiểm thử

Không thêm framework test. Xác thực bằng Playwright MCP (như `001`/`002`):
mở dev server thật, resize về 1440×900 và 1366×768 (ngưỡng tối thiểu theo
SC-002), snap tới section Video bằng phím/scroll, đọc
`footer.getBoundingClientRect()` để xác nhận nằm trong `[0, innerHeight]`;
resize về mobile (390×844) và xác nhận footer vẫn xuất hiện cuối trang qua
cuộn tự nhiên, không có gì đổi so với trước.
