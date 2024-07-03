
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket.js';
import { SocketProvider, useSocketContext } from '../context/SocketContext'
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
// import { Chessboard } from '../components/Chessboard';


export const Landing = () => {
    const navigate = useNavigate();
    const socket = useSocketContext();

    const initGame = () => {
        const Hello = socket.emit("message", {
            type: "init_game",
        });
        console.log(Hello);
        navigate("/game")
    }

    return (

        <div className='flex flex-col h-screen bg-slate-700'>

            <Navbar className='rounded-lg' />
            <div className='flex flex-grow'>
                {/* <Sidebar /> */}
                <div className='flex justify-center items-center flex-grow gap-5 p-8'>
                    <div className='flex-3 justify-center items-center w-3/5 bg-slate-700 rounded-lg'>
                        <img src="../public/BOARD.png" alt="BOARD" />
                    </div>
                    <div className='flex flex-col justify-center items-center w-2/5 bg-slate-700 rounded-lg '>
                        <button type="button" className="text-white h-10 w-15 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={initGame}>
                            Play
                        </button>
                    </div>
                </div>
            </div>


        </div>

    )
}