const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/chatapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// When client connects
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  // Send chat history
  const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
  socket.emit("chat-history", messages);

  // Save and broadcast message
  socket.on("chat-message", async (data) => {
    const message = new Message({ username: data.username, text: data.text });
    await message.save();
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
