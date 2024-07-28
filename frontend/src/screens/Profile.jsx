import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';

export const Profile = () => {
    const [userStats, setUserStats] = useState({
        username: "Loading...",
        rating: 1200,
        gamesPlayedAsWhite: 0,
        gamesPlayedAsBlack: 0,
        gamesWonAsWhite: 0,
        gamesLostAsWhite: 0,
        gamesWonAsBlack: 0,
        gamesLostAsBlack: 0,
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        totalGamesLost: 0
    });

    const navigate = useNavigate();

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
            //console.log(response.data);

            const { username, rating, gamesDrewAsWhite, gamesDrewAsBlack, gamesWonAsWhite, gamesLostAsWhite, gamesWonAsBlack, gamesLostAsBlack } = response.data.data;
            const totalGamesDrew = gamesDrewAsBlack + gamesDrewAsWhite
            const gamesPlayedAsBlack = gamesWonAsBlack + gamesLostAsBlack + gamesDrewAsBlack
            const gamesPlayedAsWhite = gamesWonAsWhite + gamesLostAsWhite + gamesDrewAsWhite
            const totalGamesWon = gamesWonAsBlack + gamesWonAsWhite;
            const totalGamesLost = gamesLostAsWhite + gamesLostAsBlack;
            const totalGamesPlayed = gamesPlayedAsWhite + gamesPlayedAsBlack

            setUserStats({
                username,
                rating,
                gamesPlayedAsWhite,
                gamesPlayedAsBlack,
                gamesWonAsWhite,
                gamesLostAsWhite,
                gamesWonAsBlack,
                gamesLostAsBlack,
                totalGamesPlayed,
                totalGamesWon,
                totalGamesLost
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <div className='flex max-h-screen'>
            <Sidebar />
            <div className='flex flex-col max-h-screen bg-zinc-800 shadow-inner shadow-zinc-900 w-screen'>
                <div className='flex flex-grow'>
                    <div className='flex justify-center items-center flex-grow gap-5 pt-2 p-8'>
                        <div className='flex flex-col justify-center items-center w-2/5 bg-transparent text-amber-50 rounded-lg'>
                            <div className='flex flex-col justify-center items-center text-lg font bg-transparent text-amber-50 rounded-lg p-0'>
                                <div className='pt-0 p-4 rounded-lg shadow-inner shadow-zinc-950'>
                                    <p className='text-3xl  font-bold p-4 ' > STATISTICS</p>
                                    <div className='space-y-2'>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Username</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.username}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Rating</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.rating}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Games as White</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.gamesPlayedAsWhite}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Games as Black</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.gamesPlayedAsBlack}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Games Won as White</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.gamesWonAsWhite}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Games Lost as White</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.gamesLostAsWhite}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Games Won as Black</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.gamesWonAsBlack}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Games Lost as Black</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.gamesLostAsBlack}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Total Games Played</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.totalGamesPlayed}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Total Games Won</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.totalGamesWon}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Total Games Lost</div>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>{userStats.totalGamesLost}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex-3 justify-center items-center bg-slate-700 rounded-lg'>
                                <div className='max-w-lg mt-16'>
                                    <img src="/BOARD.png" alt="BOARD" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
