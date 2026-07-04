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

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`🚀 NexChat Server Running on http://localhost:${PORT}`);
});