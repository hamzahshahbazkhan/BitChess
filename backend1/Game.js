const { Chess } = require('chess.js');
const { GAME_OVER, INIT_GAME, MOVE, TIMER, DRAW } = require('./messages');
const { Timer } = require('./Timer');
const { PrismaClient } = require('@prisma/client');
const { findUsername } = require('./dbHandle');

const prisma = new PrismaClient();

class Game {
    constructor(player1, player2, room) {
        this.gameDuration = 10 * 60 * 1000;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Color = 'w';
        this.player2Color = 'b';
        this.chess = new Chess();
        this.room = room;
        this.startTime = new Date();
        this.moveCount = 0;
        this.gameActive = true;
        this.timer = new Timer(this.gameDuration);
        this.oppTimer = new Timer(this.gameDuration);
        this.gameId = '';
        this.winner = null;
        this.user1 = null;
        this.user2 = null;

        this.initGame().then(() => {
            this.player1.emit("message", JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "w",
                    username: this.user1.username,
                    rating: this.user1.rating,
                    oppUsername: this.user2.username,
                    oppRating: this.user2.rating
                }
            }));

            this.player2.emit("message", JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "b",
                    username: this.user2.username,
                    rating: this.user2.rating,
                    oppUsername: this.user1.username,
                    oppRating: this.user1.rating
                }
            }));
            // this.timer.start();
        }).catch(err => {
            console.log('Error initializing game:', err);
        });
    }

    async makeMove(socket, move) {
        if (this.chess.isGameOver() || !this.gameActive) {
            return;
        }

        try {
            this.chess.move(move);
            // const { m, s, ms } = this.timer.elapsedTime();
            this.moveCount++;

            const opponentSocket = (this.player1 === socket) ? this.player2 : this.player1;
            const winner = (this.player1 === socket) ? "white" : "black";

            opponentSocket.emit("message", JSON.stringify({
                type: MOVE,
                payload: { move: move },
                moveCount: this.moveCount,

            }));
            opponentSocket.emit("message", JSON.stringify({
                type: TIMER,
                moveCount: this.moveCount,
                time: this.timer.getTime(),
                oppTime: this.oppTimer.getTime()
            }));
            socket.emit("message", JSON.stringify({
                type: TIMER,
                // payload: { move: move },
                moveCount: this.moveCount,
                time: this.timer.getTime(),
                oppTime: this.oppTimer.getTime()
            }));
            if (this.moveCount % 2 == 0) {
                this.timer.start();
                this.oppTimer.stop();
            } else {
                this.timer.stop();
                this.oppTimer.start();
            }


            if (this.chess.isGameOver()) {
                this.endGame(winner);
            }

            await this.updateMove();
        } catch (e) {
            console.error('Error making move:', e);
        }
    }

    async drawOffered(socket) {
        const opponentSocket = (this.player1 === socket) ? this.player2 : this.player1;
        opponentSocket.emit("message", JSON.stringify({
            type: DRAW,
            payload: { draw:"drawOffered" },
            moveCount: this.moveCount
        }))
    }

    async engageUsers() {
        const player1 = await findUsername(this.player1);
        const player2 = await findUsername(this.player2);

        try {
            await prisma.user.update({
                where: { username: player1 },
                data: { isPlaying: true }
            });
            await prisma.user.update({
                where: { username: player2 },
                data: { isPlaying: true }
            });
        } catch (e) {
            console.error('Error updating user statuses:', e);
        }
    }

    async initGame() {
        const player1 = await findUsername(this.player1);
        const player2 = await findUsername(this.player2);

        try {
            this.user1 = await prisma.user.findUnique({
                where: { username: player1 }
            });

            this.user2 = await prisma.user.findUnique({
                where: { username: player2 }
            });

            if (!this.user1 || !this.user2) {
                throw new Error('One or both users not found.');
            }

            const game = await prisma.game.create({
                data: {
                    whitePlayerId: this.user1.id,
                    blackPlayerId: this.user2.id,
                    status: "started",
                }
            });

            this.gameId = game.id;
        } catch (err) {
            console.error('Error initializing game:', err);
            throw err;
        }
    }

    async updateMove() {
        if (!this.gameId) {
            console.error('Game ID is not set.');
            return;
        }

        try {
            await prisma.game.update({
                where: { id: this.gameId },
                data: {
                    currentFen: this.chess.fen(),
                    moves: this.chess.pgn()
                }
            });
        } catch (err) {
            console.error('Error updating move:', err);
        }
    }

    async draw() {
        this.winner = DRAW
        this.gameActive = false;
        this.player1.emit("message", JSON.stringify({
            type: GAME_OVER,
            payload: { winner: "draw" }
        }));

        this.player2.emit("message", JSON.stringify({
            type: GAME_OVER,
            payload: { winner: "draw" }
        }));
        try {
            await prisma.game.update({
                where: { id: this.gameId },
                data: {
                    status: "completed",
                    result: 'draw',
                    endAt: new Date()
                }
            });

            await this.updatePlayerDraw();
        } catch (err) {
            console.error('Error ending game:', err);
        }
    }

    async endGame(winner) {
        this.winner = winner;
        this.gameActive = false;

        this.player1.emit("message", JSON.stringify({
            type: GAME_OVER,
            payload: { winner: winner }
        }));

        this.player2.emit("message", JSON.stringify({
            type: GAME_OVER,
            payload: { winner: winner }
        }));

        try {
            await prisma.game.update({
                where: { id: this.gameId },
                data: {
                    status: "completed",
                    result: winner,
                    endAt: new Date()
                }
            });

            await this.updatePlayerStats(winner);
        } catch (err) {
            console.error('Error ending game:', err);
        }
    }

    async updatePlayerStats(winner) {
        const player1 = await findUsername(this.player1);
        const player2 = await findUsername(this.player2);

        const winnerUsername = (winner === "white") ? player1 : player2;
        const loserUsername = (winner === "white") ? player2 : player1;

        try {
            await prisma.user.update({
                where: { username: winnerUsername },
                data: {
                    isPlaying: false,
                    rating: { increment: 10 },
                    gamesWonAsWhite: (winner === "white") ? { increment: 1 } : undefined,
                    gamesWonAsBlack: (winner === "black") ? { increment: 1 } : undefined,
                }
            });

            await prisma.user.update({
                where: { username: loserUsername },
                data: {
                    isPlaying: false,
                    rating: { decrement: 10 },
                    gamesLostAsWhite: (winner === "black") ? { increment: 1 } : undefined,
                    gamesLostAsBlack: (winner === "white") ? { increment: 1 } : undefined,
                }
            });
        } catch (err) {
            console.error('Error updating player stats:', err);
        }
    }

    async updatePlayerDraw() {
        const player1 = await findUsername(this.player1);
        const player2 = await findUsername(this.player2);


        try {
            await prisma.user.update({
                where: { username: player1.username },
                data: {
                    isPlaying: false,
                    rating: { increment: 10 },
                    gamesDrewAsWhite: (this.player1Color === "w") ? { increment: 1 } : undefined,
                    gamesDrewAsBlack: (this.player1Color === "b") ? { increment: 1 } : undefined,
                }
            });

            await prisma.user.update({
                where: { username: loserUsername },
                data: {
                    isPlaying: false,
                    rating: { decrement: 10 },
                    gamesDrewAsWhite: (this.player2Color === "b") ? { increment: 1 } : undefined,
                    gamesDrewAsBlack: (this.player2Color === "b") ? { increment: 1 } : undefined,
                }
            });
        } catch (err) {
            console.error('Error updating player stats:', err);
        }
    }

    resign(socket) {
        const winner = (this.player1 === socket) ? "black" : "white";
        this.endGame(winner);
        socket.disconnect();
    }
}

module.exports = {
    Game
};
