
import { useState, useEffect } from 'react'
import { Chess } from "chess.js"
import { Chessboard } from "../components/Chessboard"
import { useSocketContext } from "../context/SocketContext"


export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"


export const Game = () => {

    const socket = useSocketContext();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board())
    const [started, setStarted] = useState(false);
    const [color, setColor] = useState('w');
    const [moveCount, setMoveCount] = useState(0)


    useEffect(() => {
        if (!socket) {
            return
        }

        async function handleMessage(data) {
            let newData;
            try {
                newData = typeof data === 'string' ? JSON.parse(data) : data;
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return;
            }

            switch (newData.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    setStarted(true);

                    if (newData.payload.color == 'w') {
                        setColor('w')
                        console.log("you are white")
                    } else {
                        setColor('b')
                        console.log("you are black")
                    }
                    break;

                case MOVE:
                    let move = newData.payload.move;
                    setMoveCount(newData.moveCount);
                    console.log(moveCount)

                    try {
                        chess.move(move);

                        console.log("hello")

                    } catch (e) {
                        console.log("Thiserror")
                        console.log(e)
                    }

                    setBoard(chess.board());
                    break;

                case GAME_OVER:
                    setStarted(false);
                    alert("WHITE WON")
                    break;

                default:
                    break;

            }
        }
        try {
            socket.on("message", handleMessage)

        } catch (e) {
            console.log(e)
        }
    }, [socket, chess])
    if (!socket) {
        return <div>
            Connecting....
        </div>
    }

    return <div className="flex flex-col h-screen justify-center items-center bg-slate-800">

        <div>
            <Chessboard chess={chess} setBoard={setBoard} socket={socket} board={board} color={color} moveCount={moveCount} setMoveCount={setMoveCount} />
        </div>
    </div>
}