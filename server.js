const express = require("express");
const socket = require("socket.io");
const http = require("http");
const router = require("./router");
const { addUser, getUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

server.listen(5050, () => {
    console.log("Server is listening on port 5050");
});

app.use(router);

io.on("connect", (socket) => {
    console.log("We have a new connection.");

    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            room,
            userName: name,
        });

        if (error) {
            callback(error);
        }

        socket.emit("message", {
            user: "admin",
            text: `${user.userName}, welcome to the room ${user.room}`,
        });

        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.userName} has joined!`,
        });

        socket.join(user.room);

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", {
            user: user.userName,
            text: message,
        });

        callback();
    });

    socket.on("disconnect", () => {
        console.log("User has left the socket.");
    });
});
