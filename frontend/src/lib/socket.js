import { io } from 'socket.io-client';
import { getApiUrl } from '../config/environment.js';

let socket = null;

export function connectSocket(token) {
  if (socket && socket.connected) return socket;
  const API_BASE = getApiUrl();
  socket = io(API_BASE, { auth: { token }, transports: ['websocket'] });
  socket.on('connect_error', (err) => {
    console.warn('Socket connect_error', err);
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
