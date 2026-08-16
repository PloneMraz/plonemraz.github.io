const fs = require("fs");
const path = require("path");

const ROOT = "content/my oc";
const EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

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

function imagesIn(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXT.test(f))
    .sort()
    .map((f) => path.join(dir, f).split(path.sep).join("/"));
}

/**
 * Mỗi thư mục con của content/my oc/ là một album (một nhân vật).
 * Bên trong có thể chia tiếp thành nhóm — Anime, Realistic… — mỗi
 * thư mục con nữa là một nhóm. Ảnh nằm thẳng trong thư mục nhân
 * vật cũng được nhận, xếp vào nhóm không tên.
 *
 * Thả ảnh vào là xong, không phải khai báo gì.
 */
module.exports = function () {
  if (!fs.existsSync(ROOT)) return [];

  const seen = new Set();

  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(ROOT, d.name);

      const groups = [];
      const loose = imagesIn(dir);
      if (loose.length) groups.push({ name: "", images: loose });

      fs.readdirSync(dir, { withFileTypes: true })
        .filter((g) => g.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((g) => {
          const imgs = imagesIn(path.join(dir, g.name));
          if (imgs.length) groups.push({ name: g.name, images: imgs });
        });

      // Danh sách phẳng: lightbox đánh số theo đúng thứ tự hiển thị
      const images = groups.reduce((all, g) => all.concat(g.images), []);

      let slug = slugify(d.name) || "album";
      let n = 2;
      while (seen.has(slug)) slug = slugify(d.name) + "-" + n++;
      seen.add(slug);

      return {
        slug,
        title: d.name.replace(/[-_]+/g, " ").trim(),
        count: images.length,
        cover: images[0] || null,
        groups,
        images,
      };
    })
    .filter((a) => a.count > 0)
    .sort((a, b) => a.title.localeCompare(b.title, "vi"));
};
