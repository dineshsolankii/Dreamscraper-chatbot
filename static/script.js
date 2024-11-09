let currentStep = 0;
let chatData = {
    user: "",
    genre: "",
    tone: "",
    characters: "",
    skills: "",
    related: ""
};

document.addEventListener('DOMContentLoaded', function() {
    const chatbox = document.getElementById('chatbox').querySelector('.messages');
    
    setTimeout(() => {
        appendBotMessage("Welcome to Dream Scraper!");
        setTimeout(() => {
            appendBotMessage("What character name do you want to use?");
            appendBotMessage("Also mention the skills that you want to have");
            currentStep++;
        }, 1000);
    }, 500);

    document.getElementById('sendButton').addEventListener('click', sendMessage);
    
    document.getElementById('userInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value;

    if (userMessage.trim() === "") return;

    appendUserMessage(userMessage);
    userInput.value = "";
    userInput.focus();

    setTimeout(() => {
        handleUserMessage(userMessage);
    }, 500);
}

function appendUserMessage(message) {
    const chatbox = document.getElementById('chatbox').querySelector('.messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('user-message');
    messageElement.innerHTML = `<div class="message-content">${message}</div>`;
    chatbox.appendChild(messageElement);
    scrollToBottom();
}

function appendBotMessage(message) {
    const chatbox = document.getElementById('chatbox').querySelector('.messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');
    
    if (message === "Generating your story... \napprox time:25s") {
        messageElement.innerHTML = `
            <div class="message-content">
                Generating your story...
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>`;
        startLoadingDots(); // Start the loading dots when generating
    } else {
        messageElement.innerHTML = `<div class="message-content">${message}</div>`;
    }
    
    chatbox.appendChild(messageElement);
    scrollToBottom();
}

function appendImage(imgSrc) {
    const chatbox = document.getElementById('chatbox').querySelector('.messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');
    messageElement.innerHTML = `
        <div class="message-content">
            <img class="generated-image" src="${imgSrc}" alt="Generated Image" style="max-width: 100%; border-radius: 10px;">
        </div>`;
    chatbox.appendChild(messageElement);
    scrollToBottom();
}

function appendAudio(audioSrc) {
    const chatbox = document.getElementById('chatbox').querySelector('.messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');
    messageElement.innerHTML = `
        <div class="message-content">
            <audio controls style="width: 100%;">
                <source src="${audioSrc}" type="audio/mp3">
            </audio>
        </div>`;
    chatbox.appendChild(messageElement);
    scrollToBottom();
}

function handleUserMessage(message) {
    if (message.toLowerCase() === "exit") {
        appendBotMessage("Okay, let's stop here. Hope you enjoyed!");
        appendBotMessage("If you want to start again, just give your character name and your skills.");
        currentStep = 0;
        chatData = {
            user: "",
            genre: "",
            tone: "",
            characters: "",
            skills: "",
            related: ""
        };
        return;
    }

    switch (currentStep) {
        case 1:
            chatData.user = message;
            appendBotMessage("Awesome! What genre do you prefer?");
            break;
        case 2:
            chatData.genre = message;
            appendBotMessage("Great choice! What tone do you want for the story?");
            break;
        case 3:
            chatData.tone = message;
            appendBotMessage("Got it! What characters do you want in your story?");
            break;
        case 4:
            chatData.characters = message;
            appendBotMessage("Awesome! What skills should the characters have?");
            break;
        case 5:
            chatData.skills = message;
            appendBotMessage("Perfect! Any related works or themes you'd like to include?");
            break;
        case 6:
            chatData.related = message;
            appendBotMessage("Generating your story... \napprox time:25s");
            generateStory();
            break;
        default:
            appendBotMessage("I don't understand that. Please provide the necessary details.");
            break;
    }

    if (currentStep < 6) {
        currentStep++;
    }
}

function generateStory() {
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatData)
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            stopLoadingDots();  // Stop the loading dots after generating the story
            appendBotMessage(data.story);
            appendImage(data.image_path);
            appendAudio(data.audio_path);
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        appendBotMessage("Sorry, there was an error generating your story. Please try again.");
    });
}

function scrollToBottom() {
    const chatbox = document.querySelector('.chatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Start and stop loading dots
function startLoadingDots() {
    const dots = document.querySelectorAll('.loading-dots .dot');
    dots.forEach((dot, index) => {
        dot.style.animation = `dot-blink 1.4s infinite ${index * 0.2}s`;
    });
}

function stopLoadingDots() {
    const dots = document.querySelectorAll('.loading-dots .dot');
    dots.forEach((dot) => {
        dot.style.animation = 'none'; // Stop the blinking dots
    });
}
