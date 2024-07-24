import React, { useState, useEffect } from 'react';

export const Player = ({ username, rating, winner, color, player, isGameOver }) => {
    const [increment, setIncrement] = useState(null);
    const [incColor, setIncColor] = useState(null);

    useEffect(() => {
        if (player === 'p') {
            if ((winner === 'white' && color === 'w') || (winner === 'black' && color === 'b')) {
                setIncrement(" +10");
                setIncColor("text-emerald-500");
            } else if ((winner === 'white' && color === 'b') || (winner === 'black' && color === 'w')) {
                setIncrement(" -10");
                setIncColor("text-red-500");
            } else {
                setIncrement(" +0");
                setIncColor("text-abmer-50 opacity-70");
            }
        } else {
            if ((winner === 'white' && color === 'w') || (winner === 'black' && color === 'b')) {
                setIncrement(" -10");
                setIncColor("text-red-500");
            } else if ((winner === 'white' && color === 'b') || (winner === 'black' && color === 'w')) {
                setIncrement(" +10");
                setIncColor("text-emerald-500");
            } else {
                setIncrement(" +0");
                setIncColor("text-abmer-50 opacity-70");
            }
        }
    }, [winner, color, player]);

    return (
        <div className="rounded-md text-amber-50 text-lg font-md h-10 w-11/12 flex flex-row items-center ml-1 p-2 mt-2 mb-2 bg-zinc-700 shadow-inner shadow-zinc-950  justify-between">
            <div>
                {username}
            </div>

            <div className='flex'>
                <div className='mr-2'>
                    {rating}

                </div>
                {isGameOver ? (
                    <div className={`${incColor}`}>
                        {increment}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};
