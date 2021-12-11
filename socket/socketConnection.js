const socket = require("socket.io");
const disconnectSocket = require("./disconnectSocket");
const sendMessage = require("./sendMessage");
const joinRoom = require("./joinRoom");

const socketConnection = (server) => {
    const io = socket(server);

    io.on("connection", (socket) => {
        console.log("We have a new connection.");

        joinRoom(socket);

        sendMessage(socket, io);

        disconnectSocket(socket);
    });
};

module.exports = socketConnection;
