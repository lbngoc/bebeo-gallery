import Alpine from "alpinejs";

// Điều hướng carousel video bằng dãy chấm (dots) đồng bộ 2 chiều với vị trí
// cuộn thực tế của track (FR-009 đến FR-012): bấm dot → cuộn tới đúng video;
// tự vuốt/cuộn track → activeIndex tự cập nhật theo item gần nhất trong
// khung nhìn. Vẫn giữ nguyên cơ chế cuộn ngang/snap đã có, chỉ thay lớp điều
// khiển hiển thị (nút mũi tên → dots).
Alpine.data("videoCarousel", () => ({
  activeIndex: 0,
  _scrollTicking: false,

  init() {
    this.$nextTick(() => this.syncActiveIndexFromScroll());
  },

  goToIndex(index) {
    const track = this.$refs.track;
    const item = track?.children?.[index];
    if (!item) return;
    this.activeIndex = index;
    item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  },

  onTrackScroll() {
    if (this._scrollTicking) return;
    this._scrollTicking = true;
    requestAnimationFrame(() => {
      this._scrollTicking = false;
      this.syncActiveIndexFromScroll();
    });
  },

  syncActiveIndexFromScroll() {
    const track = this.$refs.track;
    if (!track || !track.children.length) return;
    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = 0;
    let minDistance = Infinity;
    Array.from(track.children).forEach((item, index) => {
      const distance = Math.abs(item.getBoundingClientRect().left - trackLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    this.activeIndex = closestIndex;
  },
}));
