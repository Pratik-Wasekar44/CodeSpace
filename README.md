# CodeSpace - Real-Time Collaborative Code Editor

A real-time collaborative code editor built using **Node.js, Express, Socket.io, and Monaco Editor**.  
Multiple users can join the same room and edit code simultaneously with live synchronization and presence tracking.

---

## 🚀 Features

- Multi-room architecture
- Real-time code synchronization
- User presence tracking
- Live user counter
- JSON-based persistence (survives server restart)
- Monaco Editor (VS Code engine)
- Room-based collaboration via URL

---

## 🛠 Tech Stack

- Node.js
- Express
- Socket.io
- Monaco Editor
- Vanilla JavaScript

---

## ▶️ How To Run Locally

1. Clone the repository:

git clone https://github.com/satwikchoudhari/real-time-collabrative-editor-AI_assisatnce.git

2. Navigate into the project folder:

cd real-time-collabrative-editor-AI_assisatnce

3. Install dependencies:

npm install

4. Start the server:

node server/server.js

5. Open in browser:

http://localhost:3000/room/test

---

## 📌 Future Improvements

- MongoDB integration for scalable storage
- Operational Transform (OT) / CRDT for conflict resolution
- Cloud deployment
- Authentication system
- Role-based access control