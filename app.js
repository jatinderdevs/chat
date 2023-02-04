const express = require("express");
const path = require("path");
const app = express();

const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer(app);
const io = socketIO(server);
const user = {};

io.on("connection", (socket) => {
  socket.on("new-user-join", (name) => {
    user[socket.id] = name;
    socket.broadcast.emit("new-joine", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("getmsg", { message, name: user[socket.id] });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", user[socket.id]);
    delete user[socket.id];
  });
});

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view/chat.html"));
});

server.listen(3000, (req, res, next) => {
  console.log("listening");
});
