const { addUser } = require("../users");
const {
    emitMessage,
    broadcastMessageToAllExceptSender,
} = require("./messageSocket");

const joinRoom = (socket) => {
    /**
     * JOIN is an event called from the Front-end.
     * NAME & ROOM are passed as object from the Front-end.
     * It is used to join a new user to the room.
     */
    socket.on("join", ({ name, room }, callback) => {
        room = room.trim().toLowerCase();

        /**
         * socket.id is the user ID.
         */
        const { error } = addUser({
            id: socket.id,
            room,
            name,
        });

        /**
         * We store the user's name and room for future reference.
         */
        socket.name = name;
        socket.room = room;

        /**
         * If we have an error while adding the user, we call this callback.
         */
        if (error) {
            callback(error);
        }

        emitMessage({
            socket,
            user: "admin",
            message: `${socket.name}, welcome to the room ${socket.room}`,
        });

        broadcastMessageToAllExceptSender({
            socket,
            message: `${socket.name} has joined!`,
        });

        /**
         * The new socket is joined in the room.
         */
        socket.join(socket.room);

        /**
         * CALLBACK is used to execute some function on the Front-end after the above functions have been executed.
         */
        callback();
    });
};

module.exports = joinRoom;
