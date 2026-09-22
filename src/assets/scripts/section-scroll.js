// Điều hướng section-snap trên desktop bằng phím mũi tên lên/xuống hoặc
// cuộn chuột (FR-011). Kết hợp với CSS `scroll-snap` (main.css/index.njk)
// làm nền tảng; lớp JS này lo phần phím mũi tên, debounce wheel để mỗi lần
// cuộn chỉ chuyển đúng 1 section (Edge case), tôn trọng
// prefers-reduced-motion (FR-016), và tạm ngắt khi modal video đang mở
// (FR-018). Trên mobile/tablet, toàn bộ logic này không kích hoạt — trang
// dùng cuộn tự nhiên liên tục (FR-012).

const DESKTOP_QUERY = "(min-width: 1024px)";
const WHEEL_COOLDOWN_MS = 700;
const WHEEL_THRESHOLD = 12;
const TALL_SECTION_EPSILON = 2;

let isNavigating = false;

function isDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isVideoModalOpen() {
  return !!(window.Alpine && window.Alpine.store("videoModal") && window.Alpine.store("videoModal").open);
}

function getSections() {
  return Array.from(document.querySelectorAll("[data-section]"));
}

function getCurrentSectionIndex(sections) {
  let closestIndex = 0;
  let minDistance = Infinity;
  sections.forEach((section, index) => {
    const distance = Math.abs(section.getBoundingClientRect().top);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });
  return closestIndex;
}

function goToSectionIndex(index) {
  const sections = getSections();
  const clampedIndex = Math.max(0, Math.min(index, sections.length - 1));
  const target = sections[clampedIndex];
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

// Khi section hiện tại (ví dụ Gallery) cao hơn 1 viewport, cuộn hết phần nội
// dung còn lại của chính section đó trước khi nhảy sang section kế tiếp —
// tránh bỏ sót nội dung (T012, sửa hồi quy so với 001 FR-011 / 003 FR-006).
function scrollWithinTallSection(rect, viewportHeight, direction) {
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  const targetY =
    direction > 0
      ? Math.min(window.scrollY + viewportHeight, window.scrollY + rect.bottom - viewportHeight)
      : Math.max(window.scrollY - viewportHeight, window.scrollY + rect.top);
  window.scrollTo({ top: targetY, behavior });
}

function navigate(direction) {
  const sections = getSections();
  const currentIndex = getCurrentSectionIndex(sections);
  const current = sections[currentIndex];
  const rect = current.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const hasUnseenContentBelow = direction > 0 && rect.bottom > viewportHeight + TALL_SECTION_EPSILON;
  const hasUnseenContentAbove = direction < 0 && rect.top < -TALL_SECTION_EPSILON;

  if (hasUnseenContentBelow || hasUnseenContentAbove) {
    scrollWithinTallSection(rect, viewportHeight, direction);
    return;
  }

  goToSectionIndex(currentIndex + direction);
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  if (!isDesktop() || isVideoModalOpen()) return;

  event.preventDefault();
  navigate(event.key === "ArrowDown" ? 1 : -1);
});

window.addEventListener(
  "wheel",
  (event) => {
    if (!isDesktop() || isVideoModalOpen()) return;
    if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

    event.preventDefault();
    if (isNavigating) return;

    isNavigating = true;
    navigate(event.deltaY > 0 ? 1 : -1);
    setTimeout(() => {
      isNavigating = false;
    }, WHEEL_COOLDOWN_MS);
  },
  { passive: false },
);
