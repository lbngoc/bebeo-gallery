// Hiệu ứng parallax cho lớp nền Hero (FR-007): khi cuộn, lớp nền
// [data-hero-parallax-layer] di chuyển chậm hơn nội dung tiền cảnh, tạo cảm
// giác chiều sâu. Tôn trọng prefers-reduced-motion (FR-008): nếu bật, KHÔNG
// gắn listener — nền đứng yên hoàn toàn, chỉ hiển thị tĩnh.

const PARALLAX_STRENGTH = 0.35; // hệ số tốc độ nền so với cuộn trang (0-1, nhỏ hơn = chậm hơn)

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initHeroParallax() {
  const layer = document.querySelector("[data-hero-parallax-layer]");
  const heroSection = document.getElementById("hero");
  if (!layer || !heroSection) return;

  if (prefersReducedMotion()) {
    layer.style.transform = "none";
    return;
  }

  let ticking = false;

  function update() {
    ticking = false;
    const rect = heroSection.getBoundingClientRect();
    // Chỉ áp dụng offset khi Hero còn ít nhiều trong viewport, tránh tính
    // toán/transform không cần thiết khi người dùng đã cuộn xa khỏi Hero.
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = rect.top * PARALLAX_STRENGTH;
    layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroParallax);
} else {
  initHeroParallax();
}
