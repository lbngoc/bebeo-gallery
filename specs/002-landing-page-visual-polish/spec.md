# Feature Specification: Hoàn Thiện Ngôn Ngữ & Hiệu Ứng Thị Giác Trang Chủ

**Feature Branch**: `002-landing-page-visual-polish`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "sử dụng tiếng việt cho toàn bộ website, đề xuất giữ tiếng anh nếu không tìm được từ thay thế bằng tiếng việt phù hợp và tự nhiên; carousel video ở desktop có thể xóa phần button prev/next và thay thế bằng slide dots bên dưới; thêm hiệu ứng background và parralax cho phần hero trang chủ; sử dụng background để phân rõ các mục trên trang chủ thay vì 1 màu nền chung như hiện tại"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trải nghiệm trang hoàn toàn bằng tiếng Việt (Priority: P1)

Người dùng (thành viên gia đình) truy cập trang và đọc mọi nội dung — tiêu đề, nút bấm, thông báo trạng thái, nhãn điều hướng — bằng tiếng Việt tự nhiên, không gặp từ tiếng Anh sót lại một cách ngẫu nhiên (như hiện tại liên kết footer đang hiển thị "Back to Top").

**Why this priority**: Đây là yêu cầu bao trùm toàn bộ trang, ảnh hưởng trực tiếp đến cảm nhận "trang dành cho gia đình Việt" và tính nhất quán ngôn ngữ; mức độ rủi ro/khối lượng thay đổi thấp nên có thể hoàn thành độc lập trước.

**Independent Test**: Duyệt qua toàn bộ trang (header, hero, gallery, video, footer, các trạng thái rỗng/lỗi) và xác nhận không còn cụm từ tiếng Anh nào ngoài danh sách từ mượn đã được ghi nhận có chủ đích.

**Acceptance Scenarios**:

1. **Given** người dùng xem footer, **When** trang hiển thị liên kết cuộn về đầu trang, **Then** nhãn liên kết đó hiển thị bằng tiếng Việt tự nhiên (không còn "Back to Top").
2. **Given** người dùng duyệt qua mọi section của trang, **When** đọc bất kỳ đoạn văn bản, nút bấm, hay thông báo trạng thái nào, **Then** toàn bộ đều là tiếng Việt, trừ các từ mượn tiếng Anh phổ biến đã được liệt kê rõ là giữ nguyên có chủ đích.
3. **Given** một từ tiếng Anh được giữ nguyên trên trang (ví dụ từ mượn phổ biến), **When** đối chiếu với tài liệu đặc tả, **Then** từ đó được ghi nhận rõ ràng trong mục Assumptions kèm lý do, không phải một sơ suất.

---

### User Story 2 - Mỗi mục trên trang chủ có nền phân biệt rõ ràng (Priority: P2)

Người dùng cuộn qua trang chủ và có thể nhận ra ngay mình đang chuyển từ mục này sang mục khác (Giới thiệu → Ảnh → Video) nhờ sự thay đổi màu/tông nền, thay vì toàn bộ trang dùng chung một màu nền phẳng như hiện tại.

**Why this priority**: Cải thiện rõ rệt khả năng định hướng thị giác khi cuộn trang, đặc biệt hữu ích với hiệu ứng cuộn từng màn hình trên desktop đã có sẵn; độ phức tạp vừa phải, không phụ thuộc User Story 3.

**Independent Test**: Cuộn qua từng section trên cả desktop và mobile, xác nhận mỗi section có nền khác biệt rõ với section liền kề, ở cả giao diện sáng và tối.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở section Giới thiệu (Hero), **When** họ cuộn xuống section Ảnh (Gallery), **Then** màu/tông nền thay đổi rõ rệt, không còn là một màu nền phẳng liên tục.
2. **Given** người dùng đang ở section Ảnh, **When** họ cuộn tiếp xuống section Video, **Then** nền của section Video khác biệt rõ với section Ảnh.
3. **Given** người dùng chuyển đổi giữa giao diện sáng và tối, **When** họ xem lại từng section, **Then** sự phân biệt nền giữa các section vẫn được giữ nhất quán ở cả hai giao diện.

---

### User Story 3 - Hiệu ứng nền và parallax ấn tượng cho Hero (Priority: P2)

Khi người dùng vừa vào trang hoặc cuộn qua section Hero, họ thấy một lớp nền trang trí tạo điểm nhấn thị giác, và khi cuộn, lớp nền đó di chuyển tạo cảm giác chiều sâu (hiệu ứng parallax) thay vì đứng yên một cách tĩnh như hiện tại.

**Why this priority**: Đây là điểm nhấn ấn tượng đầu tiên người dùng thấy khi vào trang, nâng cao cảm nhận "chào đón" của trang; độc lập về mặt kỹ thuật với các section khác nên có thể triển khai song song với User Story 2.

**Independent Test**: Mở trang trên desktop, quan sát Hero có lớp nền trang trí; cuộn qua Hero và xác nhận lớp nền di chuyển khác tốc độ với nội dung chữ/nút bấm ở tiền cảnh; bật "giảm hiệu ứng chuyển động" và xác nhận hiệu ứng di chuyển được tắt.

**Acceptance Scenarios**:

1. **Given** chủ trang chưa cấu hình ảnh nền riêng cho Hero, **When** người dùng vừa tải xong trang, **Then** Hero hiển thị hình nền trừu tượng mặc định theo tông Thủy-Thổ, rõ ràng hơn nền phẳng đơn sắc trước đây.
2. **Given** chủ trang đã cấu hình một ảnh nền thật cho Hero, **When** người dùng xem section Hero, **Then** ảnh đó hiển thị đã qua bộ lọc màu (mono trắng/đen hoặc phủ tông Thủy/Thổ), không hiển thị màu ảnh gốc chưa xử lý.
3. **Given** người dùng đang ở đầu trang, **When** họ cuộn qua section Hero, **Then** lớp nền (ảnh thật đã lọc màu hoặc hình trừu tượng mặc định) di chuyển với tốc độ khác so với nội dung tiền cảnh (tiêu đề, đoạn giới thiệu, nút bấm).
4. **Given** người dùng đã bật thiết lập "giảm hiệu ứng chuyển động" của hệ điều hành/trình duyệt, **When** họ cuộn qua Hero, **Then** lớp nền vẫn hiển thị nhưng không di chuyển khác tốc độ (hiệu ứng parallax tắt).

---

### User Story 4 - Điều hướng carousel video bằng chấm thay vì nút mũi tên trên desktop (Priority: P3)

Trên desktop, người dùng xem carousel Video và điều hướng giữa các video bằng cách nhấn vào các chấm bên dưới carousel thay vì các nút mũi tên trước/tiếp hai bên.

**Why this priority**: Là một tinh chỉnh giao diện nhỏ, không ảnh hưởng đến khả năng xem/phát video (giá trị cốt lõi đã có từ trước); phù hợp thực hiện sau cùng.

**Independent Test**: Trên desktop, xác nhận không còn nút mũi tên trước/tiếp cạnh carousel; xác nhận có dãy chấm bên dưới carousel, số chấm khớp số video, và nhấn vào một chấm bất kỳ sẽ chuyển carousel đến đúng video đó với chấm tương ứng được đánh dấu nổi bật.

**Acceptance Scenarios**:

1. **Given** người dùng xem section Video trên desktop, **When** họ nhìn vào carousel, **Then** không còn nút mũi tên trước/tiếp, thay vào đó có một dãy chấm điều hướng bên dưới.
2. **Given** dãy chấm điều hướng đang hiển thị, **When** người dùng nhấn vào một chấm cụ thể, **Then** carousel chuyển đến video tương ứng với chấm đó.
3. **Given** carousel đang hiển thị video thứ hai trong danh sách, **When** người dùng nhìn vào dãy chấm, **Then** chấm tương ứng với video thứ hai được đánh dấu khác biệt (nổi bật hơn) so với các chấm còn lại.

---

### Edge Cases

- Section Video chỉ có 0 hoặc 1 video: dãy chấm điều hướng không hiển thị (không có ý nghĩa phân trang khi không có lựa chọn để chuyển).
- Số lượng video khá nhiều (ví dụ gần 15 video theo quy mô đã chốt ở spec trước): dãy chấm MUST không tràn ra ngoài màn hình hoặc phá vỡ layout trên các độ rộng desktop phổ biến.
- Người dùng bật "giảm hiệu ứng chuyển động": hiệu ứng parallax của Hero tắt, nhưng lớp nền trang trí vẫn hiển thị tĩnh (không biến mất hoàn toàn).
- Màn hình Hero rất thấp (ví dụ điện thoại xoay ngang): lớp nền trang trí và hiệu ứng parallax không được gây tràn nội dung hoặc che khuất tiêu đề/nút bấm.
- Chủ trang cấu hình ảnh nền Hero nhưng không chỉ định kiểu bộ lọc màu: hệ thống MUST áp dụng một kiểu bộ lọc mặc định hợp lý (không hiển thị ảnh gốc chưa lọc màu).
- Ảnh nền Hero do chủ trang cấu hình bị thiếu/không tải được: hệ thống MUST tự động dùng lại hình nền trừu tượng mặc định thay vì để trống hoặc lỗi hiển thị (tương tự FR-006c).
- Một từ tiếng Anh phổ biến (ví dụ "Video") được giữ nguyên: đây là quyết định có chủ đích, không tính là vi phạm yêu cầu tiếng Việt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Toàn bộ văn bản hiển thị cho người dùng trên trang (tiêu đề, đoạn mô tả, nhãn nút bấm, thông báo trạng thái/rỗng/lỗi, nhãn trợ năng như `aria-label`) MUST sử dụng tiếng Việt tự nhiên.
- **FR-002**: Một từ/cụm tiếng Anh CHỈ được giữ nguyên khi đó là từ mượn phổ biến, được người Việt dùng tự nhiên trong ngữ cảnh tương tự, và không có từ tiếng Việt thay thế nghe tự nhiên hơn; mọi trường hợp giữ nguyên MUST được liệt kê rõ ràng kèm lý do.
- **FR-003**: Liên kết cuộn về đầu trang ở footer MUST đổi nhãn hiển thị sang tiếng Việt tự nhiên (thay thế "Back to Top" hiện tại).
- **FR-004**: Mỗi section chính trên trang chủ (Giới thiệu, Ảnh, Video) MUST có nền (màu hoặc dải màu) phân biệt rõ ràng với section liền kề, thay vì dùng chung một màu nền phẳng như hiện tại.
- **FR-005**: Sự phân biệt nền giữa các section MUST áp dụng nhất quán ở cả giao diện sáng và giao diện tối, và MUST sử dụng bảng màu chủ đạo Thủy/Thổ đã định nghĩa (không giới thiệu bảng màu mới ngoài phạm vi đã có).
- **FR-006**: Section Giới thiệu (Hero) MUST có thêm một lớp nền trang trí (background effect) tạo điểm nhấn thị giác, phân biệt với nền phẳng đơn sắc trước đây. Mặc định (khi chủ trang chưa cấu hình ảnh nền riêng), lớp nền này MUST là hình ảnh trừu tượng (khối/dải màu, hoạ tiết mềm theo tông Thủy-Thổ).
- **FR-006a**: Hệ thống MUST cho phép chủ trang cấu hình (tuỳ chọn) một ảnh nền thật cho Hero; khi có cấu hình này, ảnh thật MUST được dùng thay cho hình nền trừu tượng mặc định.
- **FR-006b**: Khi Hero dùng ảnh nền thật, ảnh đó MUST được phủ một lớp bộ lọc màu để nhất quán với tổng thể trang — hoặc chuyển sang tông đơn sắc trắng/đen (mono), hoặc phủ tông màu theo bảng Thủy/Thổ đã định nghĩa — không hiển thị ảnh với màu gốc chưa qua xử lý; kiểu bộ lọc cụ thể (mono hay tinted) là tuỳ chọn cấu hình được của chủ trang.
- **FR-006c**: Nếu chủ trang KHÔNG cấu hình ảnh nền cho Hero, hệ thống MUST tự động hiển thị hình nền trừu tượng mặc định (FR-006); không được để trống hoặc gây lỗi hiển thị.
- **FR-007**: Khi người dùng cuộn qua section Hero, lớp nền (dù là ảnh thật đã lọc màu hay hình trừu tượng mặc định) MUST di chuyển với tốc độ khác với nội dung tiền cảnh (hiệu ứng parallax), tạo cảm giác chiều sâu.
- **FR-008**: Khi người dùng bật thiết lập "giảm hiệu ứng chuyển động" (`prefers-reduced-motion`), hiệu ứng parallax ở Hero MUST tắt (nền không còn di chuyển khác tốc độ so với nội dung), nhưng lớp nền (ảnh thật đã lọc màu hoặc hình trừu tượng) MUST vẫn hiển thị ở trạng thái tĩnh.
- **FR-009**: Trên desktop, carousel Video MUST không còn hiển thị nút điều hướng dạng mũi tên trước/tiếp.
- **FR-010**: Carousel Video MUST hiển thị một dãy chấm điều hướng bên dưới, số lượng chấm khớp với số lượng video hiện có; dãy chấm KHÔNG hiển thị khi có 0 hoặc 1 video.
- **FR-011**: Người dùng MUST có thể nhấn vào một chấm bất kỳ để carousel chuyển đến đúng video tương ứng với chấm đó.
- **FR-012**: Chấm tương ứng với video đang hiển thị ở vị trí đầu khung nhìn MUST được đánh dấu trực quan khác biệt (nổi bật hơn) so với các chấm còn lại, và MUST cập nhật khi người dùng cuộn/vuốt carousel bằng thao tác khác (không chỉ khi nhấn chấm).
- **FR-013**: Dãy chấm điều hướng MUST hiển thị và sử dụng được trên cả desktop và mobile/tablet, nhất quán với việc loại bỏ nút mũi tên trên desktop.

### Key Entities

- **Cấu hình nền Hero (Hero Background Config)**: Thiết lập tuỳ chọn (không bắt buộc) do chủ trang cung cấp, gồm: đường dẫn ảnh nền thật (nếu có), kiểu bộ lọc màu áp dụng (mono trắng/đen, hoặc tinted theo tông Thủy/Thổ). Khi không có cấu hình này, Hero dùng hình nền trừu tượng mặc định (FR-006c). Đây là ảnh trang trí cho giao diện, không phải "album/video nổi bật" của gia đình.
- Ngoài mục trên, không có thay đổi về entity dữ liệu (Album, Video nổi bật, Chủ đề) so với đặc tả trước.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% văn bản hiển thị trên trang là tiếng Việt, ngoại trừ các từ mượn tiếng Anh đã được liệt kê rõ ràng và có chủ đích trong tài liệu đặc tả.
- **SC-002**: Người dùng có thể phân biệt đang ở section nào trong 3 section chính chỉ bằng cách quan sát màu/tông nền, không cần đọc tiêu đề văn bản.
- **SC-003**: Khi cuộn qua Hero trên desktop, lớp nền (ảnh thật đã lọc màu hoặc hình trừu tượng mặc định) và nội dung tiền cảnh di chuyển với tốc độ khác nhau rõ rệt, tạo cảm giác chiều sâu quan sát được.
- **SC-003a**: Khi chủ trang cấu hình ảnh nền Hero, 100% người xem thấy ảnh đó ở dạng đã lọc màu (mono hoặc tinted theo tông Thủy/Thổ), không ai thấy màu ảnh gốc chưa xử lý.
- **SC-004**: Người dùng bật "giảm hiệu ứng chuyển động" không quan sát thấy hiệu ứng di chuyển khác tốc độ nào ở Hero.
- **SC-005**: Trên desktop, người dùng chuyển đến bất kỳ video nào trong carousel chỉ bằng 1 lần nhấn vào chấm điều hướng tương ứng, không cần thao tác cuộn ngang thủ công.
- **SC-006**: Dãy chấm điều hướng luôn phản ánh đúng vị trí video hiện tại, kể cả khi người dùng điều hướng bằng cách vuốt/cuộn carousel trực tiếp thay vì nhấn chấm.

## Assumptions

- "Video" và các thuật ngữ tương tự (nếu có) là từ mượn tiếng Anh phổ biến, được giữ nguyên có chủ đích vì không có từ tiếng Việt thay thế nghe tự nhiên hơn trong ngữ cảnh giao diện web hiện đại; "BeBeo Gallery" là tên thương hiệu riêng, không dịch.
- Việc loại bỏ nút prev/next và thay bằng dãy chấm áp dụng cho cả desktop lẫn mobile/tablet để nhất quán trải nghiệm điều hướng carousel trên mọi thiết bị (không chỉ giới hạn ở desktop như câu chữ ban đầu gợi ý), vì bản thân nút prev/next trước đó vốn đã ẩn trên mobile.
- Carousel Video vẫn giữ nguyên cơ chế cuộn ngang xem nhiều video cùng lúc (vuốt/cuộn) như hiện tại; dãy chấm điều hướng là lớp bổ sung (hiển thị vị trí + cho phép nhảy nhanh đến 1 video), KHÔNG chuyển carousel thành dạng "mỗi lần chỉ hiện đúng 1 video toàn màn hình" kiểu slideshow phân trang.
- Thay đổi ở đặc tả này chỉ ảnh hưởng đến ngôn ngữ hiển thị và giao diện thị giác (nền, hiệu ứng, điều hướng carousel); không thay đổi cấu trúc dữ liệu, luồng nghiệp vụ, hay các yêu cầu chức năng cốt lõi đã có ở đặc tả trước (`001-gallery-landing-page`).
- Sự phân biệt nền giữa các section (User Story 2) và lớp nền trang trí của Hero (User Story 3) đều dùng chung bảng màu Thủy/Thổ đã định nghĩa trước đó, không mở rộng thêm màu sắc mới ngoài phạm vi.
- Ảnh nền Hero (khi được cấu hình) là một ảnh trang trí giao diện do chủ trang tự chọn/tải lên qua file cấu hình, tối ưu nhỏ gọn tương tự thumbnail — không phải "album/video nổi bật" và không thuộc phạm vi Nguyên tắc III (không lưu media gốc của album) vì đây là tài nguyên thiết kế của trang, không phải nội dung media gia đình cần chia sẻ.
- Đặc tả này chỉ định nghĩa HÀNH VI mong muốn (có ảnh → lọc màu + parallax; không có ảnh → hình trừu tượng mặc định); định dạng file cấu hình cụ thể (tên trường, vị trí) sẽ được quyết định ở giai đoạn `/speckit-plan` cho nhất quán với cấu trúc dữ liệu đã có.
