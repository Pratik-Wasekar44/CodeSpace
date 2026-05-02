const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    name: { type: String, default: "Untitled Room" },
    files: { type: [{ name: String, content: String }], default: [{ name: "main.js", content: "// Welcome to CodeSpace\n" }] },
    language: { type: String, default: "javascript" }
});

module.exports = mongoose.model("Room", RoomSchema);
