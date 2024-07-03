import { useState } from "react";
import { MOVE } from "../screens/Game";

export const Chessboard = ({ chess, board, socket, setBoard, color, moveCount, setMoveCount }) => {
    const [from, setFrom] = useState(null);
    console.log(color)

    const handleClick = (squareRep) => {
        if (!from) {
            setFrom(squareRep);
        } else {
            if ((moveCount % 2 === 0 && color === 'w') || (moveCount % 2 !== 0 && color === 'b')) {


                try {

                    chess.move({ from, to: squareRep });
                    setBoard(chess.board());
                    setMoveCount(moveCount + 1)
                    // setMoveCount(moveCount + 1)

                    socket.emit("message", {
                        type: MOVE,
                        payload: {
                            move: {
                                from,
                                to: squareRep
                            }

                        }
                    });

                    setFrom(null);
                    //console.log(moveCount)

                }
                catch (e) {
                    console.log(e)
                    setFrom(null)
                }

            } else {
                console.log("not you move")
            }
        }
    };
    if (color == 'w') {
        return (
            <div className="flex rounded-md">
                <div>
                    {board.map((row, i) => (
                        <div key={i} className="flex">
                            {row.map((square, j) => {
                                const squareRep = String.fromCharCode(97 + (j % 8)) + (8 - i);
                                return (
                                    <div
                                        onClick={() => handleClick(squareRep)}
                                        key={j}
                                        className={`flex ${(i + j) % 2 === 0 ? "bg-blue-200" : "bg-blue-500"
                                            } h-16 w-16 justify-center items-center align-middle`}>
                                        {square ? <img className="w-12" src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()}1`}.png`} /> : null}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex rounded-md">
                <div>
                    {board.slice().reverse().map((row, i) => (
                        <div key={i} className="flex">
                            {row.slice().reverse().map((square, j) => {
                                const squareRep = String.fromCharCode(97 + (7 - j)) + (i + 1);
                                return (
                                    <div
                                        onClick={() => handleClick(squareRep)}
                                        key={j}
                                        className={`flex ${(i + j) % 2 === 0 ? "bg-blue-200" : "bg-blue-500"
                                            } h-16 w-16 justify-center items-center align-middle`}>
                                        {square ? <img className="w-12" src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()}1`}.png`} /> : null}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );

    }

};
