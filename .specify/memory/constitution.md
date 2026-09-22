<!--
Sync Impact Report
==================
Version change: [unratified template] → 1.0.0 (initial ratification)
Modified principles: n/a (first concrete adoption; all placeholders replaced)
Added sections:
  - Core Principles I–V (Đơn Giản & Không Database Phức Tạp; Ưu Tiên Di Động;
    Không Lưu Trữ Media Gốc; Kiến Trúc Site Tĩnh với Stack Quy Định;
    Riêng Tư & Phạm Vi Gia Đình)
  - Ràng Buộc Công Nghệ & Kiến Trúc (Section 2)
  - Quy Trình Quản Lý Nội Dung (Section 3)
  - Governance
Removed sections: none (template placeholders replaced, not removed)
Deferred / TODO items:
  - TODO(ACCESS_CONTROL): exact access-control / sharing mechanism for the
    family-only site (e.g. static basic auth, unlisted link, invite list)
    is not yet decided — defer to /speckit-specify and /speckit-plan.
Templates requiring follow-up: none — dependent templates read this file at
  runtime and are not modified by this command.
-->

# Bebeo Gallery Constitution

## Core Principles

### I. Đơn Giản & Không Database Phức Tạp
Dự án PHẢI tránh mọi hệ quản trị cơ sở dữ liệu (RDBMS/NoSQL server) và mọi lớp
ORM. Metadata (thông tin mô tả cho từng ảnh/video) PHẢI được lưu dưới dạng file
phẳng (JSON, YAML, hoặc Markdown front matter) versioned cùng source code.
Không được thêm backend runtime, message queue, cache server, hay bất kỳ hạ
tầng vận hành nào vượt quá nhu cầu của một site tĩnh cho một gia đình.
**Rationale**: Đây là dự án cá nhân/gia đình, quy mô nhỏ, không cần khả năng
mở rộng hay vận hành phức tạp; mỗi thành phần hạ tầng thêm vào là chi phí bảo
trì không tương xứng với lợi ích.

### II. Ưu Tiên Di Động (Mobile-First)
Mọi giao diện PHẢI được thiết kế và kiểm thử mobile-first: bố cục, kích thước
chạm (tap target), và hiệu năng tải trang PHẢI được tối ưu cho điện thoại và
máy tính bảng trước khi tối ưu cho desktop. Breakpoint Tailwind PHẢI đi từ nhỏ
đến lớn (mobile → tablet → desktop). Không tính năng nào được phép chỉ hoạt
động qua hover hoặc yêu cầu màn hình rộng.
**Rationale**: Gia đình chủ yếu xem ảnh/video trên điện thoại và máy tính
bảng; đây là ngữ cảnh sử dụng chính, không phải trường hợp phụ.

### III. Không Lưu Trữ Media Gốc (No Original Media Hosting)
Website và repository của dự án KHÔNG BAO GIỜ được lưu trữ file ảnh/video gốc
(binary gốc). Chỉ được lưu: (a) metadata mô tả (tiêu đề, ngày, mô tả, tag,
người liên quan, URL chia sẻ) và (b) một thumbnail/preview đã tối ưu, dung
lượng nhỏ. File media gốc PHẢI được tham chiếu qua URL chia sẻ (shared link)
từ dịch vụ lưu trữ cloud của bên thứ ba (Google Drive, pCloud, hoặc tương
đương); website chỉ hiển thị và trỏ đến các URL này.
**Rationale**: Tránh chi phí lưu trữ, băng thông, và rủi ro pháp lý/an toàn
khi tự lưu trữ media gốc; tận dụng hạ tầng cloud sẵn có mà gia đình đã dùng.

### IV. Kiến Trúc Site Tĩnh với Stack Quy Định
Dự án PHẢI được xây dựng bằng: Eleventy (11ty) làm static site generator,
Vite cho build/dev server, Tailwind CSS cho styling, và Alpine.js cho tương
tác phía client. Không được thêm framework SPA nặng (React, Vue, Angular,
Next.js, v.v.), không được thêm server-side application framework, và không
được thêm database server (nhất quán với Nguyên tắc I). Output cuối cùng PHẢI
là static assets có thể deploy lên bất kỳ static host nào.
**Rationale**: Stack đã được người dùng lựa chọn có chủ đích để giữ dự án nhẹ,
dễ bảo trì, và triển khai đơn giản; thay đổi stack là thay đổi có chi phí cao
cần được ghi nhận như một tu chính hiến pháp (amendment), không phải quyết
định tùy tiện trong lúc implement.

### V. Riêng Tư & Phạm Vi Gia Đình
Nội dung của site là nội dung cá nhân/gia đình, KHÔNG hướng đến công khai đại
chúng hay traffic ẩn danh quy mô lớn. Mọi cơ chế chia sẻ hoặc kiểm soát truy
cập PHẢI giữ mức đơn giản, nhất quán với Nguyên tắc I (không kéo theo hệ thống
xác thực/database phức tạp). Cơ chế truy cập cụ thể (ví dụ: basic auth tĩnh,
link không công khai, danh sách mời) chưa được quyết định và PHẢI được làm rõ
ở giai đoạn spec/plan trước khi implement.
**Rationale**: Bảo vệ sự riêng tư của ảnh/video gia đình là yêu cầu cốt lõi,
nhưng giải pháp kỹ thuật cụ thể phụ thuộc vào lựa chọn hosting và mức độ tiện
lợi mong muốn, nên được quyết định khi có đầy đủ ngữ cảnh triển khai.

## Ràng Buộc Công Nghệ & Kiến Trúc

- **Stack bắt buộc**: 11ty (Eleventy), Vite, Tailwind CSS, Alpine.js. Không
  thay thế hoặc thêm framework khác mà không tu chính hiến pháp này trước.
- **Lưu trữ dữ liệu**: file phẳng (JSON/YAML/Markdown front matter), versioned
  trong git. Không dùng ORM, không dùng database server.
- **Build & Deploy**: output là static site, deploy được lên bất kỳ static
  host (Netlify, Vercel, GitHub Pages, self-host, v.v.).
- **Xử lý media**: thumbnail PHẢI được tạo/tối ưu (ví dụ WebP, kích thước
  nhỏ) và commit cùng metadata; file media gốc KHÔNG được upload vào
  repository hoặc bất kỳ storage của dự án này (xem Nguyên tắc III).

## Quy Trình Quản Lý Nội Dung

- Thêm một media item = thêm một entry metadata (JSON/YAML/Markdown front
  matter) với tối thiểu các trường: tiêu đề, ngày, mô tả, tag, URL chia sẻ
  (Google Drive/pCloud/...), và tham chiếu đến thumbnail.
- Thumbnail PHẢI được tạo (thủ công hoặc bán tự động), resize nhỏ, và commit
  cùng metadata tương ứng trước khi xuất bản.
- Không tính năng nào được phép yêu cầu ghi dữ liệu runtime vào một database;
  mọi thay đổi nội dung PHẢI đi qua việc sửa file + rebuild + redeploy.

## Governance

Hiến pháp này có hiệu lực cao hơn mọi quyết định kỹ thuật ad-hoc trong quá
trình specify/plan/implement. Khi có xung đột, hiến pháp thắng, trừ khi được
tu chính theo quy trình dưới đây.

- **Quy trình tu chính**: đề xuất thay đổi → cập nhật file này qua
  `/speckit-constitution` → tăng version theo semantic versioning → ghi lại
  trong Sync Impact Report ở đầu file.
- **Chính sách version**: MAJOR khi loại bỏ/định nghĩa lại nguyên tắc theo
  hướng không tương thích ngược (ví dụ đổi stack bắt buộc, cho phép lưu media
  gốc); MINOR khi thêm nguyên tắc/section mới hoặc mở rộng đáng kể hướng dẫn;
  PATCH khi chỉ làm rõ nghĩa/sửa lỗi diễn đạt không đổi ý nghĩa.
- **Compliance**: mọi output của `/speckit-specify`, `/speckit-plan`, và
  `/speckit-tasks` PHẢI được kiểm tra đối chiếu với các nguyên tắc ở đây
  trước khi implement; vi phạm PHẢI được giải trình rõ ràng (complexity
  justification) hoặc loại bỏ.

**Version**: 1.0.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-21
