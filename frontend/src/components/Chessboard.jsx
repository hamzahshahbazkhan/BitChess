import { useState, useEffect } from "react";
import { MOVE } from "../screens/Game";

export const Chessboard = ({ chess, board, socket, setBoard, color, moveCount, setMoveCount, started, setDrawReq }) => {
    const [from, setFrom] = useState(null);
    const [checkKingSquare, setCheckKingSquare] = useState(null);

    const findKing = (color) => {
        const board = chess.board();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const square = board[i][j];
                if (square && square.type === 'k' && square.color === color) {
                    return String.fromCharCode(97 + j) + (8 - i);
                }
            }
        }
        return null;
    };

    const updateCheckKingSquare = () => {
        const whiteKingSquare = findKing('w');
        const blackKingSquare = findKing('b');
        const inCheck = chess.isCheck();
        const isWhiteInAttack = chess.isAttacked(whiteKingSquare, 'b')
        const isBlackInAttack = chess.isAttacked(blackKingSquare, 'w')
        const isWhiteCheckmated = chess.isGameOver() && !chess.isDraw === false && isWhiteInAttack;
        const isBlackCheckmated = chess.isGameOver() && !chess.isDraw === false && isBlackInAttack;


        if (inCheck && isWhiteInAttack || isWhiteCheckmated) {
            setCheckKingSquare(whiteKingSquare);
        } else if (inCheck && isBlackInAttack || isBlackCheckmated) {
            setCheckKingSquare(blackKingSquare);
        } else {
            setCheckKingSquare(null);
        }
    };

    useEffect(() => {

        updateCheckKingSquare();

    }, [started, moveCount, chess]);

    const handleClick = (squareRep) => {
        if (!from && started) {
            setFrom(squareRep);
        } else {
            if ((moveCount % 2 === 0 && color === 'w') || (moveCount % 2 !== 0 && color === 'b')) {
                try {
                    chess.move({ from, to: squareRep, promotion: 'q' });
                    setBoard(chess.board());
                    setMoveCount(moveCount + 1);

                    updateCheckKingSquare();

                    socket.emit("message", {
                        type: MOVE,
                        payload: {
                            move: {
                                from,
                                to: squareRep,
                                promotion: 'q'
                            }
                        }
                    });

                    setFrom(null);
                    setDrawReq(false);
                } catch (e) {
                    //console.log(e);
                    setFrom(null);
                }
            } else {
                //console.log("not your move");
            }
        }
    };

    const getSquareClass = (squareRep, i, j) => {
        const isKingInCheck = squareRep === checkKingSquare;
        const isActive = from === squareRep;
        const baseClass = (i + j) % 2 === 0 ? "bg-emerald-100" : "bg-emerald-600";
        const activeClass = isActive ? (i + j) % 2 === 0 ? "bg-orange-300 opacity-95" : "bg-orange-400 opacity-95" : "";

        return isKingInCheck ? "bg-red-500" : `${baseClass} ${activeClass}`;
    };

    if (color === 'w') {
        return (
            <div className="flex">
                <div>
                    {board.map((row, i) => (
                        <div key={i} className="flex">
                            {row.map((square, j) => {
                                const squareRep = String.fromCharCode(97 + j) + (8 - i);
                                return (
                                    <div
                                        onClick={() => handleClick(squareRep)}
                                        key={j}
                                        className={`flex ${getSquareClass(squareRep, i, j)} h-16 w-16 justify-center items-center align-middle`}>
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
                                        className={`flex ${getSquareClass(squareRep, i, j)} h-16 w-16 justify-center items-center align-middle`}>
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
