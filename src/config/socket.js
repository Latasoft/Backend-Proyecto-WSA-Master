// src/config/socket.js
let ioInstance = null;

export const setSocketIO = (io) => {
  ioInstance = io;
};

export const getSocketIO = () => {
  if (!ioInstance) {
    throw new Error("SocketIO instance not set");
  }
  return ioInstance;
};
