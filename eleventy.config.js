/**
 * Eleventy — plonemraz.github.io
 *
 * Mặt tiền (index.html) KHÔNG đi qua Eleventy: nó được chép thẳng.
 * Eleventy chỉ dựng phần bên trong, tức /vault/.
 */
module.exports = function (eleventyConfig) {
  // --- Chép nguyên trạng, không xử lý ---
  eleventyConfig.addPassthroughCopy({ "index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "theme.css": "theme.css" });
  // Giữ URL công khai là /corpus/... dù file đã chuyển vào content/,
  // để mọi liên kết cũ từ bên ngoài vẫn sống.
  eleventyConfig.addPassthroughCopy({ "content/corpus": "corpus" });
  eleventyConfig.addPassthroughCopy({ visual: "visual" });
  eleventyConfig.addPassthroughCopy({ assets: "assets" });

  // --- Không dựng thành trang ---
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("content/corpus/**");
  eleventyConfig.ignores.add("visual/**");
  eleventyConfig.ignores.add("content/**/*.docx");
  eleventyConfig.ignores.add("content/**/*.txt");

  // --- Bài viết, mới nhất lên đầu ---
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("content/writing/*.md").sort((a, b) => b.date - a.date)
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
