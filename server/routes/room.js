const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find().sort({ _id: -1 }).limit(20);
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:roomId", async (req, res) => {
    try {
        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) return res.status(404).json({ error: "Room not found" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const roomId = Math.random().toString(36).substring(2, 10);
        const newRoom = await Room.create({ roomId, name: name || 'Untitled Room', language: "javascript" });
        res.json(newRoom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
