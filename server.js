const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

let sharedText = "";

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Send current document
  socket.emit("load-document", sharedText);

  // Update from user
  socket.on("send-changes", (delta) => {
    sharedText = delta;
    socket.broadcast.emit("receive-changes", delta);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
