import React, { useState, useEffect } from 'react';

export const Timer = ({ m, s, ms, moveCount, color, started, socket }) => {
    const [minute, setMinute] = useState(m);
    const [second, setSecond] = useState(s);
    const [millisecond, setMillisecond] = useState(ms);
    const [start, setStart] = useState(false);
    // console.log(socket)

    useEffect(() => {
        setMinute(m);
        setSecond(s);
        setMillisecond(ms);
    }, [m, s, ms]);


    useEffect(() => {

        // if ((minute == 0 && second == 0 && millisecond == 0) && ((moveCount % 2 === 0 && color === 'w') || (moveCount % 2 !== 0 && color === 'b'))) {
        //     socket.emit("message", {
        //         type: "resign"
        //     });
        // }
        if ((moveCount % 2 === 0 && color === 'w') || (moveCount % 2 !== 0 && color === 'b')) {
            setStart(true);
        } else {
            setStart(false);
        }

    }, [moveCount, color, socket]);

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
