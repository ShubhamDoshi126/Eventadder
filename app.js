let selectedImage = null;

// Load chat history from localStorage when the page loads
window.onload = function () {
    loadChatHistory();
};

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedImage = e.target.result; // Store base64 string of the image
            console.log("Image uploaded:", selectedImage);
        };
        reader.readAsDataURL(file); // Convert the image to base64
    }
}

// Function to send a message and image to the chatbot
function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() === '' && !selectedImage) {
        return; // If no message and no image, don't send
    }

    // Add the user's message and image to the chat
    addMessageToChat('You', userInput, selectedImage);

    // Create an object with message and image
    const messageData = {
        text: userInput,
        image: selectedImage // Send the image along with the text
    };
    // Send the messageData to the backend
    fetch('/create_event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.event_link) {
            const botResponse = `Event created: <a href="${data.event_link}" target="_blank">View event</a>`;
            addMessageToChat('Bot', botResponse);
        } else if (data.error) {
            addMessageToChat('Bot', `Error: ${data.error}`);
        }
    })
    .catch(error => console.error('Error creating event:', error));
        // Clear the input and image after sending
    document.getElementById('user-input').value = '';
    selectedImage = null; // Reset selected image
    document.getElementById('image-upload').value = ''; // Clear file input
}

// Function to add message and image to the chat display and save in localStorage
function addMessageToChat(sender, message, image) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    let currentImage;
    if (sender === 'You') {
        currentImage = "icon-user.png";
    } else {
        currentImage = "icon-ai.png";
    }

    // Updated innerHTML structure for better wrapping
    messageElement.innerHTML = `
        <div style="display: flex; align-items: center;">
            <img src="${currentImage}" alt="user" width="50px" height="50px" style="margin-right: 10px;">
            <strong>${sender}:</strong>
        </div>
        <p style="padding-left: 6px; padding-top: 5px; margin: 0;">${message}</p>
    `;

    // If there's an image, add it to the message
    if (image) {
        const imageElement = document.createElement('img');
        imageElement.src = image;
        imageElement.style.maxWidth = '150px';
        imageElement.style.marginTop = '10px';
        imageElement.style.marginLeft = '10px';
        imageElement.style.marginBottom = '10px';
        imageElement.style.borderRadius = '5px';
        imageElement.style.display = 'block';
        messageElement.appendChild(imageElement);
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto scroll to the bottom

    // Save the chat message in localStorage
    saveChatToLocalStorage(sender, message, image);
}

// Function to save chat messages in localStorage
function saveChatToLocalStorage(sender, message, image) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, message, image });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Function to load chat history from localStorage
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(chat => {
        addMessageToChat(chat.sender, chat.message, chat.image);
    });
}

// Function to clear chat history
function clearChatHistory() {
    localStorage.removeItem('chatHistory');
    document.getElementById('messages').innerHTML = ''; // Clear the chat display
}
