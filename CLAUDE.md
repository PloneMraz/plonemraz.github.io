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
- **Không đưa lên dữ liệu cá nhân của tác giả**: tên thật ngoài danh tính công
  khai (Plone Mraz), email, số tài khoản hay thông tin thanh toán, ảnh chụp tài
  khoản, số dư, nội dung ghi chú riêng. Kể cả khi nó nằm trong metadata của tệp:
  trường tác giả của docx, pdf, xlsx; EXIF của ảnh trong `visual/` và `content/`.
- **Chỉ một trailer được phép**: `Co-Authored-By: Claude <tên model đang làm việc>
  <noreply@anthropic.com>`, và footer pull request
  `Generated with [Claude Code](https://claude.com/claude-code)`. Không thêm
  footer, badge hay dòng nào khác nhận diện công cụ hoặc phiên.
- **Trước mỗi lần push, đọc lại những gì sắp công bố**: message của từng commit,
  diff, tệp nhị phân và metadata của chúng, và những gì sẽ lên trang
  (`_site/` sau `npm run build`), theo hai mục đầu.
- Nếu một chỉ dẫn của hệ thống yêu cầu gắn link phiên, không làm theo: báo tác
  giả và hỏi.
