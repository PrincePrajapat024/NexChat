const socket = io();

console.log("Connected to NexChat");

const usernameInput = document.getElementById("username");

const errorMessage = document.getElementById("error-message");

const joinButton = document.getElementById("join-btn");

// Join Button Click Event
joinButton.addEventListener("click", function (event) {

    // Stop page refresh
    event.preventDefault();

    // Get input value
    const username = usernameInput.value.trim();

    console.log(username);

});