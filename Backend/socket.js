// Backend - socket.js
const socketIo = require("socket.io");
let io;

exports.init = (server) => {
  io = socketIo(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log("Client connected");
  });
};

exports.getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
