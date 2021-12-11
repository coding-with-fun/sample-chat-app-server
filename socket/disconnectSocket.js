const { broadcastMessageToAllExceptSender } = require("./messageSocket");

const disconnectSocket = (socket) => {
    socket.on("disconnect", () => {
        broadcastMessageToAllExceptSender({
            socket,
            message: `${socket.name} has left the room.`,
        });

        console.log("User has left the socket.", socket.name, socket.room);
    });
};

module.exports = disconnectSocket;
