const fs = require("fs");
const path = require("path");

const ROOT = "content/my oc";
const EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Tên thư mục -> slug an toàn cho URL.
 * Bỏ dấu tiếng Việt, hạ chữ thường, mọi thứ không phải chữ/số
 * thành gạch nối. Nhờ vậy thư mục đặt tên tự nhiên như
 * "Nhân Vật A" vẫn ra URL sạch: /nhan-vat-a/
 */
function slugify(name) {
  return name
    .normalize("NFD")
    .split("")
    .filter(function (c) {
      var k = c.charCodeAt(0);
      return k < 0x300 || k > 0x36f;
    })
    .join("")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Mỗi thư mục con của content/my oc/ là một album.
 * Không cần khai báo gì: thả ảnh vào thư mục là xong.
 */
module.exports = function () {
  if (!fs.existsSync(ROOT)) return [];

  const seen = new Set();

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

      // Hai thư mục khác tên vẫn có thể ra cùng slug; thêm hậu tố
      // để không thư mục nào ghi đè thư mục khác trong im lặng.
      let slug = slugify(d.name) || "album";
      let n = 2;
      while (seen.has(slug)) slug = slugify(d.name) + "-" + n++;
      seen.add(slug);

      return {
        slug,
        title: d.name.replace(/[-_]+/g, " ").trim(),
        count: images.length,
        cover: images[0] || null,
        images,
      };
    })
    .filter((a) => a.count > 0)
    .sort((a, b) => a.title.localeCompare(b.title, "vi"));
};
