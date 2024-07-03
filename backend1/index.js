const express = require('express');
const { createServer } = require("http");
const { GameManager } = require('./GameManager')
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});
const gameManager = new GameManager(io);

io.on("connection", (socket) => {
    //console.log(`User connected: ${socket.id}`);
    gameManager.addUser(socket);
    socket.on("disconnect", () => {
        gameManager.removeUser(socket);
    })
});

httpServer.listen(3000, () => {
    console.log("listening on 3000");
});