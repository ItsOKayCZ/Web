<html>

    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../CSS/index.css">
        <link rel="stylesheet" href="../CSS/web.css">
        <title>echo "Welcome there"</title>
        <link rel="shortcut icon" href="../favicon.ico">
        <script src="../JS/web.js"></script>
    </head>

    <body>

        <div id="header">

            <div class="header_text_AboutMe">
                <span onclick='window.location = "../index.html"' class="header_text">About me</span>
            </div>

            <div class="header_text_Projects">
                <span onclick='window.location = "projects.html"' class="header_text">Projects</span>
                <div class="dropdown">
                    <a href="#">Web</a>
                    <a href="python.php">Python</a>
                    <a href="CTFs.html">CTFs</a>
                </div>
            </div>

        </div>

        <div id="content">

            <h1 class="content_header1">Web</h1>

            <div class="content_with_projects">

                <div class="content_Projects">
                    <h2>Projects</h2>
                    <?php include "../PHP/github.php"; main("Web"); ?>
                </div>

                <div class="content_viewer">
                    <iframe class="content_iframe"></iframe>
                </div>

            </div>

        </div>

    </body>

</html>
