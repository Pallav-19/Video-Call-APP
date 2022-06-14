const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
const routes = require("./routes/index.js");
app.use("/", routes);
io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });
  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });
  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
});
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`server running on http://localhost:${port}/`);
});
