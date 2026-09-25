import Alpine from "alpinejs";

// Dựng URL nhúng theo sourceType, đúng contracts/video-embed-contract.md.
function buildEmbedUrl(video) {
  if (!video) return null;
  switch (video.sourceType) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${video.embedRef}?autoplay=1&mute=1`;
    case "google-drive":
      return `https://drive.google.com/file/d/${video.embedRef}/preview?autoplay=1`;
    case "pcloud":
      return video.embedRef;
    default:
      return null;
  }
}

// Store dùng chung: video-section.njk mở modal, section-scroll.js (US4) đọc
// `open` để tạm ngắt điều hướng phím khi modal đang mở (FR-018).
Alpine.store("videoModal", {
  open: false,
  video: null,
  embedFailed: false,
  previouslyFocusedElement: null,

  get embedUrl() {
    return buildEmbedUrl(this.video);
  },

  openVideo(video) {
    this.previouslyFocusedElement = document.activeElement;
    this.video = video;
    this.embedFailed = false;
    this.open = true;
    // Khoá cuộn nền khi modal mở nhưng KHÔNG thay đổi vị trí cuộn hiện tại
    // của trang — nhờ vậy khi đóng modal, section Video vẫn ở đúng vị trí
    // cũ (US3 acceptance scenario 3) mà không cần lưu/khôi phục thủ công.
    document.body.style.overflow = "hidden";
    Alpine.nextTick(() => {
      document.querySelector('[x-ref="closeVideoModalButton"]')?.focus();
    });
  },

  close() {
    this.open = false;
    this.video = null;
    document.body.style.overflow = "";
    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === "function") {
      this.previouslyFocusedElement.focus();
    }
    this.previouslyFocusedElement = null;
  },

  markFailed() {
    this.embedFailed = true;
  },
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && Alpine.store("videoModal").open) {
    Alpine.store("videoModal").close();
  }
});
