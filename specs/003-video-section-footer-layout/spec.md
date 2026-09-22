# Feature Specification: Cân Chỉnh Bố Cục Section Video & Footer

**Feature Branch**: `003-video-section-footer-layout`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "điều chỉnh section video, canh giữa nội dung theo chiều dọc, (cần tăng tỉ lệ video thumbnail hiển thị để có kích thước chiều cao tốt hơn cho phần này không?); hỗ trợ hiện nội dung footer khi scroll tới section cuối (video) hoặc đề xuất ý tưởng thiết kế cho phần này - hiện tại khi xem section video (100vh) thì còn dư lại phần footer bị che đi (chiều cao quá thấp không đủ hiện 1 screen mới) -> tốn công scroll xuống 1 lần chỉ để xem 1 line footer"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Footer hiển thị cùng màn hình với section Video cuối cùng (Priority: P1)

Trên desktop, khi người dùng cuộn hoặc dùng phím/chuột để chuyển đến section cuối cùng (Video), họ thấy ngay nội dung footer (dòng bản quyền + liên kết "Lên đầu trang") trong cùng một màn hình đó — không phải cuộn thêm một lần nữa chỉ để nhìn thấy một dòng chữ nhỏ bị che khuất phía dưới.

**Why this priority**: Đây là vấn đề trải nghiệm rõ ràng nhất được phản ánh — người dùng tốn thao tác cuộn thêm cho một phần nội dung rất nhỏ, gây khó chịu và cảm giác trang "thiếu sót" ở màn hình cuối cùng.

**Independent Test**: Trên desktop, dùng phím mũi tên/cuộn chuột để đến section Video (section cuối); xác nhận nội dung footer hiển thị đầy đủ trong cùng màn hình, không bị che, không cần thao tác cuộn/chuyển section nào thêm.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở section Ảnh (Gallery) trên desktop, **When** họ chuyển tiếp đến section cuối cùng (Video), **Then** màn hình hiển thị đầy đủ nội dung Video VÀ nội dung footer, không có phần nào bị che khuất ngoài khung nhìn.
2. **Given** người dùng đã ở section Video (màn hình cuối), **When** họ không thực hiện thêm thao tác cuộn/chuyển section nào, **Then** dòng bản quyền và liên kết "Lên đầu trang" đã hiển thị sẵn, có thể đọc và nhấn được ngay.
3. **Given** người dùng đang xem trên mobile/tablet (nơi không áp dụng cơ chế mỗi section chiếm trọn màn hình), **When** họ cuộn tự nhiên xuống hết trang, **Then** footer vẫn xuất hiện như hành vi hiện tại — không có gì thay đổi ở nhóm thiết bị này.

---

### User Story 2 - Nội dung section Video canh giữa theo chiều dọc (Priority: P2)

Người dùng xem section Video trên các màn hình lớn thấy tiêu đề, carousel, và dãy chấm điều hướng được phân bố cân đối theo chiều dọc trong khung nhìn, thay vì dồn lên phía trên và để trống khoảng lớn phía dưới.

**Why this priority**: Cải thiện cảm quan thẩm mỹ, nhất quán với section Hero (đã canh giữa) — không phải vấn đề chức năng cấp thiết như footer bị che, nên ưu tiên sau.

**Independent Test**: Mở section Video trên desktop ở vài chiều cao màn hình phổ biến, xác nhận nội dung được căn giữa theo chiều dọc trong khung nhìn khả dụng (sau khi đã dành chỗ cho footer theo User Story 1), không dồn về phía trên.

**Acceptance Scenarios**:

1. **Given** section Video có ít nội dung (ví dụ chỉ 1-2 video), **When** người dùng xem trên desktop, **Then** khối nội dung (tiêu đề, carousel, dots) nằm cân đối theo chiều dọc trong phần khung nhìn dành cho section, không bị dồn sát lên trên.
2. **Given** số lượng video thay đổi (nhiều hơn/ít hơn), **When** người dùng xem section Video, **Then** việc canh giữa vẫn giữ ổn định, không gây giật/nhảy layout bất thường.

---

### Edge Cases

- Chiều cao màn hình desktop rất thấp (ví dụ cửa sổ trình duyệt thu nhỏ, laptop màn hình thấp): nội dung Video và footer MUST vẫn đọc được, có thể chấp nhận cuộn nhẹ trong trường hợp cực hạn này, miễn là không che khuất hoàn toàn hay chồng lấp nội dung lên nhau.
- Section Video không có video nào (danh sách rỗng): phần canh giữa vẫn áp dụng cho thông báo trạng thái rỗng ("Chưa có video nào") cùng footer, không vỡ layout.
- Không có thay đổi hành vi trên mobile/tablet — vấn đề "footer bị che" chỉ xảy ra với cơ chế cuộn từng-màn-hình-một trên desktop.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Trên desktop, khi người dùng cuộn/chuyển đến section cuối cùng (Video) bằng bất kỳ cách nào (phím mũi tên, cuộn chuột, hoặc cuộn thông thường), nội dung footer MUST hiển thị đầy đủ trong cùng một màn hình đó — không yêu cầu một thao tác cuộn/chuyển section bổ sung chỉ để thấy footer.
- **FR-002**: Việc hiển thị footer cùng màn hình với section Video (FR-001) MUST không che khuất hay cắt xén bất kỳ nội dung nào của section Video (tiêu đề, carousel, dãy chấm) trên các chiều cao màn hình desktop phổ biến.
- **FR-003**: Trên mobile/tablet, footer MUST tiếp tục hiển thị qua cuộn tự nhiên như hành vi hiện tại — không thay đổi gì ở nhóm thiết bị này.
- **FR-004**: Nội dung chính của section Video (tiêu đề, mô tả, carousel, dãy chấm) MUST được canh giữa theo chiều dọc trong phần khung nhìn dành cho section, nhất quán với cách section Hero đã canh giữa.
- **FR-005**: Tỉ lệ khung hình của thumbnail video trong carousel MUST giữ nguyên dạng tỉ lệ video tiêu chuẩn (16:9), không kéo giãn theo chiều cao — sự cân đối về chiều cao của section MUST đạt được thông qua canh giữa nội dung (FR-004), không phải qua việc biến dạng tỉ lệ thumbnail.
- **FR-006**: Thay đổi bố cục này MUST không làm thay đổi hành vi đã có của carousel (cuộn ngang, dots điều hướng) hay của cơ chế điều hướng phím/cuộn chuột giữa các section (Hero/Gallery/Video) đã hoạt động trước đó.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trên desktop, 100% người dùng đến section Video thấy được toàn bộ nội dung footer ngay lập tức, không cần thêm thao tác cuộn/nhấn phím nào.
- **SC-002**: Nội dung section Video hiển thị đầy đủ, không bị cắt xén, trên các độ phân giải desktop phổ biến (tối thiểu từ 1366×768 trở lên).
- **SC-003**: Không ghi nhận thay đổi hành vi nào trên mobile/tablet so với trước khi thực hiện thay đổi này.
- **SC-004**: Nội dung section Video được đánh giá là cân đối về thị giác (không dồn về một phía) khi quan sát trên các kích thước màn hình desktop phổ biến.

## Assumptions

- **Cách giải quyết vấn đề footer**: gộp hiển thị nội dung footer vào cùng màn hình với section Video (màn hình cuối cùng trong chuỗi cuộn-từng-màn-hình trên desktop), thay vì biến footer thành một "màn hình" snap riêng (sẽ tái tạo đúng vấn đề "tốn công cuộn cho rất ít nội dung" mà người dùng đang phàn nàn), hoặc bỏ chiều cao tối thiểu 100vh của riêng section Video (sẽ làm section này không nhất quán với Hero/Gallery về cách "mỗi mục là 1 màn hình"). Gộp footer vào màn hình cuối là cách trực tiếp nhất đáp ứng đúng yêu cầu "hiện nội dung footer khi scroll tới section cuối".
- **Tỉ lệ thumbnail video**: giữ nguyên 16:9 (không tăng tỉ lệ chiều cao) vì đây là tỉ lệ video tiêu chuẩn, quen thuộc với người xem; việc "thiếu cân đối chiều cao" mà người dùng nhận thấy được xử lý bằng cách canh giữa nội dung theo chiều dọc (FR-004) thay vì làm biến dạng thumbnail — phóng to tỉ lệ thumbnail có thể khiến ảnh trông không tự nhiên và không giải quyết triệt để vấn đề gốc (khoảng trống phân bố không đều).
- Thay đổi trong đặc tả này chỉ ảnh hưởng đến bố cục/CSS của section Video và footer trên desktop; không thay đổi cấu trúc dữ liệu (`videos.json`), nội dung văn bản, hay logic carousel/dots đã hoàn thiện ở `002-landing-page-visual-polish`.
- Cơ chế điều hướng phím/cuộn chuột giữa section (đã có từ `001`) tiếp tục áp dụng cho Hero và Gallery như cũ; chỉ hành vi ở "màn hình cuối cùng" (Video + footer) được điều chỉnh theo FR-001/FR-002.
