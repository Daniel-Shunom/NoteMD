// src/sockets/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Initiates the Socket.io connection.
 * @param token JWT token for authentication.
 */
export const initiateSocket = (token: string) => {
  if (socket) return;

  socket = io('http://localhost:5000', {
    auth: {
      token,
    },
    transports: ['websocket'], // Use WebSocket only
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
};

/**
 * Retrieves the Socket.io client instance.
 * @returns Socket instance or null.
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Disconnects the Socket.io client.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
