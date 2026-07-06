const socket = io();

console.log("Connected to NexChat");

const usernameInput = document.getElementById("username");

const errorMessage = document.getElementById("error-message");

const joinButton = document.getElementById("join-btn");

const loginContainer = document.querySelector(".container");

const chatContainer = document.querySelector(".chat-container");

const welcomeMessage = document.getElementById("welcome-message");

const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");
const usersList = document.getElementById("users-list");
const onlineCount = document.getElementById("online-count");

let currentUser = "";
let typingTimeout;

// Join Button Click Event
joinButton.addEventListener("click", function (event) {

    // Stop page refresh
    event.preventDefault();

    // Get input value
    const username = usernameInput.value.trim();
    currentUser = username;

    console.log(username);
    if (username === "") {
    errorMessage.textContent = "Please enter your name.";
    return;
    }

    errorMessage.textContent = "";

    // Send username to server
    socket.emit("join-user", username);

    
    welcomeMessage.textContent = `Welcome ${username} 👋`;

    loginContainer.classList.add("hidden");

    chatContainer.classList.remove("hidden");

    messageInput.focus();

    
});
socket.on("welcome-message", (message) => {

    console.log(message);

});

function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") return;

    socket.emit("send-message", {
        username: currentUser,
        message: message
    });

    messageInput.value = "";

    messageInput.focus();
    socket.emit("stop-typing");

}
sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        sendMessage();

    }

});
socket.on("receive-message", (data) => {

    addMessage(data);

});
function addMessage(data) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (data.senderId === socket.id) {

        messageDiv.classList.add("my-message");

    } else {

        messageDiv.classList.add("other-message");

    }

    messageDiv.innerHTML = `

        <strong>${data.username}</strong>

        <p>${data.message}</p>

        <small>${data.time}</small>

    `;

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
socket.on("user-joined", (message) => {

    addSystemMessage(message);

});
function addSystemMessage(message){

    const div = document.createElement("div");

    div.classList.add("system-message");

    div.textContent = message;

    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;

}


socket.on("user-left", (message) => {

    addSystemMessage(message);

});

socket.on("online-users", (users) => {

    usersList.innerHTML = "";
    onlineCount.textContent = `Online Users (${users.length})`;

    users.forEach((user) => {

        const li = document.createElement("li");

        li.textContent = "🟢 " + user.username;

        usersList.appendChild(li);

    });

});

messageInput.addEventListener("input", () => {

    socket.emit("typing", currentUser);

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {

        socket.emit("stop-typing");

    },1000);

});

const typingIndicator = document.getElementById("typing-indicator");

socket.on("user-typing", (username) => {

    typingIndicator.textContent = `✍️ ${username} is typing...`;

});

socket.on("user-stop-typing", () => {

    typingIndicator.textContent = "";

});