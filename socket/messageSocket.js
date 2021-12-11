const emitMessage = ({ socket, user, message }) => {
    /**
     * MESSAGE is an event called from the Back-end.
     * It is used to send the messages to the Front-end.
     * It is just to the user who has joined the room.
     */
    socket.emit("message", {
        user,
        message,
    });
};

const broadcastMessageToAllExceptSender = ({ socket, message }) => {
    /**
     * MESSAGE is an event called from the Back-end.
     * It is used to send the messages to the Front-end.
     * It is from the user who has sent the message from the Front-end.
     * It is to all the sockets in the room except for the user who has joined the room.
     */
    socket.broadcast.to(socket.room).emit("message", {
        user: "admin",
        message,
    });
};

const broadcastMessageToAll = ({ io, socket, message }) => {
    /**
     * MESSAGE is an event called from the Back-end.
     * It is used to send the messages to the Front-end.
     * It is from the user who has sent the message from the Front-end.
     * It is to all the sockets in the room along with the user who has joined the room.
     */
    io.to(socket.room).emit("message", {
        user: socket.name,
        message,
    });
};

module.exports = {
    emitMessage,
    broadcastMessageToAllExceptSender,
    broadcastMessageToAll,
};
