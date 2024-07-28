const { Server } = require('socket.io');
const { INIT_GAME, MOVE, GAME_OVER, RESIGN, ERROR, DRAW, DRAW_ACC } = require('./messages');
const { Game } = require('./Game');
const { findUsername } = require('./dbHandle')

class GameManager {

    constructor(io) {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
        this.io = io;
        this.drawoffered = false;
        this.drawaccepted = false;
    }

    addUser(socket) {
        //console.log("User Added")
        this.users.push(socket);
        this.initSocketEvents(socket);
    }

    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }

    drawCheck() {

    }
    initSocketEvents(socket) {
        //console.log(socket.id);
        socket.on("message", (data) => {
            const newData = (data);
            if (newData.type == INIT_GAME) {
                ////console.log("hello this is good ")
                console.log("YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
                if (this.pendingUser === null) {
                    this.pendingUser = socket;
                } else if (findUsername(socket) === findUsername(this.pendingUser)) {
                    //console.log(findUsername(socket))
                    //console.log(findUsername(this.pendingUser))
                    socket.emit("message", JSON.stringify({
                        type: ERROR,
                        payload: {
                            msg: "YOU CANT PLAY AGAINST YOURSELF"
                        }
                    }));
                    //console.log("YOU caant play with yourself")

                }
                else {
                    const player1 = findUsername(socket);
                    const player2 = findUsername(this.pendingUser);
                    //console.log(socket)
                    //console.log(this.pendingUser)
                    socket.join(this.pendingUser.id);
                    //console.log("The room is: ")
                    //console.log(this.pendingUser.id)
                    let room = this.pendingUser.id;
                    const game = new Game(this.pendingUser, socket, room);
                    this.games.push(game);
                    game.engageUsers();




                    this.pendingUser = null;
                }
            } else if (newData.type == MOVE) {
                const game = this.games.find(game => game.player1.id == socket.id || game.player2.id == socket.id)
                try {
                    game.makeMove(socket, newData.payload.move)
                    this.drawoffered = false;
                    this.drawaccepted = false;
                }
                catch (error) {
                    //console.log(error)
                    return
                }
            } else if (newData.type == GAME_OVER) {
                //console.log("Inside game over")
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
                this.player1.leave(game.room)
                this.player2.leave(game.room)
            } else if (newData.type == RESIGN) {
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
                game.resign(socket)
                // this.player1.disconnect()
                // this.player2.disconnect()
                // socket.disconnect();
            } else if (newData.type == DRAW) {
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
                this.drawoffered = true;
                game.drawOffered(socket)
            } else if (newData.type == DRAW_ACC) {
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket)
                this.drawaccpted = true;
                game.draw()
            }

        })

    }
}



module.exports = {
    GameManager
}