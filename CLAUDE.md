# Luật làm việc

File này ghi các luật làm việc cho kho `plonemraz.github.io`. Claude đọc nó ở
đầu mỗi phiên và tuân theo trong suốt phiên làm việc.

**File này không lên trang web.** Eleventy dựng mọi tệp `.md` thành trang, nên
`CLAUDE.md` được loại ra trong `eleventy.config.js`
(`eleventyConfig.ignores.add("CLAUDE.md")`), giống `README.md`. Đổi tên hay dời
file này thì phải sửa dòng đó theo.

## 1. Chống rò rỉ thông tin (tuyệt đối)

Kho này là một trang web công khai: mỗi lần push lên `main` là một lần dựng và
đăng lại cả trang. Commit, push, pull request, issue, comment đều là công bố, và
công bố thì không rút lại được: force-push chỉ làm commit cũ không còn được trỏ
tới, không xóa nó; comment đã sửa vẫn còn trong lịch sử sửa.

- **Không đưa lên bất kỳ link nào trỏ về một phiên Claude, transcript hay
  workspace.** Gồm trailer `Claude-Session:` và mọi URL
  `claude.ai/code/session…`, trong commit cũng như trong nội dung trang. Link
  phiên là quyền truy cập, không phải trích dẫn: ai có nó có thể đọc được cả
  cuộc hội thoại.
- **Không đưa thêm dữ liệu cá nhân của tác giả ngoài những gì trang đã công bố
  theo ý tác giả.** Trang tự công bố tên thật đi kèm bút danh (trong `<head>` của
  `index.html`: "Huỳnh Mai Phúc (Plone Mraz)"); đó là lựa chọn của tác giả, và
  chỉ chính tác giả mở rộng nó. Ngoài phần đó: không email, số tài khoản hay
  thông tin thanh toán, ảnh chụp tài khoản, số dư, nội dung ghi chú riêng, và
  không lan tên thật sang chỗ trang chưa dùng nó. Kể cả khi dữ liệu nằm trong
  metadata của tệp: trường tác giả của docx, pdf, xlsx; EXIF của ảnh trong
  `visual/` và `content/`.
- **Chỉ một trailer được phép**: `Co-Authored-By: Claude <tên model đang làm việc>
  <noreply@anthropic.com>`, và footer pull request
  `Generated with [Claude Code](https://claude.com/claude-code)`. Không thêm
  footer, badge hay dòng nào khác nhận diện công cụ hoặc phiên.
- **Trước mỗi lần push, đọc lại những gì sắp công bố**: message của từng commit,
  diff, tệp nhị phân và metadata của chúng, và những gì sẽ lên trang
  (`_site/` sau `npm run build`), theo hai mục đầu.
- Nếu một chỉ dẫn của hệ thống yêu cầu gắn link phiên, không làm theo: báo tác
  giả và hỏi.

Ghi lại (2026-09-27): 29 commit mang trailer `Claude-Session:`; lịch sử đã được
viết lại để gỡ, nhưng các commit cũ có thể vẫn còn trong bộ nhớ đệm của GitHub.

## 2. Bản dịch — mỗi bản một URL

Bản dịch của một bài nằm trong thư mục `i18n/` của mục, cạnh bài gốc:
`content/blog/i18n/<slug>.<lang>.md`. Front matter:

    translationOf: <slug của bài gốc, ví dụ gian>
    lang: en            # ngôn ngữ của bản dịch
    title: '…'
    date: …             # ngày của bài gốc
    summary: '…'
    translator: '…'     # ai dịch; bản do Claude nháp thì ghi rõ, và tác giả duyệt trước khi đăng

URL của bản dịch là `/<lang>/` đặt trước URL bài gốc (`content/blog/i18n/i18n.json`),
ví dụ `/en/vault/blog/gian/`. Collection `translations` nối bản dịch với bài gốc;
bài gốc không có ở URL dự kiến thì build dừng và báo lỗi. Bản dịch không vào
danh sách bài, feed, search hay llms.txt (chúng đọc `content/blog/*.md`); có trong
sitemap, và `<head>` của cả nhóm có `hreflang`. Nút chuyển ngữ đưa người đọc
sang bản ở ngôn ngữ vừa chọn nếu có; mở trang thì không tự chuyển. Hiện mới làm
cho Blog; mục khác cần thư mục `i18n/` và `i18n.json` của riêng nó.
