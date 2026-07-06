const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/../public/index.html");
});

let onlineUsers = [];

const PORT = 3000;
io.on("connection", (socket) => {

    console.log("A user connected");

    socket.on("join-user", (username) => {

    socket.username = username;
    onlineUsers.push({
    id: socket.id,
    username: username
    });

    io.emit("online-users", onlineUsers);

    console.log(`${username} joined NexChat`);

    socket.emit("welcome-message", `Welcome ${username} 👋`);

    socket.broadcast.emit("user-joined", `${username} joined the chat 🟢`);

    });
    socket.on("send-message", (data) => {

        console.log(data);
        io.emit("receive-message", {

        username:data.username,

        message:data.message,

        senderId:socket.id,

            time:new Date().toLocaleTimeString([],{

                hour:"2-digit",

                minute:"2-digit"

            })

        });
    });

    socket.on("disconnect", () => {

        console.log(`${socket.username} left the chat`);
        onlineUsers = onlineUsers.filter(user => user.id !== socket.id);

        io.emit("online-users", onlineUsers);

        socket.broadcast.emit(
            "user-left",
            `${socket.username} left the chat 🔴`
        );

    });

    socket.on("typing", (username) => {

        socket.broadcast.emit("user-typing", username);

    });

    socket.on("stop-typing", () => {

        socket.broadcast.emit("user-stop-typing");

    });
    

});
   

server.listen(PORT, () => {
    console.log(`🚀 NexChat Server Running on http://localhost:${PORT}`);
});
