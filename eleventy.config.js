/**
 * Eleventy — plonemraz.github.io
 *
 * Mặt tiền (index.html) KHÔNG đi qua Eleventy: nó được chép thẳng.
 * Eleventy chỉ dựng phần bên trong, tức /vault/.
 */
// v7 xuat theo kieu ESM, ban CommonJS nam o .default
const Image = require("@11ty/eleventy-img").default;
const path = require("path");

/* Sinh ảnh lúc build: bản nhỏ cho lưới, bản lớn cho lightbox.
   Không phục vụ file gốc — bản 2000px WebP đã thừa cho màn hình,
   mà nhẹ hơn ảnh gốc hàng chục lần. */
const IMG = { widths: [400, 2000], formats: ["webp"], outputDir: "_site/img/",
              urlPath: "/img/", sharpWebpOptions: { quality: 82 } };

module.exports = function (eleventyConfig) {
  // --- Chép nguyên trạng, không xử lý ---
  eleventyConfig.addPassthroughCopy({ "index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "theme.css": "theme.css" });
  // Giữ URL công khai là /corpus/... dù file đã chuyển vào content/,
  // để mọi liên kết cũ từ bên ngoài vẫn sống.
  eleventyConfig.addPassthroughCopy({ "content/corpus": "corpus" });
  eleventyConfig.addPassthroughCopy({ "content/books": "books" });

  /* File xác minh chủ sở hữu của Google/Bing phải nằm đúng nguyên
     tên ở gốc site. Eleventy coi mọi .html là template và đổi thành
     URL dạng thư mục (/google-abc/ thay vì /google-abc.html), nên
     phải chép nguyên trạng và loại khỏi khâu dựng trang. */
  eleventyConfig.addPassthroughCopy("google*.html");
  eleventyConfig.addPassthroughCopy("BingSiteAuth.xml");
  eleventyConfig.addPassthroughCopy({ visual: "visual" });
  eleventyConfig.addPassthroughCopy({ assets: "assets" });

  // --- Không dựng thành trang ---
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("google*.html");
  eleventyConfig.ignores.add("content/corpus/**");
  eleventyConfig.ignores.add("visual/**");
  eleventyConfig.ignores.add("content/**/*.docx");
  eleventyConfig.ignores.add("content/**/*.txt");
  eleventyConfig.ignores.add("content/my oc/**");
  eleventyConfig.ignores.add("content/books/**");

  // --- Ảnh: <picture> hai cỡ, tải lười ---
  eleventyConfig.addAsyncShortcode("photo", async function (src, alt, cls) {
    const meta = await Image(src, IMG);
    const thumb = meta.webp[0];
    const full = meta.webp[meta.webp.length - 1];
    return `<a class="${cls || "shot"}" href="${full.url}"
      data-full="${full.url}" data-w="${full.width}" data-h="${full.height}">
      <img src="${thumb.url}" width="${thumb.width}" height="${thumb.height}"
           alt="${(alt || "").replace(/"/g, "&quot;")}" loading="lazy" decoding="async">
    </a>`;
  });

  // --- Bài viết, mới nhất lên đầu ---
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("content/writing/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("fiction", (api) =>
    api.getFilteredByGlob("content/fiction/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("code", (api) =>
    api.getFilteredByGlob("content/vibe-coding/*.md").sort((a, b) => b.date - a.date)
  );

  // --- Ngày hiển thị: 16 Aug 2026 ---
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
