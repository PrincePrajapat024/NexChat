const socket = io();

console.log("Connected to NexChat");

const usernameInput = document.getElementById("username");

const errorMessage = document.getElementById("error-message");

const joinButton = document.getElementById("join-btn");

const loginContainer = document.querySelector(".container");

const chatContainer = document.querySelector(".chat-container");

const welcomeMessage = document.getElementById("welcome-message");

// Join Button Click Event
joinButton.addEventListener("click", function (event) {

    // Stop page refresh
    event.preventDefault();

    // Get input value
    const username = usernameInput.value.trim();

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

});