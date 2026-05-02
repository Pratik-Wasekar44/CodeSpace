require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const executeRoutes = require("./routes/execute");
const Room = require("./models/Room");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/collab-editor")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("client"));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/execute", executeRoutes);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../client/index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "../client/auth.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "../client/dashboard.html")));
app.get("/room/:roomId", (req, res) => res.sendFile(path.join(__dirname, "../client/editor.html")));

const server = http.createServer(app);
const io = new Server(server);

function getColorFromUsername(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        // Make colors lighter for dark theme visibility
        value = Math.floor(value / 2) + 128;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

let roomUsers = {};

io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomId, username }) => {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.username = username || "Anonymous";
        socket.cursorColor = getColorFromUsername(socket.username);

        let room = await Room.findOne({ roomId });
        if (!room) {
            room = await Room.create({ roomId, name: "Untitled Room", files: [{ name: "main.js", content: "\n" }] });
        }

        if (!roomUsers[roomId]) roomUsers[roomId] = [];
        roomUsers[roomId].push({ username: socket.username, color: socket.cursorColor, id: socket.id });

        let filesObj = {};
        if (room.files && room.files.length > 0) {
            for (let file of room.files) {
                if (file.name) filesObj[file.name] = file.content;
            }
        } else {
            filesObj["main.js"] = "\n";
        }

        socket.emit("room-state", { files: filesObj, language: room.language });
        
        io.to(roomId).emit("user-count", roomUsers[roomId].length);
        io.to(roomId).emit("users-list", roomUsers[roomId].map(u => u.username));
        socket.to(roomId).emit("user-joined", `${socket.username} joined the room`);

        socket.on("code-change", async ({ filename, content }) => {
            let r = await Room.findOne({ roomId });
            if (r) {
                if(!r.files) r.files = [];
                let fileItem = r.files.find(f => f.name === filename);
                if (fileItem) fileItem.content = content;
                else r.files.push({ name: filename, content: content });
                await r.save();
                socket.to(roomId).emit("code-change", { filename, content });
            }
        });

        socket.on("file-created", async (filename) => {
            let r = await Room.findOne({ roomId });
            if (r) {
                if(!r.files) r.files = [];
                if (!r.files.find(f => f.name === filename)) {
                    r.files.push({ name: filename, content: "\n" });
                    await r.save();
                    io.to(roomId).emit("file-created", filename); // Broadcast creation
                }
            }
        });

        socket.on("file-deleted", async (filename) => {
            let r = await Room.findOne({ roomId });
            if (r && r.files) {
                r.files = r.files.filter(f => f.name !== filename);
                await r.save();
                io.to(roomId).emit("file-deleted", filename);
            }
        });

        socket.on("cursor-change", (data) => {
            socket.to(roomId).volatile.emit("cursor-change", { 
                filename: data.filename,
                position: data.position, 
                username: socket.username, 
                color: socket.cursorColor,
                id: socket.id
            });
        });

        socket.on("language-change", async (ext) => {
            await Room.findOneAndUpdate({ roomId }, { language: ext });
            socket.to(roomId).emit("language-change", ext);
        });

        socket.on("console-output", (output) => {
            socket.to(roomId).emit("console-output", output);
        });

        // WebRTC Signaling
        socket.on("webrtc-join", () => {
            socket.to(roomId).emit("webrtc-join", socket.id);
        });

        socket.on("webrtc-offer", (data) => {
            socket.to(data.to).emit("webrtc-offer", { from: socket.id, offer: data.offer });
        });

        socket.on("webrtc-answer", (data) => {
            socket.to(data.to).emit("webrtc-answer", { from: socket.id, answer: data.answer });
        });

        socket.on("webrtc-ice-candidate", (data) => {
            socket.to(data.to).emit("webrtc-ice-candidate", { from: socket.id, candidate: data.candidate });
        });
    });

    socket.on("disconnect", () => {
        const roomId = socket.roomId;
        if (roomId && roomUsers[roomId]) {
            roomUsers[roomId] = roomUsers[roomId].filter(u => u.id !== socket.id);
            io.to(roomId).emit("user-count", roomUsers[roomId].length);
            io.to(roomId).emit("users-list", roomUsers[roomId].map(u => u.username));
            io.to(roomId).emit("cursor-remove", socket.id);
            socket.to(roomId).emit("user-left", `${socket.username} left the room`);

            if (roomUsers[roomId].length === 0) {
                delete roomUsers[roomId];
            }
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});