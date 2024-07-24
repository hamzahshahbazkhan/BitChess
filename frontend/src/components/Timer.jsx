import React, { useState, useEffect } from 'react';

export const Timer = ({ m, s, ms, moveCount, color, started }) => {
    const [minute, setMinute] = useState(m);
    const [second, setSecond] = useState(s);
    const [millisecond, setMillisecond] = useState(ms);
    const [start, setStart] = useState(false);

    // Reset the timer values whenever the props change
    useEffect(() => {
        setMinute(m);
        setSecond(s);
        setMillisecond(ms);
    }, [m, s, ms]);

    // Determine whether to start the timer based on moveCount and color
    useEffect(() => {
        if ((moveCount % 2 === 0 && color === 'w') || (moveCount % 2 !== 0 && color === 'b')) {
            setStart(true);
        } else {
            setStart(false);
        }
    }, [moveCount, color]);

    // Timer countdown logic
    useEffect(() => {
        let interval;

        if (!started) {
            return
        }

        if (start) {
            interval = setInterval(() => {
                setMillisecond((prevMilliseconds) => {
                    if (prevMilliseconds > 0) {
                        return prevMilliseconds - 10;
                    } else {
                        setSecond((prevSeconds) => {
                            if (prevSeconds > 0) {
                                return prevSeconds - 1;
                            } else {
                                setMinute((prevMinutes) => {
                                    if (prevMinutes > 0) {
                                        return prevMinutes - 1;
                                    } else {
                                        clearInterval(interval);
                                        return 0;
                                    }
                                });
                                return 59;
                            }
                        });
                        return 990;
                    }
                });
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [start]);

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    return (
        <div className='text-amber-50 p-1 fond-medium pl-4 text-lg bg-zinc-700 shadow-inner shadow-zinc-950 rounded-lg'>
            {formatTime(minute)}:{formatTime(second)}:{millisecond < 100 ? `0${millisecond}`.slice(-3) : millisecond}
        </div>
    );
};
