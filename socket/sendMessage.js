const { getUser } = require("../users");
const { broadcastMessageToAll } = require("./messageSocket");

const sendMessage = (socket, io) => {
    /**
     * SEND MESSAGE is an event called from the Front-end.
     * MESSAGE is passed a parameter from the Front-end.
     * It is used to send a message to all the sockets in the room.
     */
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        broadcastMessageToAll({
            io,
            socket,
            message,
        });

        /**
         * CALLBACK is used to execute some function on the Front-end after the above functions have been executed.
         */
        callback();
    });
};

module.exports = sendMessage;
