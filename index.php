<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>forFun</title>
    <link rel="stylesheet" href="./pkg/static/css/style.css">
    <link rel="stylesheet" href="./pkg/static/css/fonts.css">
</head>
<body class="container">
    <header class="site-header">
        <div class="logo">
            <h1>forFun</h1>
        </div>
        <nav class="site-nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="pkg/sites/testing.html">Testing</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="intro fade-in">
            <h1>Welcome to forFun</h1>
            <h2>Your interactive playground for creative coding.</h2>
        </section>
    </main>
    <footer class="site-footer" style="text-align: center; padding: 20px 0; border-top: 2px solid var(--color-primary); background-color: var(--color-denary);">
        <p>&copy; <?php echo date("Y"); ?> forFun</p>
    </footer>
    <script src="pkg/static/js/build.js" type="module"></script>
</body>
</html>
