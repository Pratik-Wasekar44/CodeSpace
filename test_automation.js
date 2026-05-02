const { io } = require("socket.io-client");
const axios = require("axios");

async function run() {
    let roomId;
    try {
        const res = await axios.post("http://localhost:3000/api/rooms", { name: "Test Auto Room" });
        roomId = res.data.roomId;
        console.log("Room Created:", roomId);
    } catch(err) {
        console.error("Room creation failed:", err.message);
        process.exit(1);
    }

    const socketA = io("http://localhost:3000");
    const socketB = io("http://localhost:3000");

    socketA.on("connect", () => {
        socketA.emit("join-room", { roomId, username: "UserA" });
    });

    socketB.on("connect", () => {
        socketB.emit("join-room", { roomId, username: "UserB" });
    });

    let roomStateCount = 0;
    socketB.on("room-state", (data) => {
        roomStateCount++;
        if (roomStateCount === 1) { // Process only once when UserB joins
            console.log("UserB received room state:", JSON.stringify(data));
            setTimeout(() => {
                console.log("UserA creating test_api.js...");
                socketA.emit("file-created", "test_api.js");
            }, 500);
        }
    });

    socketB.on("file-created", (filename) => {
        console.log("UserB received file sync creation for:", filename);
        if (filename === "test_api.js") {
            setTimeout(() => {
                 console.log("UserA editing test_api.js...");
                 socketA.emit("code-change", { filename: "test_api.js", content: "console.log('Tested!');" });
            }, 500);
        }
    });

    socketB.on("code-change", (data) => {
        console.log("UserB received remote file code change:", JSON.stringify(data));
        if (data.filename === "test_api.js" && data.content === "console.log('Tested!');") {
            console.log("✅ Virtual File System and Sync verified perfectly!");
            process.exit(0);
        }
    });

    setTimeout(() => {
        console.error("❌ Test timed out. Something didn't sync.");
        process.exit(1);
    }, 5000);
}

run();
