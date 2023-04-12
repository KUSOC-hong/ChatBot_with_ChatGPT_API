// app.js
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');

async function sendMessage(event) {
    event.preventDefault();
    const message = messageInput.value;
    if (!message) {
        return;
    }
    appendMessage(message, 'user');
    messageInput.value = '';
    try {
        const response = await fetch('http://localhost:3000/omchat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        appendMessage(data.assistant, 'bot');
    } catch (error) {
        console.error(error);
    }
}

function appendMessage(message, sender) {
    const chatMessage = document.createElement('div');
    chatMessage.innerText = message;
    chatMessage.classList.add('chat-message', sender);
    chatBox.appendChild(chatMessage);
}

function getOMbot() {
    sendMessage(event);
}
