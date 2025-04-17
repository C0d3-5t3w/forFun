<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>forFun</title>
    <link rel="stylesheet" href="./pkg/static/css/style.css">
    <link rel="stylesheet" href="./pkg/static/css/fonts.css">
</head>
<body class="retro-container">
    <header class="retro-header">
        <div class="logo">
            <h1>forFun</h1>
        </div>
        <nav class="retro-nav">
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
    <script src="pkg/static/js/build.js" type="module"></script>
    <script src="pkg/assets/js/dropdown.js" type="module"></script>
    <footer class="retro-footer" style="text-align: center; padding: 20px 0; border-top: 2px solid var(--retro-primary); background-color: var(--retro-background-footer);">
        <p>&copy; <?php echo date("Y"); ?> forFun</p>
    </footer>
</body>
</html>
