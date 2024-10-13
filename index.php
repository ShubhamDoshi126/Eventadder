<<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Alerts App</title>
    <link rel="stylesheet" href="css/styles.css">
    <script src="app.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>Event Alerts App</h1>
            <p>Plan your events seamlessly!</p>
        </header>

        <section class="chat-section">
            <div class="chat-box" id="chat-box">
                <div class="messages" id="messages">
                    <!-- Chatbot messages will appear here -->
                </div>
                <div class="pair">
                    <input type="text" id="user-input" placeholder="Talk to the bot..." onkeydown="if(event.key === 'Enter') sendMessage();">
                    <label for="image-upload" class="attach-button">
                        <img src="attach-file.png" alt="Attach" width=24px>
                        <input type="file" id="image-upload" style="display: none;" accept="image/*" onchange="handleImageUpload(event)">
                    </label>
                    <button onclick="sendMessage()">Send</button>
                </div>

                <!-- Clear Chat History button -->
                <button id="clear-history-btn" onclick="clearChatHistory()">Clear History</button>
            </div>
        </section>



        <section class="events-section">
            <h2>Your Events</h2>
            <div class="event-list" id="event-list">
                <!-- List of events will be dynamically added here -->
            </div>
        </section>
    </div>
</body>
</html>
