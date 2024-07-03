const { Server } = require('socket.io');
const { INIT_GAME, MOVE, GAME_OVER } = require('./messages');
const { Game } = require('./Game');

class GameManager {

    constructor(io) {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
        this.io = io;
    }

    addUser(socket) {
        console.log("User Added")
        this.users.push(socket);
        this.initSocketEvents(socket);
    }

    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }

    initSocketEvents(socket) {
        console.log(socket.id);
        socket.on("message", (data) => {
            const newData = (data);
            if (newData.type == INIT_GAME) {
                //console.log("hello this is good ")
                if (this.pendingUser === null) {
                    this.pendingUser = socket;
                } else {
                    socket.join(this.pendingUser.id);
                    console.log("The room is: ")
                    console.log(this.pendingUser.id)
                    let room = this.pendingUser.id;
                    const game = new Game(this.pendingUser, socket, room);
                    this.games.push(game);
                    this.pendingUser = null;
                }
            } else if (newData.type == MOVE) {
                const game = this.games.find(game => game.player1.id == socket.id || game.player2.id == socket.id)
                try {
                    game.makeMove(socket, newData.payload.move)
                }
                catch (error) {
                    console.log(error)
                    return
                }
            } else if (newData.type == GAME_OVER) {
                console.log("Inside game over")
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
                this.player1.leave(game.room)
                this.player2.leave(game.room)
            }

        })

    }
}



module.exports = {
    GameManager
}