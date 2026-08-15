<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PloneMraz | Personal Portfolio</title>
    <style>
        /* CSS Reset & Variables */
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --accent-color: #38bdf8;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.6;
        }

        /* Container */
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header / Navbar */
        header {
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #334155;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }

        nav a {
            color: var(--text-secondary);
            text-decoration: none;
            margin-left: 20px;
            transition: color 0.3s;
        }

        nav a:hover {
            color: var(--accent-color);
        }

        /* Hero Section */
        .hero {
            padding: 80px 0 60px;
            text-align: center;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 10px;
        }

        .hero span {
            color: var(--accent-color);
        }

        .hero p {
            font-size: 1.2rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto 30px;
        }

        .btn {
            display: inline-block;
            background: var(--accent-color);
            color: #0f172a;
            padding: 12px 28px;
            border-radius: 6px;
            font-weight: bold;
            text-decoration: none;
            transition: transform 0.2s, opacity 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }

        /* Section Layout */
        section {
            padding: 60px 0;
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
        }

        .section-title::after {
            content: '';
            display: block;
            width: 50px;
            height: 4px;
            background: var(--accent-color);
            margin: 10px auto 0;
            border-radius: 2px;
        }

        /* Grid Cards (Dự án) */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .card {
            background: var(--card-bg);
            padding: 24px;
            border-radius: 10px;
            border: 1px solid #334155;
            transition: transform 0.3s;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .card h3 {
            margin-bottom: 10px;
            color: var(--accent-color);
        }

        .card p {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        /* Skills Tags */
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .skill-tag {
            background: var(--card-bg);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid #334155;
            color: var(--accent-color);
            font-size: 0.9rem;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #334155;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Header -->
        <header>
            <div class="logo">PloneMraz</div>
            <nav>
                <a href="#about">Giới thiệu</a>
                <a href="#projects">Dự án</a>
                <a href="#skills">Kỹ năng</a>
            </nav>
        </header>

        <!-- Hero / Banner -->
        <div class="hero">
            <h1>Xin chào, tôi là <span>PloneMraz</span> 👋</h1>
            <p>Lập trình viên / Người sáng tạo nội dung. Chào mừng bạn đến với trang web cá nhân của tôi!</p>
            <a href="https://github.com/PloneMraz" class="btn" target="_blank">Ghé thăm GitHub</a>
        </div>

        <!-- About Section -->
        <section id="about">
            <h2 class="section-title">Giới thiệu</h2>
            <p style="text-align: center; color: var(--text-secondary); max-width: 700px; margin: 0 auto;">
                Trang web này được xây dựng và lưu trữ trực tiếp trên GitHub Pages. Đây là nơi tôi chia sẻ các dự án, bài viết và hành trình học tập lập trình của mình.
            </p>
        </section>

        <!-- Projects Section -->
        <section id="projects">
            <h2 class="section-title">Dự án</h2>
            <div class="grid">
                <div class="card">
                    <h3>🚀 Dự án 1</h3>
                    <p>Mô tả ngắn gọn về dự án của bạn ở đây. Công nghệ sử dụng: HTML, CSS, JS.</p>
                </div>
                <div class="card">
                    <h3>🌐 Dự án 2</h3>
                    <p>Mô tả ứng dụng web tĩnh hoặc sản phẩm cá nhân bạn đã phát triển.</p>
                </div>
                <div class="card">
                    <h3>🛠️ Dự án 3</h3>
                    <p>Mô tả công cụ, thư viện hoặc mã nguồn mở bạn tham gia đóng góp.</p>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills">
            <h2 class="section-title">Kỹ năng</h2>
            <div class="skills">
                <span class="skill-tag">HTML5</span>
                <span class="skill-tag">CSS3</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">Git & GitHub</span>
                <span class="skill-tag">Responsive Design</span>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <p>© 2026 PloneMraz. Được tạo bởi GitHub Pages.</p>
        </footer>
    </div>

</body>
</html>
