const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const Chat = require("./models/Chat");
const Student = require("./models/Student");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

// --- SOCKET.IO ---
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    const newMessage = new Chat(data);
    await newMessage.save();
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// --- Generate Group Room ID ---
app.post("/generateRoom", (req, res) => {
  const { home, destination } = req.body;
  const routeString = `${home.coordinates.join(",")}-${destination.coordinates.join(",")}`;
  const roomId = crypto.createHash("md5").update(routeString).digest("hex");
  res.json({ roomId });
});

// --- Chat History ---
app.get("/chat/:roomId", async (req, res) => {
  try {
    const messages = await Chat.find({ room: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MongoDB Connection ---
mongoose.connect("mongodb://localhost:27017/studentCommute", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

server.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
