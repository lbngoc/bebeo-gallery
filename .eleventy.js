import path from "node:path";
import fs from "node:fs";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import Image from "@11ty/eleventy-img";
import tailwindcss from "@tailwindcss/vite";

/**
 * Shortcode dùng cho background-thumbnail của album/video card.
 * Trả về markup <picture>/<img> đã tối ưu (webp+jpeg, responsive) qua eleventy-img;
 * nếu file nguồn không tồn tại hoặc xử lý lỗi, trả về khối placeholder thân thiện (FR-015)
 * thay vì để vỡ layout.
 */
async function cardImageShortcode(src, alt, className = "") {
  const placeholderHtml = `<div class="${className} flex items-center justify-center bg-earth-100 text-earth-600 dark:bg-water-800 dark:text-earth-200" role="img" aria-label="${alt || "Ảnh không khả dụng"}"><span class="text-3xl" aria-hidden="true">🖼️</span></div>`;

  if (!src) return placeholderHtml;

  const resolvedSrc = path.join("src", src);
  if (!fs.existsSync(resolvedSrc)) return placeholderHtml;

  try {
    const metadata = await Image(resolvedSrc, {
      widths: [400, 800],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/assets/images/generated/",
      urlPath: "/assets/images/generated/",
    });

    return Image.generateHTML(
      metadata,
      {
        alt: alt || "",
        class: className,
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
      },
      { whitespaceMode: "inline" },
    );
  } catch (err) {
    return placeholderHtml;
  }
}

/**
 * Shortcode dựng lớp nền trang trí cho Hero (FR-006, FR-006a/b/c).
 * - Không có `image` hợp lệ trong heroBackground.json (hoặc file thiếu/không
 *   đọc được) → trả về lớp nền trừu tượng mặc định (gradient CSS, xem
 *   main.css > .hero-bg-abstract).
 * - Có `image` hợp lệ → xử lý qua eleventy-img (như cardImage), áp class
 *   filter mono/tinted tương ứng (mặc định tinted nếu không chỉ định).
 * Cả 2 nhánh đều gắn `data-hero-parallax-layer` để hero-parallax.js nhận diện.
 */
async function heroBackgroundShortcode(heroBackground) {
  const config = heroBackground || {};
  const filterMode = config.filter === "mono" ? "mono" : "tinted";
  const abstractHtml = `<div class="absolute inset-0 hero-bg-abstract" data-hero-parallax-layer aria-hidden="true"></div>`;

  if (!config.image) return abstractHtml;

  const resolvedSrc = path.join("src", config.image);
  if (!fs.existsSync(resolvedSrc)) return abstractHtml;

  try {
    const metadata = await Image(resolvedSrc, {
      widths: [800, 1400, 1920],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/assets/images/generated/",
      urlPath: "/assets/images/generated/",
    });

    const filterClass = filterMode === "mono" ? "hero-filter-mono" : "hero-filter-tinted";

    return Image.generateHTML(
      metadata,
      {
        alt: "",
        class: `absolute inset-0 h-full w-full object-cover object-top ${filterClass}`,
        loading: "eager",
        decoding: "async",
        sizes: "100vw",
        "data-hero-parallax-layer": "",
      },
      { whitespaceMode: "inline" },
    );
  } catch (err) {
    return abstractHtml;
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      plugins: [tailwindcss()],
    },
  });

  eleventyConfig.addAsyncShortcode("cardImage", cardImageShortcode);
  eleventyConfig.addAsyncShortcode("heroBackground", heroBackgroundShortcode);

  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/scripts": "assets/scripts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/styles": "assets/styles" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.svg": "assets/favicon.svg" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
}
