<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing</title>
    <link rel="stylesheet" href="../static/css/style.css">
    <link rel="stylesheet" href="../static/css/fonts.css">
</head>
<body class="retro-content">
    <header class="retro-header">
        <div class="logo">
            <h1>forFun</h1>
        </div>
        <nav class="retro-nav">
            <ul>
                <li><a href="../../index.html">Home</a></li>
                <li><a href="testing.html">Testing</a></li>
            </ul>
        </nav>
    </header>
    <div class="retro-container">
        <main>
            <section class="intro retro-fade-in">
                <h1>Welcome to the Testing Room</h1>
                <h2>Retro Physics Engine Demo</h2>
            </section>
            <section id="physics-test-room" class="cool-section retro-fade-in">
                <h2>Physics Engine Testing Room</h2>
                <div id="physics-container">
                    <canvas id="physics-canvas" width="600" height="400"></canvas>
                </div>
            </section>
            <section id="controls-panel" class="retro-fade-in">
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
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const gameScript = document.createElement('script');
            gameScript.type = 'module';
            gameScript.src = '../static/js/testing.js';
            document.body.appendChild(gameScript);
        });
    </script>
    <script src="../static/js/build.js" type="module"></script>
    <!-- <script src="../static/js/testing.js"></script> -->
</body>
</html>
