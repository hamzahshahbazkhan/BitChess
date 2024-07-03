const { Chess } = require('chess.js')
const { GAME_OVER, INIT_GAME, MOVE } = require('./messages')

class Game {
    constructor(player1, player2, room) {
        this.player1 = player1;
        this.player2 = player2;
        this.chess = new Chess();
        this.room = room;
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.emit("message", JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "w"
            }
        }));
        this.player2.emit("message", JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "b"
            }
        }));
    }

    makeMove(socket, move) {
        if (this.chess.isGameOver()) {
            return;
        } else {
            try {
                this.chess.move(move);
                this.moveCount++;

                if (this.chess.isGameOver()) {
                    this.player1.emit("message", JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                            "winner": "WHITE WON"
                        }
                    }))
                    this.player2.emit("message", JSON.stringify({
                        type: GAME_OVER,
                        payload: {
                            "winner": "WHITE WON"
                        }
                    }))
                } else {
                    if (this.player1 == socket) {
                        this.player2.emit("message", JSON.stringify({
                            type: MOVE,
                            payload: {
                                move: move,
                            },
                            moveCount: this.moveCount
                        }))
                    } else {
                        this.player1.emit("message", JSON.stringify({
                            type: MOVE,
                            payload: {
                                move: move,
                            },
                            moveCount: this.moveCount
                        }))
                    }
                }
            } catch (e) {
                console.log(e)
                console.log("Error")
            }

        }
    }

}


module.exports = {
    Game
}