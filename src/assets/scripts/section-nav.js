// Cuộn mượt tới section khi nhấn nav (FR-002) được xử lý bằng CSS thuần
// (`scroll-behavior: smooth` trên <html> trong main.css) kết hợp với các
// liên kết neo `<a href="#...">` trong header.njk — không cần JS để đạt
// hành vi cơ bản này. FR-016 (tôn trọng prefers-reduced-motion) cũng đã
// được xử lý bằng CSS media query tương ứng trong main.css.
//
// File này giữ lại như điểm mở rộng trong tương lai nếu cần logic JS bổ
// sung cho nav (ví dụ highlight mục đang active) — hiện tại không cần
// thiết cho phạm vi spec hiện tại (tránh phức tạp hoá không cần thiết,
// Nguyên tắc I của hiến pháp).
