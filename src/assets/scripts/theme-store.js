import Alpine from "alpinejs";

const STORAGE_KEY = "bebeo-theme";

// Đăng ký store trước khi Alpine.start() (gọi ở main.js) để $store.theme
// sẵn sàng cho mọi component dùng đến (FR-003).
Alpine.store("theme", {
  isDark: document.documentElement.classList.contains("dark"),

  toggle() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle("dark", this.isDark);
    try {
      localStorage.setItem(STORAGE_KEY, this.isDark ? "dark" : "light");
    } catch (err) {
      // localStorage có thể không khả dụng (chế độ duyệt riêng tư) — theme
      // vẫn áp dụng trong phiên hiện tại, chỉ không được ghi nhớ.
    }
  },
});
