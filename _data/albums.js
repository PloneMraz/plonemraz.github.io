const fs = require("fs");
const path = require("path");

const ROOT = "content/imagination";
const EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Mỗi thư mục con của content/imagination/ là một album.
 * Không cần khai báo gì: thả ảnh vào thư mục là xong. Tên album
 * lấy từ tên thư mục, gạch nối đổi thành khoảng trắng.
 */
module.exports = function () {
  if (!fs.existsSync(ROOT)) return [];

  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(ROOT, d.name);
      const images = fs
        .readdirSync(dir)
        .filter((f) => EXT.test(f))
        .sort()
        .map((f) => path.join(dir, f).split(path.sep).join("/"));

      return {
        slug: d.name,
        title: d.name.replace(/[-_]+/g, " ").trim(),
        count: images.length,
        cover: images[0] || null,
        images,
      };
    })
    .filter((a) => a.count > 0)
    .sort((a, b) => a.slug.localeCompare(b.slug));
};
