const express = require("express");
const socket = require("socket.io");
const http = require("http");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socket(server);

server.listen(5050, () => {
    console.log("Server is listening on port 5050");
});

app.use(router);

io.on("connection", (socket) => {
    console.log("We have a new connection.");

    socket.on("join", ({ name, room }, callback) => {
        console.log(name, room);

        const error = true;

        if (error) {
            callback({
                error: "There is an error!!",
            });
        }

        return () => {
            socket.emit("disconnect");

            socket.off();
        };
    });

    socket.on("disconnect", () => {
        console.log("User has left the socket.");
    });
});
