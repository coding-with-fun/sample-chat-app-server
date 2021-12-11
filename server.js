const express = require("express");
const http = require("http");
const router = require("./router");
const socketConnection = require("./socket/socketConnection");

const app = express();
const server = http.createServer(app);

server.listen(5050, () => {
    console.log("Server is listening on port 5050");
});

app.use(router);

socketConnection(server);
