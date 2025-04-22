<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing</title>
    <link rel="stylesheet" href="../static/css/style.css">
    <link rel="stylesheet" href="../static/css/fonts.css">
    <link rel="stylesheet" href="../static/css/testing.css">
</head>
<body class="container">
    <header class="site-header">
        <div class="logo">
            <h1>forFun :: Testing</h1>
        </div>
        <nav class="site-nav">
            <ul>
                <li><a href="../../index.php">Home</a></li>
                <li><a href="testing.php">Testing</a></li>
            </ul>
        </nav>
    </header>
    <div class="main-content-wrapper">
        <main>
            <section id="physics-section">
                <h2>Physics Simulation</h2>
                <div id="physics-container">
                    <canvas id="physics-canvas" width="600" height="400"></canvas>
                </div>
            </section>
            <section id="controls-panel" class="fade-in">
                <h2>Controls</h2>
                <div style="margin-bottom: 15px;">
                </div>
                <div>
                    <button id="toggle-gravity">Toggle Gravity</button>
                    <button id="toggle-wind">Toggle Wind</button>
                    <button id="toggle-drag">Toggle Drag</button>
                </div>
            </section>
            <section class="chat-section fade-in">
                <h2>Real-time Chat & Game Control</h2>
                <div class="chat-container">
                    <div class="chat-header">
                        Game Chat
                        <span id="connection-status" class="connection-status connected">Connected</span>
                    </div>
                    <div id="chat-messages" class="chat-messages"></div>
                    <div class="chat-input">
                        <div class="input-row">
                            <input type="text" id="username-input" placeholder="Your Player Name">
                        </div>
                        <div class="input-row">
                            <input type="text" id="message-input" placeholder="Type !up, !down, !left, !right or chat">
                            <button id="send-message">Send</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <script src="../static/js/build.js" type="module"></script>
    <script src="../static/js/testing.js" type="module"></script>
</body>
</html>
