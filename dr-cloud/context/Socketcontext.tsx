// src/context/SocketContext.tsx

import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { PrescriptionData } from '../types/types'; // Corrected import path

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ensure the key matches where the token is stored

    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token, // Send the token during the Socket.io handshake
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Connected to Socket.io server');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from Socket.io server:', reason);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket.io connection error:', err.message);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    } else {
      console.error('Authentication token missing in localStorage.');
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Custom hook to use the SocketContext.
 * @returns SocketContextProps containing the socket instance.
 */
export const useSocket = (): SocketContextProps => {
  return useContext(SocketContext);
};
