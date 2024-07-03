import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            setSocket(socket);
        });

        socket.on('disconnect', () => {
            setSocket(null);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return socket;
};
