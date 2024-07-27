import { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from '../hooks/useSocket';
// import { INIT_GAME, MOVE, GAME_OVER } from '../constants/gameConstants';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../components/Heading';
import { Button } from '../components/Button';
import { Timer } from '../components/Timer';
import { Player } from '../components/Player';
import { Resign } from '../components/Resign';
import { Sidebar } from '../components/Sidebar';

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"
export const RESIGN = "resign"
export const ERROR = "error"
export const TIMER = "timer"
export const DRAW = "draw"
export const DRAW_ACC="drawAcc"

export const Game = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    console.log(socket)
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [color, setColor] = useState('w');
    const [oppColor, setOppColor] = useState('b')
    const [moveCount, setMoveCount] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState('')
    const [time, setTime] = useState({ m: 10, s: 0o0, ms: 0o0 })
    const [oppTime, setOppTime] = useState({ m: 10, s: 0o0, ms: 0o0 })
    const [timerStart, setTimerStart] = useState(false)

    const [error, setError] = useState(false)
    const [username, setUsername] = useState('Player')
    const [rating, setRating] = useState(1200)
    const [oppUsername, setOppUsername] = useState('Opponent')
    const [oppRating, setOppRating] = useState(1200)
    const [inCheck, setInCheck] = useState(false)
    const [highlightedSquares, setHighlightedSquares] = useState([])
    const [checkSquares, setCheckSquares] = useState('')
    const [drawReq, setDrawReq] = useState(false)
    const [drawOffered, setDrawOffered] = useState(false);
    console.log(time)
    console.log(oppTime)

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/signin");
        }
    }, [navigate]);

    useEffect(() => {
        if (!socket) {
            console.log("no socket")
            return;
        }

        try {
            socket.emit("message", {
                type: "init_game",
            });
            console.log("hello")
        } catch (error) {
            console.error('Error emitting "init_game" message:', error);
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleMessage = (data) => {
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
                    setUsername(newData.payload.username);
                    setRating(newData.payload.rating);
                    setOppUsername(newData.payload.oppUsername);
                    setOppRating(newData.payload.oppRating);
                    console.log(newData)


                    if (newData.payload.color === 'w') {
                        setColor('w');
                        setOppColor('b');
                        console.log("you are white");
                    } else {
                        setColor('b');
                        setOppColor('w');
                        console.log("you are black");
                    }
                    break;

                case MOVE:
                    let move = newData.payload.move;
                    setMoveCount(newData.moveCount);
                    let moves = newData.payload.moves;
                    console.log(newData)
                    setDrawOffered(false);


                    try {



                        chess.move(move);
                        if (chess.inCheck()) {
                            setInCheck(true);

                        } else {
                            setInCheck(false);
                        }
                        setHighlightedSquares([newData.payload.move.to, newData.payload.move.from])


                    } catch (e) {
                        console.error('Error processing move:', e);
                    }
                    console.log(moves);
                    console.log(chess.pgn())
                    setBoard(chess.board());
                    break;

                case GAME_OVER:
                    setWinner(newData.payload.winner);
                    setStarted(false);
                    setIsGameOver(true)
                    setTimerStart(false)
                    break;

                case RESIGN:
                    setWinner(newData.payload.winner);
                    setStarted(false);
                    setIsGameOver(true)
                    setTimerStart(false)
                    break;

                case DRAW_ACC:
                    setWinner("DRAW");
                    setStarted(false);
                    setIsGameOver(true)
                    setTimerStart(false)
                    break;
                case DRAW:
                    setDrawReq(true);
                    break;

                case ERROR:
                    console.log("HELLO THERE")
                    setError(true)
                    break;
                case TIMER:
                    setTimerStart(true);

                    if (color == 'w') {
                        setTime({ m: newData.time.minutes, s: newData.time.seconds, ms: newData.time.milliseconds });
                        setOppTime({ m: newData.oppTime.minutes, s: newData.oppTime.seconds, ms: newData.oppTime.milliseconds })
                    } else {
                        setOppTime({ m: newData.time.minutes, s: newData.time.seconds, ms: newData.time.milliseconds });
                        setTime({ m: newData.oppTime.minutes, s: newData.oppTime.seconds, ms: newData.oppTime.milliseconds })
                    }
                    break;

                default:
                    break;
            }
        };

        socket.on("message", handleMessage);

        return () => {
            // Clean up socket event listener
            socket.off("message", handleMessage);
        };
    }, [socket, chess]);

    const resign = () => {
        socket.emit("message", {
            type: "resign"
        });
    }

    const draw = () => {
        socket.emit("message", {
            type: "draw"
        })
        setDrawOffered(true)
    }

    const acceptDraw=()=>{
        socket.emit("message", {
            type: "drawAcc"
        })
    }

    const playAgain = () => {
        navigate('/game', { replace: true });
        window.location.reload();
    }
    const home = () => {
        navigate('/')
    }
    const formatPGN = (pgn) => {
        // Split the string by spaces
        const words = pgn.split(' ');

        // Initialize a new array to hold formatted lines
        let formattedLines = [];
        let line = '';

        // Iterate over the words
        words.forEach((word, index) => {
            // Append the word to the line
            line += (index > 0 ? ' ' : '') + word;

            // If the line contains more than three words, add it to the formatted lines
            if ((index + 1) % 3 === 0) {
                formattedLines.push(line);
                line = '';
            }
        });

        // Add any remaining text in the last line
        if (line) {
            formattedLines.push(line);
        }

        // Join the formatted lines with new lines
        return formattedLines.join('\n');
    }


    // if (!started) {
    //     return <div>Finding an opponent....</div>;
    // }

    return (
        <div className='flex'>
            <Sidebar />

            <div className="flex flex-row h-screen w-screen shadow-inner  shadow-zinc-900 justify-center items-center pl-8 bg-zinc-800">
                <div>
                    <Player username={oppUsername} rating={oppRating} winner={winner} color={color} player='o' isGameOver={isGameOver} />

                    <div className='rounded-lg overflow-hidden flex justify-center shadow-md shadow-zinc-700 items-center mr-9'>
                        {/* <Timer m={time.m} s={time.s} ms={time.ms} /> */}
                        {!started && !isGameOver ?
                            <>

                                <Chessboard
                                    chess={chess}
                                    setBoard={setBoard}
                                    socket={socket}
                                    board={board}
                                    color={color}
                                    moveCount={moveCount}
                                    setMoveCount={setMoveCount}
                                    started={false}
                                />

                            </> : isGameOver ?
                                <div className={`border-4 o ${(winner === 'white' && color === 'w' || winner === 'black' && color === 'b') ? 'border-green-500' : (winner === 'white' && color === 'b' || winner === 'black' && color === 'w') ? 'border-red-500' : 'border-slate-500'}`}>
                                    <Chessboard
                                        chess={chess}
                                        setBoard={setBoard}
                                        socket={socket}
                                        board={board}
                                        color={color}
                                        moveCount={moveCount}
                                        setMoveCount={setMoveCount}
                                        started={false}
                                    />

                                </div> :
                                <>
                                    <Chessboard
                                        chess={chess}
                                        setBoard={setBoard}
                                        socket={socket}
                                        board={board}
                                        color={color}
                                        moveCount={moveCount}
                                        setMoveCount={setMoveCount}
                                        started={true}
                                        highlightedSquares={highlightedSquares}
                                        checkSquares={checkSquares}
                                        setDrawReq={setDrawReq} />
                                
                                </>
                        }
                        {/* <Timer m={time.m} s={time.s} ms={time.ms} /> */}
                    </div>
                    <Player username={username} rating={rating} winner={winner} color={color} player='p' isGameOver={isGameOver} socket={socket}/>

                </div>

                <div className='text-amber-50 '>
                    {error ? (<>
                        <p>A game already in progress</p>
                        <Button label='Go to Home' onClick={home} />
                    </>
                    ) : !started && !isGameOver ? (
                        <p className='text-xl font-normal'>Finding an opponent....</p>
                    ) : isGameOver ? (
                        <div>
                            <Heading label={`${winner} ${winner=='draw'?"":"won"}`}/>
                            <Timer m={oppTime.m} s={oppTime.s} ms={oppTime.ms} moveCount={moveCount} color={oppColor} started={timerStart} socket={socket}/>

                            <div className="max-w-full w-44 h-80 max-h-80 overflow-auto bg-zinc-700 shadow-inner shadow-zinc-950 text-amber-50 text-opacity-80 p-4 rounded-lg mt-4 mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">

                                <div>
                                    Moves:
                                </div>
                                <pre className="whitespace-pre-wrap">
                                    {chess.pgn()}
                                </pre>

                            </div>
                            <Timer m={time.m} s={time.s} ms={time.ms} moveCount={moveCount} color={color} started={timerStart} />

                            <Button label='Play Again' onClick={playAgain} />
                        </div>
                    ) : (
                        <div>
                            <Timer m={oppTime.m} s={oppTime.s} ms={oppTime.ms} moveCount={moveCount} color={oppColor} started={timerStart} socket={socket} />

                            <div className="max-w-full w-44 h-80 max-h-80 overflow-auto bg-zinc-700 shadow-inner shadow-zinc-950 text-amber-50 text-opacity-80 p-4 rounded-lg mt-4 mb-4  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
                                <pre className="whitespace-pre-wrap">
                                    <div>
                                        Moves:
                                    </div>
                                    {chess.pgn()}
                                </pre>
                            </div>
                            <Timer m={time.m} s={time.s} ms={time.ms} moveCount={moveCount} color={color} started={timerStart} socket={socket} />
                            <div className='flex flex-col'>
                            {drawReq ? <Button label='Accept Draw' onClick={acceptDraw} /> : drawOffered?<Button label='Draw Offered'/> :<Button label='Offer Draw' onClick={draw} />}
                                
                                <Resign label='Resign' onClick={resign} className="hover:bg-red-500" />
                            </div>


                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}