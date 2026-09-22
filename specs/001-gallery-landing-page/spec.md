# Feature Specification: Trang Landing Page BeBeo Gallery

**Feature Branch**: `001-gallery-landing-page`

**Created**: 2026-09-21

**Status**: Draft

**Input**: User description: "xây dựng trang web dạng landing page đơn giản, sử dụng màu sắc chủ đạo phù hợp với mạng thủy và thổ, font chữ nhẹ nhàng phù hợp gia đình và sắc thái vui vẻ, gồm 3 phần chính: 1. hero: giới thiệu sơ bộ về mục đích của trang web - ngắn gọn, xúc tích không dài dòng; 2. gallery: show các album cá nhân dạng grid (hoặc mansonary) - mỗi card gồm background là ảnh thumbnail cho album, tiêu đề album, và mô tả (địa điểm - thời gian), hỗ trợ filter nhanh album theo chủ đề (vd. Đám cưới, Du lịch...) -> khi nhấn vào sẽ mở link gốc của album được lưu trên cloud (pCloud, Google Drive...); 3. video: các video nổi bật - hiển thị dạng carousel hoặc tương đương - sử dụng nguồn từ YouTube hoặc Google Drive, pCloud... khi nhấn vào thì ưu tiên phát trực tiếp trên website (modal) thay vì phải xem bằng URL gốc của cloud. Header: layout trái-phải (trái: logo chữ 'BeBeo Gallery' dạng viết tay; phải: nav Giới thiệu | Ảnh | Video tự scroll đến section + toggle sáng/tối). Footer: 1 dòng copyright + link 'Back To Top'. Desktop: mỗi section là 1 màn hình (100vh, min-height theo nội dung), điều hướng bằng phím lên/xuống hoặc scroll chuột."

## Clarifications

### Session 2026-09-21

- Q: Trang landing page này có cần giới hạn quyền xem (ví dụ mật khẩu/link riêng tư) hay công khai cho bất kỳ ai có đường dẫn? → A: Công khai hoàn toàn — bất kỳ ai có link đều xem được, không cần đăng nhập.
- Q: Bạn ước tính trang sẽ có khoảng bao nhiêu album ảnh và video nổi bật khi mới ra mắt (và về lâu dài)? → A: Vừa phải (khoảng 10-50 album, 5-15 video nổi bật) — cần lazy-load ảnh khi cuộn nhưng chưa cần phân trang.
- Q: Khi modal video đang mở, các phím mũi tên lên/xuống nên điều khiển gì? → A: Tạm ngắt điều hướng section bằng phím khi modal mở; phím mũi tên (nếu có) chỉ tác động trong modal hoặc không làm gì.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem giới thiệu và điều hướng trang (Priority: P1)

Người thân trong gia đình mở đường dẫn trang web trên điện thoại, máy tính bảng, hoặc desktop. Ngay khi trang tải xong, họ thấy phần Hero giới thiệu ngắn gọn mục đích của trang (nơi lưu giữ ảnh/video gia đình), thấy logo "BeBeo Gallery" và menu điều hướng ở header, có thể nhấn vào menu để nhảy nhanh đến phần Ảnh hoặc Video, và có thể chuyển đổi giao diện sáng/tối theo sở thích.

**Why this priority**: Đây là trải nghiệm đầu tiên và là nền tảng để người dùng hiểu trang web dùng để làm gì và di chuyển đến phần nội dung họ quan tâm. Không có phần này, các phần còn lại mất bối cảnh.

**Independent Test**: Mở trang, xác nhận Hero hiển thị nội dung giới thiệu ngắn gọn; nhấn từng mục nav (Giới thiệu/Ảnh/Video) và xác nhận trang cuộn đến đúng section; nhấn nút chuyển giao diện và xác nhận màu sắc toàn trang đổi ngay, vẫn giữ lựa chọn sau khi tải lại trang.

**Acceptance Scenarios**:

1. **Given** người dùng vừa mở trang lần đầu, **When** trang tải xong, **Then** section Hero hiển thị một đoạn giới thiệu ngắn gọn về mục đích trang web (không quá vài câu).
2. **Given** người dùng đang ở đầu trang, **When** họ nhấn mục "Ảnh" trên menu điều hướng, **Then** trang tự động cuộn mượt đến section Gallery.
3. **Given** người dùng đang xem trang ở giao diện sáng, **When** họ nhấn nút chuyển đổi giao diện, **Then** toàn bộ trang chuyển sang giao diện tối và lựa chọn này vẫn còn khi họ tải lại trang trên cùng thiết bị.

---

### User Story 2 - Duyệt và lọc album ảnh gia đình theo chủ đề (Priority: P1)

Người dùng muốn xem lại các album ảnh gia đình đã được chia sẻ. Họ cuộn hoặc nhấn nav đến section Gallery, thấy các album hiển thị dạng lưới/masonry với ảnh thumbnail, tiêu đề, địa điểm và thời gian. Họ có thể lọc nhanh theo chủ đề (ví dụ chỉ xem album "Du lịch"), rồi nhấn vào một album để mở album gốc đầy đủ trên dịch vụ cloud tương ứng.

**Why this priority**: Đây là giá trị cốt lõi của trang - giúp gia đình dễ dàng tìm và xem lại album ảnh đã lưu trên cloud mà không cần nhớ đường dẫn từng album.

**Independent Test**: Vào section Gallery, xác nhận danh sách album hiển thị đúng ảnh/tiêu đề/mô tả; chọn một chủ đề lọc và xác nhận chỉ album thuộc chủ đề đó hiển thị; nhấn vào một thẻ album và xác nhận đường dẫn cloud gốc được mở ra.

**Acceptance Scenarios**:

1. **Given** section Gallery đã tải xong, **When** người dùng nhìn vào danh sách, **Then** mỗi thẻ album hiển thị ảnh thumbnail làm nền, tiêu đề album, và mô tả gồm địa điểm - thời gian.
2. **Given** danh sách album đang hiển thị tất cả chủ đề, **When** người dùng chọn bộ lọc "Du lịch", **Then** chỉ các album được gắn chủ đề "Du lịch" còn hiển thị, các album khác được ẩn.
3. **Given** người dùng đang xem một album cụ thể trong danh sách, **When** họ nhấn vào thẻ album đó, **Then** đường dẫn gốc của album trên dịch vụ cloud (Google Drive/pCloud) được mở ra ở tab/cửa sổ mới.
4. **Given** người dùng đã chọn một bộ lọc chủ đề, **When** họ chọn lại tùy chọn "Tất cả", **Then** toàn bộ album hiển thị trở lại.

---

### User Story 3 - Xem và phát video nổi bật ngay trên trang (Priority: P2)

Người dùng cuộn hoặc nhấn nav đến section Video, thấy các video nổi bật của gia đình hiển thị dạng carousel. Khi họ nhấn vào một video, video được phát ngay trong một modal trên trang, không cần rời sang tab khác hay mở đường dẫn gốc trên cloud.

**Why this priority**: Xem video là giá trị bổ sung quan trọng nhưng phụ thuộc vào Hero/Header đã hoạt động trước; trải nghiệm phát trực tiếp trong trang giúp giữ người xem trên trang và thuận tiện hơn so với việc mở app/tab cloud riêng.

**Independent Test**: Vào section Video, xác nhận carousel hiển thị danh sách video nổi bật với ảnh đại diện; nhấn vào một video và xác nhận video phát ngay trong modal trên trang; đóng modal và xác nhận trở lại đúng vị trí trang.

**Acceptance Scenarios**:

1. **Given** section Video đã tải xong, **When** người dùng nhìn vào carousel, **Then** các video nổi bật hiển thị với ảnh đại diện và tiêu đề, có thể cuộn/điều hướng qua lại giữa các video.
2. **Given** người dùng đang xem carousel video, **When** họ nhấn vào một video, **Then** video đó phát trực tiếp trong một modal ngay trên trang mà không điều hướng người dùng sang URL gốc trên cloud.
3. **Given** modal video đang mở, **When** người dùng đóng modal, **Then** họ trở lại section Video ở đúng vị trí trước khi mở modal.

---

### User Story 4 - Điều hướng từng section bằng phím hoặc cuộn chuột trên desktop (Priority: P3)

Trên màn hình desktop, người dùng có thể dùng phím mũi tên lên/xuống hoặc cuộn chuột để di chuyển nhanh, tuần tự giữa 3 section chính (Hero, Gallery, Video), mỗi section chiếm ít nhất một màn hình.

**Why this priority**: Đây là một cải tiến trải nghiệm cho desktop, giúp điều hướng nhanh hơn, nhưng không phải điều kiện bắt buộc để xem được nội dung (nội dung vẫn xem được bằng cuộn thông thường).

**Independent Test**: Trên màn hình desktop, nhấn phím mũi tên xuống và xác nhận trang chuyển tuần tự sang section kế tiếp; cuộn chuột một lần và xác nhận trang di chuyển sang section liền kề (không cuộn tự do từng pixel).

**Acceptance Scenarios**:

1. **Given** người dùng đang ở section Hero trên desktop, **When** họ nhấn phím mũi tên xuống, **Then** trang chuyển sang section Gallery.
2. **Given** người dùng đang ở section Gallery trên desktop, **When** họ cuộn chuột lên một lần, **Then** trang chuyển về section Hero.
3. **Given** người dùng đang xem trang trên điện thoại/máy tính bảng, **When** họ cuộn trang bằng chạm, **Then** trang cuộn tự nhiên theo nội dung mà không bắt buộc phải "nhảy" đúng từng section như trên desktop.

---

### Edge Cases

- Album không có ảnh thumbnail hợp lệ: hệ thống hiển thị ảnh placeholder thay cho ô trống/vỡ layout.
- Đường dẫn cloud gốc của một album bị hỏng hoặc không còn quyền truy cập: người dùng vẫn thấy thông báo lỗi truy cập từ chính dịch vụ cloud sau khi mở tab mới, thay vì trang bị treo hoặc không phản hồi.
- Chưa có video nào được đánh dấu "nổi bật": section Video hiển thị thông báo nhẹ (ví dụ "Chưa có video nào") thay vì carousel trống hoặc lỗi.
- Video không thể nhúng/phát trực tiếp trong modal (do giới hạn quyền chia sẻ của nguồn): modal hiển thị thông báo dự phòng kèm liên kết mở trực tiếp video trên cloud.
- Bộ lọc chủ đề được chọn nhưng không có album nào khớp: hiển thị thông báo trạng thái rỗng thân thiện (ví dụ "Không có album nào thuộc chủ đề này").
- Người dùng bật thiết lập "giảm hiệu ứng chuyển động" (reduced motion) của hệ điều hành/trình duyệt: hiệu ứng cuộn mượt và snap-scroll giữa section MUST được giảm/tắt tương ứng.
- Người dùng nhấn phím mũi tên liên tiếp rất nhanh trên desktop: trang di chuyển tuần tự từng section một, không bỏ qua hoặc gây giật hình.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Trang MUST hiển thị một header với bố cục trái-phải: bên trái là tên "BeBeo Gallery" dùng kiểu chữ viết tay/trang trí đóng vai trò logo; bên phải là menu điều hướng gồm "Giới thiệu", "Ảnh", "Video" và một nút chuyển đổi giao diện sáng/tối.
- **FR-002**: Khi người dùng nhấn một mục trong menu điều hướng, trang MUST tự động cuộn mượt đến section tương ứng ("Giới thiệu" → Hero, "Ảnh" → Gallery, "Video" → Video).
- **FR-003**: Trang MUST cung cấp nút chuyển đổi giao diện sáng/tối; lựa chọn MUST được ghi nhớ trên trình duyệt của người dùng và áp dụng lại ở lần truy cập sau trên cùng thiết bị.
- **FR-004**: Section Hero MUST hiển thị một đoạn giới thiệu ngắn gọn, súc tích (tối đa vài câu) nêu rõ mục đích của trang web là nơi lưu giữ và chia sẻ ảnh/video cá nhân của gia đình.
- **FR-005**: Section Gallery MUST hiển thị danh sách album cá nhân dạng lưới (grid) hoặc masonry; mỗi thẻ album MUST hiển thị ảnh thumbnail làm nền, tiêu đề album, và mô tả ngắn gồm địa điểm và thời gian.
- **FR-006**: Section Gallery MUST cung cấp bộ lọc nhanh theo chủ đề (ví dụ: Đám cưới, Du lịch); khi chọn một chủ đề, chỉ các album thuộc chủ đề đó được hiển thị; MUST có tùy chọn "Tất cả" để xem lại toàn bộ album.
- **FR-007**: Khi người dùng nhấn vào một thẻ album, hệ thống MUST mở đường dẫn gốc của album đó trên dịch vụ lưu trữ cloud tương ứng (Google Drive, pCloud, ...) ở tab/cửa sổ mới, không thay thế trang hiện tại.
- **FR-008**: Section Video MUST hiển thị các video nổi bật dạng carousel (hoặc cơ chế điều hướng tương đương) hỗ trợ video có nguồn từ YouTube, Google Drive, hoặc pCloud.
- **FR-009**: Khi người dùng nhấn vào một video nổi bật, hệ thống MUST phát video đó trực tiếp trong một modal ngay trên trang, không điều hướng người dùng ra khỏi trang hoặc đến URL gốc trên cloud, trừ trường hợp fallback mô tả ở FR-015.
- **FR-010**: Footer MUST hiển thị một dòng thông báo bản quyền đơn giản kèm một liên kết "Back to Top" cho phép cuộn nhanh về đầu trang.
- **FR-011**: Trên màn hình desktop, mỗi section chính (Hero, Gallery, Video) MUST chiếm tối thiểu một màn hình (100vh) với min-height đủ hiển thị toàn bộ nội dung của section; người dùng MUST có thể dùng phím mũi tên lên/xuống hoặc cuộn chuột để di chuyển tuần tự giữa các section, ngoại trừ khi modal video đang mở (xem FR-018).
- **FR-012**: Trên thiết bị di động/máy tính bảng, trang MUST hiển thị đầy đủ nội dung và chức năng tương đương như trên desktop, sử dụng cách cuộn tự nhiên liên tục (không bắt buộc áp dụng cơ chế snap từng màn hình như trên desktop).
- **FR-013**: Toàn bộ giao diện MUST sử dụng bảng màu chủ đạo gợi liên tưởng đến hai yếu tố Thủy và Thổ (ngũ hành) kết hợp hài hòa, cùng kiểu chữ nhẹ nhàng, thân thiện, phù hợp không khí gia đình và sắc thái vui vẻ; bảng màu và font MUST áp dụng nhất quán ở cả giao diện sáng và tối.
- **FR-014**: Hệ thống MUST không lưu trữ file ảnh/video gốc trên trang; chỉ lưu trữ metadata (tiêu đề, mô tả, địa điểm, thời gian, chủ đề, đường dẫn cloud) và một ảnh thumbnail nhỏ đã tối ưu cho mỗi album/video.
- **FR-015**: Khi một album không có ảnh thumbnail hợp lệ hoặc một video không thể phát được trong modal, hệ thống MUST hiển thị trạng thái dự phòng thân thiện (ảnh placeholder, hoặc thông báo kèm liên kết mở trực tiếp trên cloud) thay vì lỗi trắng trang hay giao diện hỏng.
- **FR-016**: Hệ thống MUST tôn trọng thiết lập "giảm hiệu ứng chuyển động" của người dùng: khi thiết lập này được bật, hiệu ứng cuộn mượt và snap-scroll giữa section MUST được giảm hoặc tắt.
- **FR-017**: Section Gallery MUST tải ảnh thumbnail theo kiểu lazy-load (chỉ tải khi thẻ album sắp xuất hiện trong màn hình) để phù hợp với số lượng album vừa phải (khoảng 10-50 album); danh sách album MUST hiển thị đầy đủ trên cùng một trang, không cần phân trang.
- **FR-018**: Khi modal video đang mở, hệ thống MUST tạm ngắt cơ chế chuyển section bằng phím mũi tên lên/xuống (FR-011) trên desktop; phím mũi tên trong lúc này chỉ tác động trong phạm vi modal (nếu có) hoặc không gây hiệu ứng gì lên trang phía sau. Điều hướng section bằng phím MUST hoạt động trở lại ngay sau khi modal được đóng.

### Key Entities

- **Album**: Đại diện cho một album ảnh gia đình đã lưu trên dịch vụ cloud. Thuộc tính: tiêu đề, mô tả (địa điểm - thời gian), ảnh thumbnail, một hoặc nhiều chủ đề/tag (ví dụ Đám cưới, Du lịch), đường dẫn gốc trên cloud (Google Drive/pCloud/...).
- **Video nổi bật**: Đại diện cho một video được chọn để hiển thị trong carousel. Thuộc tính: tiêu đề, ảnh đại diện (poster), nguồn (YouTube/Google Drive/pCloud), đường dẫn/định danh dùng để phát trong modal, thứ tự hiển thị trong carousel.
- **Chủ đề (Category/Tag)**: Nhãn phân loại dùng để gắn cho album và làm tiêu chí cho bộ lọc nhanh trong Gallery (ví dụ: Đám cưới, Du lịch, Sinh nhật...).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng mới truy cập trang hiểu được mục đích trang web trong vòng 5 giây đầu tiên nhờ nội dung Hero.
- **SC-002**: Người dùng có thể lọc và mở một album theo một chủ đề cụ thể chỉ trong tối đa 2 lần nhấn/chạm.
- **SC-003**: 100% thẻ album hiển thị đúng ảnh thumbnail, tiêu đề, và mô tả địa điểm - thời gian ngay khi section Gallery tải xong.
- **SC-004**: Người dùng có thể xem và phát ít nhất một video nổi bật ngay trên trang mà không cần rời trang hoặc mở tab/app khác.
- **SC-005**: Trang hiển thị đầy đủ nội dung, không vỡ layout hay mất thông tin khi xem trên các kích thước màn hình phổ biến của điện thoại, máy tính bảng, và desktop.
- **SC-006**: Trên desktop, người dùng có thể di chuyển qua lại giữa 3 section chính chỉ bằng phím mũi tên hoặc một lần cuộn chuột cho mỗi section, không cần cuộn thủ công nhiều lần.
- **SC-007**: Người dùng có thể chuyển đổi giữa giao diện sáng và tối chỉ trong 1 lần nhấn, và lựa chọn này vẫn được giữ khi họ quay lại trang sau đó trên cùng thiết bị.

## Assumptions

- Trang landing page này công khai truy cập được qua đường dẫn, không yêu cầu đăng nhập hay mật khẩu (đã xác nhận ở mục Clarifications); nếu sau này gia đình muốn giới hạn người xem, đó sẽ là một hạng mục riêng, chưa nằm trong phạm vi spec này.
- Nội dung album/video (metadata, thumbnail, đường dẫn cloud, chủ đề) do chủ trang tự thêm/cập nhật thủ công thông qua file metadata; spec này không bao gồm giao diện quản trị (CMS) để thêm/sửa nội dung.
- Bộ lọc chủ đề trong Gallery cho phép chọn một chủ đề tại một thời điểm (kèm tùy chọn "Tất cả"); danh sách chủ đề hiển thị được suy ra từ các tag đã gắn cho album hiện có.
- "Video nổi bật" là một tập video do chủ trang chọn/đánh dấu thủ công để hiển thị trong carousel, không phải toàn bộ video gia đình có trên cloud.
- Quy mô nội dung dự kiến ở mức vừa phải: khoảng 10-50 album ảnh và 5-15 video nổi bật; carousel video hiển thị toàn bộ danh sách mà không cần phân trang.
- Mỗi nguồn video (YouTube/Google Drive/pCloud) được giả định cung cấp một đường dẫn có thể nhúng/phát trực tiếp trong modal khi chủ trang thêm video vào hệ thống; trường hợp một nguồn cụ thể không hỗ trợ nhúng thì áp dụng phương án dự phòng ở FR-015.
- Bảng màu "Thủy và Thổ" được diễn giải là tông xanh lam/xanh ngọc điềm tĩnh (Thủy) kết hợp với tông đất ấm như beige/nâu đất/vàng đất (Thổ), tạo cảm giác nhẹ nhàng, ấm áp, vui vẻ, phù hợp không khí gia đình; đây là định hướng thẩm mỹ, sắc độ cụ thể sẽ được chốt ở giai đoạn thiết kế/lên kế hoạch.
- Trạng thái giao diện sáng/tối được lưu trên trình duyệt của từng người dùng (ví dụ local storage), không cần đồng bộ giữa nhiều thiết bị hoặc tài khoản.
