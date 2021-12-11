const express = require("express");
const socket = require("socket.io");
const http = require("http");
const router = require("./router");
const { addUser, getUser, removeUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

server.listen(5050, () => {
    console.log("Server is listening on port 5050");
});

app.use(router);

io.on("connection", (socket) => {
    console.log("We have a new connection.");

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

        /**
         * MESSAGE is an event called from the Back-end.
         * It is used to send the messages to the Front-end.
         * It is from admin.
         * It is just to the user who has joined the room.
         */
        socket.emit("message", {
            user: "admin",
            message: `${socket.name}, welcome to the room ${socket.room}`,
        });

        /**
         * MESSAGE is an event called from the Back-end.
         * It is used to send the messages to the Front-end.
         * It is from admin.
         * It is to all the sockets in the room except for the user who has joined the room.
         */
        socket.broadcast.to(socket.room).emit("message", {
            user: "admin",
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

    /**
     * SEND MESSAGE is an event called from the Front-end.
     * MESSAGE is passed a parameter from the Front-end.
     * It is used to send a message to all the sockets in the room.
     */
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

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

        /**
         * CALLBACK is used to execute some function on the Front-end after the above functions have been executed.
         */
        callback();
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);

        /**
         * MESSAGE is an event called from the Back-end.
         * It is used to send the messages to the Front-end.
         * It is from the user who has sent the message from the Front-end.
         * It is to all the sockets in the room along with the user who has joined the room.
         */
        io.to(socket.room).emit("message", {
            user: "admin",
            message: `${socket.name} has left the room.`,
        });

        console.log("User has left the socket.", socket.name, socket.room);
    });
});
