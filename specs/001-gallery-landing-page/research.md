# Phase 0 Research: Trang Landing Page BeBeo Gallery

Không có mục `NEEDS CLARIFICATION` nào còn lại trong Technical Context của
plan.md — spec đã được làm rõ đầy đủ ở `/speckit-clarify`. Tài liệu này ghi
lại các quyết định kỹ thuật cần chốt trước khi thiết kế (Phase 1), cùng lý do
và phương án đã cân nhắc.

## 1. Tích hợp Eleventy + Vite

**Decision**: Dùng plugin chính thức `@11ty/eleventy-plugin-vite` (hiện tại
v7, do team 11ty duy trì, phát hành gần đây). Plugin chạy Vite làm middleware
cho Eleventy Dev Server (hỗ trợ `--incremental`) và chạy Vite build để
post-process output của Eleventy.

**Rationale**: Đây là giải pháp chính thức, được duy trì tích cực, tránh phải
tự nối 2 công cụ build (Eleventy sinh HTML, Vite build asset) bằng tay qua
passthrough copy + đọc manifest thủ công.

**Alternatives considered**:
- Tự nối thủ công (Eleventy build HTML → Vite build asset riêng → 11ty đọc
  Vite manifest để chèn link asset): nhiều quyền kiểm soát hơn nhưng tăng chi
  phí bảo trì, đi ngược Nguyên tắc I (đơn giản, tránh hạ tầng build không
  tương xứng quy mô dự án).
- Plugin cộng đồng `vite-plugin-eleventy` (Snugug): không phải chính thức,
  mức độ bảo trì/tài liệu kém ổn định hơn plugin của 11ty.

## 2. Styling: Tailwind CSS

**Decision**: Tailwind CSS v4.x (bản ổn định hiện tại, ví dụ 4.3.x) qua plugin
Vite chính thức `@tailwindcss/vite`, cấu hình CSS-first (`@import
"tailwindcss";` trong `src/assets/styles/main.css`), breakpoint mobile-first
theo đúng Nguyên tắc II.

**Rationale**: v4 là bản hiện hành, có Vite plugin chính thức, đơn giản hơn
pipeline PostCSS cũ của v3; phù hợp yêu cầu "không dùng công cụ build phức
tạp không cần thiết".

**Alternatives considered**: Tailwind v3 + `postcss.config.js` — vẫn khả thi
nhưng là cấu hình cũ hơn, không có lợi ích rõ ràng cho dự án mới.

## 3. Tương tác client: Alpine.js

**Decision**: Alpine.js v3, import dưới dạng ES module và để Vite bundle
cùng `main.js` (không dùng thẻ `<script src="cdn...">`), dùng cho: theme
toggle, filter album theo chủ đề, mở/đóng modal video, và điều hướng
section-snap trên desktop.

**Rationale**: Đúng stack quy định (Nguyên tắc IV); bundling qua Vite giữ
version cố định, tận dụng tree-shaking/minify, và hoạt động nhất quán giữa
dev server và production build.

**Alternatives considered**: Nhúng qua CDN — đơn giản hơn để bắt đầu nhưng
mất kiểm soát version và tách rời khỏi pipeline build Vite.

## 4. Lưu trữ metadata album/video

**Decision**: Hai file dữ liệu toàn cục cho Eleventy:
`src/_data/albums.json` và `src/_data/videos.json`. Danh sách chủ đề
(category) KHÔNG lưu file riêng mà được tính toán tại build time từ tập hợp
duy nhất các tag trong `albums.json` (qua Eleventy computed data
`categories.11tydata.js`), tránh trùng lặp nguồn dữ liệu.

**Rationale**: Phù hợp Nguyên tắc I (flat file, không DB); dữ liệu mỗi
album/video ngắn gọn, không có nội dung dài dạng văn bản nên JSON phù hợp
hơn Markdown front matter (vốn hợp lý hơn khi có phần "nội dung" tự do).
Một file JSON cho mỗi loại (thay vì 1 file/album) phù hợp quy mô đã chốt ở
Clarifications (~10-50 album, 5-15 video) — đủ nhỏ để một file duy nhất vẫn
dễ đọc/sửa thủ công.

**Alternatives considered**:
- Markdown + front matter mỗi album: phù hợp khi có nội dung mô tả dài, ở
  đây không cần, nên chỉ gây thêm số lượng file.
- Chia nhỏ `albums/*.json` mỗi album một file: cân nhắc lại nếu số lượng
  album vượt xa ước tính hiện tại (>50); ở quy mô hiện tại, một file duy
  nhất dễ quản lý hơn.

## 5. Xử lý & tối ưu thumbnail

**Decision**: Ảnh thumbnail gốc (đã resize nhỏ thủ công trước khi commit theo
Nguyên tắc III/Quy trình quản lý nội dung) đặt tại
`src/assets/images/thumbnails/{albums,videos}/`, được xử lý qua
`@11ty/eleventy-img` tại build time để sinh WebP + kích thước responsive
(`srcset`) dùng làm background/poster cho thẻ album và video.

**Rationale**: `eleventy-img` là plugin chuẩn của hệ sinh thái 11ty cho tối
ưu ảnh build-time, không cần dịch vụ ảnh bên ngoài (nhất quán Nguyên tắc I —
tránh hạ tầng không cần thiết).

**Alternatives considered**: Dùng CDN ảnh bên thứ 3 (Cloudinary, imgix...) —
thêm một dependency vận hành bên ngoài không cần thiết cho một trang gia
đình quy mô nhỏ.

## 6. Phát video đa nguồn trong modal (FR-008, FR-009)

**Decision**: Dùng `<iframe>` cho cả 3 nguồn, chọn `src` theo `sourceType`
của entry video:
- YouTube: `https://www.youtube-nocookie.com/embed/{videoId}`
- Google Drive: `https://drive.google.com/file/d/{fileId}/preview`
- pCloud: link nhúng/preview công khai do pCloud cung cấp cho file đã chia
  sẻ (pCloud hỗ trợ lấy link dạng embed cho public link); nếu một link cụ
  thể không hỗ trợ nhúng, áp dụng fallback theo FR-015 (hiển thị thông báo +
  link mở trực tiếp trên cloud).

**Rationale**: Cả 3 nguồn đều có URL dạng nhúng qua iframe công khai — không
cần SDK JS riêng cho từng nền tảng, giữ component modal đơn giản
(1 component nhận `sourceType` + `embedRef`, chọn template URL tương ứng).

**Alternatives considered**: Dùng YouTube IFrame Player API / Google Drive
API để có control lập trình (play/pause qua JS, sự kiện...) — vượt quá nhu
cầu hiện tại (chỉ cần phát trực tiếp trong modal, không cần điều khiển từ
xa), tăng độ phức tạp không cần thiết.

## 7. Điều hướng section-snap trên desktop + tương tác phím/chuột (FR-011, FR-012, FR-016, FR-018)

**Decision**: Kết hợp 2 lớp:
- CSS `scroll-snap-type: y mandatory` (áp dụng qua Tailwind class có điều
  kiện, chỉ bật ở breakpoint desktop trở lên) làm nền tảng snap khi cuộn
  chuột/trackpad.
- Một lớp JS mỏng (Alpine component `section-scroll.js`) lắng nghe
  `keydown` (ArrowUp/ArrowDown) ở mức `window` để gọi
  `scrollIntoView({behavior})` đến section kế tiếp/trước đó, và đọc một
  Alpine store dùng chung (`isVideoModalOpen`) để: (a) không xử lý phím mũi
  tên khi modal đang mở (FR-018), và (b) đặt `behavior: 'auto'` thay vì
  `'smooth'` khi `prefers-reduced-motion: reduce` được bật (FR-016). Ở
  breakpoint mobile/tablet, lớp JS này không kích hoạt — trang dùng cuộn tự
  nhiên của trình duyệt (FR-012).

**Rationale**: CSS `scroll-snap` xử lý tốt hành vi cuộn chuột cơ bản mà
không cần JS; nhưng bản thân CSS snap không hỗ trợ điều hướng bằng phím mũi
tên hay việc tạm ngắt khi modal mở, nên cần thêm một lớp JS mỏng để đáp ứng
đúng FR-011/016/018 mà không phải tự viết lại toàn bộ cơ chế cuộn bằng JS.

**Alternatives considered**: Thư viện snap-scroll chuyên dụng (ví dụ
fullPage.js) — thêm một dependency ngoài stack quy định (Nguyên tắc IV) và
nặng hơn mức cần thiết cho 3 section; JS thuần xử lý toàn bộ cuộn (không
dùng CSS snap) — khả thi nhưng phức tạp hơn, dễ lệch pixel so với cách kết
hợp CSS snap + JS chỉ cho phần phím/điều kiện.

## 8. Ghi nhớ theme sáng/tối (FR-003)

**Decision**: Alpine store đọc/ghi `localStorage` (key ví dụ `bebeo-theme`),
áp dụng bằng cách toggle class `dark` trên `<html>` (dùng với Tailwind
`dark:` variant). Giá trị ban đầu được set qua một `<script>` inline nhỏ đặt
ngay đầu `<head>` (trước khi CSS/Alpine load) để tránh hiệu ứng "nhấp nháy"
sai theme khi tải trang.

**Rationale**: Đây là pattern chuẩn, phổ biến cho site tĩnh dùng Tailwind
`dark` mode qua class, không cần backend hay cookie.

**Alternatives considered**: Chỉ dựa vào `prefers-color-scheme` của hệ điều
hành, không cho người dùng override — bị loại vì FR-003 yêu cầu rõ một nút
chuyển đổi thủ công.

## 9. Chiến lược kiểm thử (Testing strategy)

**Decision**:
- **Build-time content validation**: script Node `scripts/validate-content.mjs`
  chạy trong `npm run build`, validate `albums.json`/`videos.json` theo
  schema tối thiểu ở `contracts/content-schema.json` (trường bắt buộc, URL
  không rỗng, `sourceType` hợp lệ...) — fail build sớm nếu dữ liệu sai định
  dạng thay vì xuất bản thẻ album/video hỏng.
- **Manual quickstart validation**: checklist các kịch bản chấp nhận (từ
  User Story 1-4 trong spec.md) thực hiện thủ công trên trình duyệt thật
  (xem `quickstart.md`) cho các hành vi tương tác/hiển thị khó kiểm thử tự
  động có giá trị tương xứng ở quy mô này (filter, modal đa nguồn, section-
  snap phím/chuột, theme toggle, responsive).

**Rationale**: Nhất quán với Nguyên tắc I (tránh hạ tầng vận hành không cân
xứng) — một bộ e2e test framework đầy đủ (Playwright/Cypress) là chi phí bảo
trì không tương xứng với một trang tĩnh, ít thay đổi, dùng nội bộ cho một
gia đình.

**Alternatives considered**: Bộ e2e test tự động đầy đủ bằng Playwright —
cân nhắc lại trong tương lai nếu dự án mở rộng quy mô/tần suất thay đổi;
không đưa vào v1 vì vượt quá nhu cầu hiện tại.
