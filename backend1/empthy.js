const { Chess } = require('chess.js')

const chess = new Chess()

while (!chess.isGameOver()) {
    const moves = chess.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    chess.move(move)
}
console.log(chess.pgn())
console.log(chess.fen())
console.log(chess.ascii())