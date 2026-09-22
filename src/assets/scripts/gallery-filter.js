import Alpine from "alpinejs";

// Component lọc album theo chủ đề (FR-006). Nhận toàn bộ mảng album (đã
// render sẵn ở server qua Nunjucks) để không phải parse lại DOM — chỉ so
// khớp theo index giữa mảng JS và thứ tự thẻ album trong template.
Alpine.data("galleryFilter", (albums = []) => ({
  active: "all",
  albums,

  select(category) {
    this.active = category;
  },

  isVisible(index) {
    if (this.active === "all") return true;
    const album = this.albums[index];
    return !!album && Array.isArray(album.categories) && album.categories.includes(this.active);
  },

  get hasVisible() {
    return this.albums.some((_, index) => this.isVisible(index));
  },
}));
