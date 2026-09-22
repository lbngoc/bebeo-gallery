import Alpine from "alpinejs";

// Đăng ký store/component dùng chung ở đây (US1: theme-store, section-nav;
// US2: gallery-filter; US3: video-carousel, video-modal; US4: section-scroll).
import "./theme-store.js";
import "./section-nav.js";
import "./gallery-filter.js";
import "./video-carousel.js";
import "./video-modal.js";
import "./section-scroll.js";
import "./hero-parallax.js";

window.Alpine = Alpine;
Alpine.start();
