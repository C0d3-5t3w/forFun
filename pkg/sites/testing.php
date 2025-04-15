<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing</title>
    <link rel="stylesheet" href="../static/css/style.css">
    <link rel="stylesheet" href="../static/css/fonts.css">
</head>
<body class="content">
    <header class="site-header">
        <div class="logo">
            <h1>forFun</h1>
        </div>
        <nav class="site-nav">
            <ul>
                <li><a href="../../index.html">Home</a></li>
                <li><a href="testing.html">Testing</a></li>
            </ul>
        </nav>
    </header>
    <div class="container">
        <main>
            <section class="intro fade-in">
                <h1>Welcome to the Testing Room</h1>
                <h2>Professional Physics Engine Demo</h2>
            </section>
            <section id="physics-test-room" class="cool-section fade-in">
                <h2>Physics Engine Testing Room</h2>
                <canvas id="physics-canvas" width="600" height="400"></canvas>
            </section>
            <section id="controls-panel" class="fade-in">
                <div style="margin-bottom: 15px;">
                    <button id="force-up">Up</button>
                    <button id="force-left">Left</button>
                    <button id="force-right">Right</button>
                    <button id="force-down">Down</button>
                </div>
                <div>
                    <button id="toggle-gravity">Toggle Gravity</button>
                    <button id="toggle-wind">Toggle Wind</button>
                    <button id="toggle-drag">Toggle Drag</button>
                </div>
            </section>
        </main>
    </div>
    <footer class="site-footer">
        <p>&copy; <?php echo date("Y"); ?> forFun</p>
    </footer>
    <script src="../static/js/build.js" type="module"></script>
    <script src="../static/js/testing.js" type="module"></script>
</body>
</html>
