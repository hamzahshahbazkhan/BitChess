
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket.js';
import { SocketProvider, useSocketContext } from '../context/SocketContext'
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from 'react';
import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { Topbar } from '../components/Topbar.jsx';
import axios from 'axios'
// import { useNavigate } from 'react-router-dom';
// import { Chessboard } from '../components/Chessboard';



export const Landing = () => {
    const [username, setUsername] = useState("Player");
    const [rating, setRating] = useState(1200);

    const navigate = useNavigate();
    // const socket = useSocketContext();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/signin");
        } else {
            getUserData();
        }
    }, [navigate]);

    const getUserData = async () => {
        try {
            const response = await axios.get('https://bitchess-za11.onrender.com/userinfo', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const { username, rating } = response.data.data;

            setUsername(username);
            setRating(rating);

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const initGame = () => {

        navigate("/game")
    }

    return (<div className='flex'>
        <Sidebar />
        <div className='flex flex-col h-screen bg-zinc-800 shadow-inner  shadow-zinc-900 w-screen '>


            <div className='flex flex-grow '>
                {/* <Sidebar /> */}
                <div className='flex justify-center items-center flex-grow gap-5 p-8'>
                    <div>
                        <div className='flex-3 justify-center items-center  bg-slate-700 rounded-lg'>

                            <div className='max-w-lg mt-16'>
                                <img src="/BOARD.png" alt="BOARD" />
                            </div>

                        </div>
                        <Topbar username={username} rating={rating} />

                    </div>


                    <div className='flex flex-col justify-center items-center w-2/5 bg-transparent text-amber-50 rounded-lg '>

                        <div className='w-48 h-48'>
                            <img src="/logo.png" alt="" />
                        </div>
                        <Heading label="Welcome to Bit Chess" className='p-2 m-2 text-amber-50 max-w-80 ' />
                        <SubHeading label="Challenge. Think. Win." className='p-2 m-2 text-amber-50 max-w-80' />


                        <button
                            className='text-amber-50 w-48 text-lg font-normal bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800'
                            onClick={initGame}
                        >
                            Play
                        </button>

                    </div>

                </div>
            </div>


        </div>
    </div>
    )
}