import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to Socket.io server
        const socketInstance = io(import.meta.env.VITE_API || 'http://localhost:4000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketInstance.on('connect', () => {
            console.log('✅ Connected to WebSocket server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket server');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const value = {
        socket,
        isConnected
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
