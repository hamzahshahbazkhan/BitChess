import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = 'https://bit-chess-api.vercel.app';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    const connectSocket = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        const newSocket = io(SOCKET_URL, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        newSocket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            alert('Connection error: ' + err.message);
            localStorage.removeItem("token");
            navigate("/signin");
        });

        newSocket.on('connect', () => {
            console.log("Socket connected successfully");
            setSocket(newSocket);
        });

        newSocket.on('disconnect', () => {
            console.log("Socket disconnected");
            setSocket(null);
        });

        return newSocket;
    };

    useEffect(() => {
        const newSocket = connectSocket();

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [navigate]);

    return [socket, setSocket, connectSocket];
};
