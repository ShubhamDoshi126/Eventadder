let selectedImage = null;

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

    // Basic response from chatbot
    const botResponse = `Event created: "${messageData.text}"`;
    setTimeout(() => {
        addMessageToChat('Bot', botResponse);

        // Create an event in Google Calendar (mock implementation)
        createGoogleCalendarEvent(messageData);
        // Clear input
        document.getElementById('user-input').value = '';
    }, 500); // Simulate bot response delay

    // Send messageData to backend or chatbot logic

    // Clear the input and image after sending
    document.getElementById('user-input').value = '';
    selectedImage = null; // Reset selected image
    document.getElementById('image-upload').value = ''; // Clear file input
}

// Function to add message and image to the chat display
function addMessageToChat(sender, message, image) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    
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
}