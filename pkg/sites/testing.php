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
    <div>
        <main>
            <section>
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
            
            <!-- New Chat Section -->
            <section class="chat-section retro-fade-in">
                <h2>Real-time Chat</h2>
                <div class="chat-container">
                    <div class="chat-header">
                        Chat Room
                        <span id="connection-status" class="connection-status connected">Connected</span>
                    </div>
                    <div id="chat-messages" class="chat-messages"></div>
                    <div class="chat-input">
                        <div class="input-row">
                            <input type="text" id="username-input" placeholder="Your name (optional)">
                        </div>
                        <div class="input-row">
                            <input type="text" id="message-input" placeholder="Type a message...">
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
