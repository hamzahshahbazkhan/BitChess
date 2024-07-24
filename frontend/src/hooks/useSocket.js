import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Attempting to connect to socket");
        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        const socket = io(SOCKET_URL, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(socket)

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            alert('Connection error: ' + err.message);
            localStorage.removeItem("token");
            navigate("/signin");
        });

        socket.on('connect', () => {
            console.log("Socket connected successfully");
            setSocket(socket);
        });

        socket.on('disconnect', () => {
            console.log("Socket disconnected");
            setSocket(null);
        });

        return () => {
            console.log("Disconnecting socket");
            socket.disconnect();
        };
    }, [navigate]);

    return socket;
};
