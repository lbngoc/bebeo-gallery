# Phase 1 Data Model: Cân Chỉnh Bố Cục Section Video & Footer

**Không áp dụng.** Feature này thuần tuý là thay đổi bố cục/CSS (cấu trúc
flexbox của section Video + vị trí `<footer>`) — không thêm, sửa, hay xoá
bất kỳ entity dữ liệu nào.

Không có thay đổi nào đối với các entity đã định nghĩa ở
`001-gallery-landing-page/data-model.md` (Album, Video nổi bật, Chủ đề) hay
`002-landing-page-visual-polish/data-model.md` (HeroBackgroundConfig, state
`activeIndex` của carousel). `videos.json` và cách `video-carousel.js` quản
lý `activeIndex`/dots (từ `002`) không bị ảnh hưởng bởi thay đổi layout này.
