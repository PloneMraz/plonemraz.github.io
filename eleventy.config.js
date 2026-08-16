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
  eleventyConfig.addPassthroughCopy({ corpus: "corpus" });
  eleventyConfig.addPassthroughCopy({ visual: "visual" });
  eleventyConfig.addPassthroughCopy({ assets: "assets" });

  // --- Không dựng thành trang ---
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("corpus/**");
  eleventyConfig.ignores.add("visual/**");
  eleventyConfig.ignores.add("writing/*.docx");
  eleventyConfig.ignores.add("writing/*.txt");

  // --- Bài viết, mới nhất lên đầu ---
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("writing/*.md").sort((a, b) => b.date - a.date)
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
