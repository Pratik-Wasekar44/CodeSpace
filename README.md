# CodeSpace - Real-Time Collaborative Code Editor

A professional-grade real-time collaborative code editor built using **Node.js, Express, Socket.io, WebRTC, MongoDB, and Monaco Editor**.  
CodeSpace allows multiple users to join the same room, edit code seamlessly with live synchronization, see each other's cursors, and communicate face-to-face using built-in video conferencing.

---

## 🚀 Features

- **Multi-Room Architecture:** Create and join distinct collaborative rooms.
- **Real-Time Code Synchronization:** Instantaneous code updates across all connected clients.
- **Multi-File Support:** Create, edit, and delete multiple files within a single room.
- **Live User Presence & Cursors:** See exactly where others are typing with color-coded, username-labeled cursors.
- **WebRTC Video Calling:** Native, low-latency peer-to-peer video conferencing built right into the editor.
- **Authentication System:** Secure user registration and login using JWT and bcrypt.
- **User Dashboard:** Manage and view your collaborative sessions.
- **MongoDB Integration:** Robust, scalable storage for rooms, files, and users.
- **Modern UI/UX:** High-contrast dark theme with premium glassmorphic design principles.
- **Code Execution:** Execute code directly from the editor (via Piston API or local execution).

---

## 🛠 Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Glassmorphic Design), Monaco Editor (VS Code engine)
- **Backend:** Node.js, Express.js
- **Real-Time & Signaling:** Socket.io
- **Video Conferencing:** WebRTC (Peer-to-Peer)
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs

---

## ▶️ How To Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI.

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Pratik-Wasekar44/CodeSpace.git
cd CodeSpace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following:
```env
MONGO_URI=mongodb://127.0.0.1:27017/collab-editor
JWT_SECRET=your_jwt_secret_here
```
*(You can refer to `.env.example` if available)*

4. Start the server:
```bash
npm run dev
# or
node server/server.js
```

5. Open in browser:
Navigate to `http://localhost:3000` to access the application. You can sign up, log in, view your dashboard, and join a collaborative room.

---

## 📌 Future Improvements

- Operational Transform (OT) / CRDT for advanced conflict resolution
- Cloud deployment and scalable microservices architecture
- Enhanced Role-based access control (Admin, Viewer, Editor)
- Language Server Protocol (LSP) integration for advanced auto-complete and linting
