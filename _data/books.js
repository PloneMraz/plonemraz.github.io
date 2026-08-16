const fs = require("fs");
const path = require("path");

const ROOT = "content/books";
const SKIP = /^\.|\.json$/i; // file ẩn và file cấu hình

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

function human(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

/**
 * Mỗi file trong content/books/ là một cuốn sách tải về được.
 * Thả file vào là xong. Muốn đặt tiêu đề hoặc mô tả riêng thì
 * thêm content/books/books.json:
 *   { "ten-file.pdf": { "title": "...", "description": "..." } }
 */
module.exports = function () {
  if (!fs.existsSync(ROOT)) return [];

  let meta = {};
  const metaPath = path.join(ROOT, "books.json");
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (e) {
      console.warn("[books] books.json hỏng, bỏ qua:", e.message);
    }
  }

  const seen = new Set();

  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isFile() && !SKIP.test(d.name))
    .map((d) => {
      const ext = path.extname(d.name).replace(".", "").toUpperCase();
      const base = path.basename(d.name, path.extname(d.name));
      const m = meta[d.name] || {};

      let slug = slugify(m.title || base) || "book";
      let n = 2;
      while (seen.has(slug)) slug = slugify(m.title || base) + "-" + n++;
      seen.add(slug);

      return {
        slug,
        title: m.title || base.replace(/[-_]+/g, " ").trim(),
        description: m.description || "",
        file: d.name,
        ext,
        size: human(fs.statSync(path.join(ROOT, d.name)).size),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "vi"));
};
