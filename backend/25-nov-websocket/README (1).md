# Socket.IO Basics (Super Beginner-Friendly Notes)

Yeh notes **bilkul zero-level beginners** ke liye banaye gaye hain. Isme sirf wahi **5 basic topics** hain jo real projects aur interviews me sabse zyada kaam aate hain — bina kisi confusing code ke!

---

## 🧠 1. HTTP vs WebSockets (Simple Example)

- **Normal HTTP (Letter bhejna):** Aap request bhejte ho, server reply deta hai, aur connection **band** ho jata hai. Agar naya data chahiye toh baar-baar refresh ya request karni padti hai.
- **WebSockets / Socket.IO (Phone Call):** Ek baar connection jud gaya toh **line khuli rehti hai**. Jab chahe client bole, jab chahe server bole — real-time me turant!

> **Express ke saath `http.createServer(app)` kyu likhte hain?**  
> Kyunki `app.listen()` sirf Express chalata hai. Socket.IO ko jodne ke liye Node ka asli `httpServer` chahiye hota hai, taaki Express aur Socket.IO dono **ek hi port (`5000`)** par chal sakein.

---

## 📋 2. Sirf Yeh 5 Cheezein Yaad Rakhni Hain

| Code | Matlab (Hindi me) | Example |
| :--- | :--- | :--- |
| `io.on('connection', (socket) => {})` | Jab naya user browser tab khole | Har user ko ek unique `socket.id` milti hai |
| `socket.emit('event', data)` | **Sirf MUJHE** bhejo (1 user) | *"Welcome to chat!"* |
| `io.emit('event', data)` | **SABKO** bhejo (Mujhe + Baaki sab) | Public group chat message |
| `socket.broadcast.emit('event', data)` | **Mujhe CHHODKAR baaki sabko** bhejo | *"Naya user join hua hai"* |
| `socket.join('room-1')` + `io.to('room-1').emit()` | **Sirf ek Room/Group** me baat karo | WhatsApp group ya Ludo/BGMI room |

> **Bonus Tip (Rooms):**  
> - `io.to('room-1').emit(...)` &rarr; Room ke **sabhi** logo ko jayega (sender ko bhi).  
> - `socket.to('room-1').emit(...)` &rarr; Room ke baaki logo ko jayega (**sender ko chhodkar**).

---

## 📁 3. Simple Folder Structure

```text
Web-Sockets/
├── sockets/
│   └── socket.js      # Saara Socket.IO ka code sirf is file me hai
├── public/
│   └── index.html     # Simple test page (HTML + CSS + JS ek saath)
├── .env
├── .env.example
├── package.json
├── server.js          # Express + HTTP Server + Socket.IO start karne ke liye
└── README.md
```

---

## 🛠️ 4. Installation

```bash
npm init -y
npm install express socket.io dotenv
npm install -D nodemon
```

---

## 📄 5. Exact Project Code (Line-by-Line Copy-Paste)

### A. `package.json`

```json
{
  "name": "websockets-socketio-basics",
  "version": "1.0.0",
  "description": "Beginner-friendly Socket.IO basics with Express.js (ES Modules)",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "dotenv": "^18.0.10",
    "express": "^5.3.0",
    "socket.io": "^4.8.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

---

### B. `.env.example`

```env
PORT=5000
```

---

### C. `sockets/socket.js`

```javascript
import { Server } from 'socket.io';

export const setupSocket = (httpServer) => {
  // Express server ke upar Socket.IO chalu kiya
  const io = new Server(httpServer);

  // 1. CONNECTION: Jab bhi koi user browser me page kholega, yeh chalega
  io.on('connection', (socket) => {
    console.log('✅ User Connected:', socket.id);

    // 2. socket.emit() -> Sirf IS naye user ko message bhejega
    socket.emit('message', `Welcome! Aapki Socket ID hai: ${socket.id}`);

    // 3. socket.broadcast.emit() -> Mujhe chhodkar BAAKI SABKO message bhejega
    socket.broadcast.emit('message', `🔔 Ek naya user (${socket.id}) chat me aaya!`);

    // 4. io.emit() -> SABHI users ko message bhejega (Sender + Baaki sab)
    socket.on('send-to-all', (text) => {
      io.emit('message', `🌍 [All] ${socket.id}: ${text}`);
    });

    // Broadcast button -> Mujhe chhodkar baaki sabko bhejega
    socket.on('send-broadcast', (text) => {
      socket.broadcast.emit('message', `📢 [Broadcast] ${socket.id}: ${text}`);
    });

    // 5. ROOMS -> Ek specific group/room join karne ke liye
    socket.on('join-room', (roomName) => {
      socket.join(roomName);
      socket.emit('message', `🚪 Aapne "${roomName}" room join kar liya!`);
      // Room ke baaki members ko batao (sender ko chhodkar)
      socket.to(roomName).emit('message', `👋 ${socket.id} ne "${roomName}" room join kiya`);
    });

    // Room chhodne ke liye
    socket.on('leave-room', (roomName) => {
      socket.leave(roomName);
      socket.emit('message', `🚶 Aapne "${roomName}" room chhod diya!`);
    });

    // Sirf us room ke sabhi members ko message bhejne ke liye
    socket.on('send-to-room', ({ roomName, text }) => {
      io.to(roomName).emit('message', `🏠 [Room: ${roomName}] ${socket.id}: ${text}`);
    });

    // 6. DISCONNECT: Jab user browser tab band karega
    socket.on('disconnect', () => {
      console.log('❌ User Disconnected:', socket.id);
      socket.broadcast.emit('message', `🔴 User (${socket.id}) chala gaya`);
    });
  });
};
```

---

### D. `server.js`

```javascript
import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSocket } from './sockets/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Express ko Node ke http server se joda (Socket.IO ke liye zaroori hai)
const httpServer = http.createServer(app);

// 2. public folder ki HTML file browser me dikhane ke liye
app.use(express.static(path.join(__dirname, 'public')));

// 3. Socket.IO setup function call kiya
setupSocket(httpServer);

// 4. Server start kiya (app.listen nahi, httpServer.listen!)
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

### E. `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Socket.IO Basics - Beginner Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      max-width: 650px;
      margin: 30px auto;
      padding: 20px;
    }
    .box {
      background: #1e293b;
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 16px;
    }
    input {
      padding: 9px;
      width: 60%;
      border-radius: 6px;
      border: 1px solid #475569;
      background: #0f172a;
      color: #fff;
    }
    button {
      padding: 9px 14px;
      border: none;
      border-radius: 6px;
      background: #2563eb;
      color: #fff;
      cursor: pointer;
      font-weight: bold;
      margin-top: 6px;
    }
    #messages {
      background: #020617;
      padding: 12px;
      border-radius: 8px;
      height: 220px;
      overflow-y: auto;
      font-size: 14px;
    }
    .msg {
      padding: 6px 8px;
      border-bottom: 1px solid #1e293b;
    }
  </style>
  <!-- Socket.IO automatically client library yahan serve karta hai -->
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <h2>⚡ Socket.IO Basics Demo</h2>
  <p id="my-id">Connecting...</p>

  <!-- 1. Global & Broadcast Section -->
  <div class="box">
    <h3>1. Global Chat & Broadcast</h3>
    <input id="msgInput" type="text" placeholder="Type a message..." />
    <br />
    <button onclick="sendToAll()">Send to All (io.emit)</button>
    <button onclick="sendBroadcast()" style="background: #d97706;">Broadcast (Except Me)</button>
  </div>

  <!-- 2. Rooms Section -->
  <div class="box">
    <h3>2. Rooms (Group Chat)</h3>
    <input id="roomInput" type="text" value="room-1" placeholder="Room name" />
    <button onclick="joinRoom()" style="background: #059669;">Join Room</button>
    <button onclick="leaveRoom()" style="background: #dc2626;">Leave Room</button>
    <br /><br />
    <input id="roomMsgInput" type="text" placeholder="Message for this room..." />
    <button onclick="sendToRoom()">Send to Room (io.to)</button>
  </div>

  <!-- 3. Messages Box -->
  <div class="box">
    <h3>Messages</h3>
    <div id="messages"></div>
  </div>

  <script>
    // Server se connect karo
    const socket = io();

    const myIdEl = document.getElementById('my-id');
    const messagesBox = document.getElementById('messages');

    // Jab connect ho jaye toh apni ID screen par dikhao
    socket.on('connect', () => {
      myIdEl.innerText = '✅ Connected! My Socket ID: ' + socket.id;
    });

    // Server se jab bhi 'message' event aaye, screen par add karo
    socket.on('message', (text) => {
      const div = document.createElement('div');
      div.className = 'msg';
      div.innerText = text;
      messagesBox.appendChild(div);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    });

    // 1. Sabko bhejo (io.emit)
    function sendToAll() {
      const input = document.getElementById('msgInput');
      if (!input.value.trim()) return;
      socket.emit('send-to-all', input.value);
      input.value = '';
    }

    // 2. Mujhe chhodkar baaki sabko bhejo (socket.broadcast.emit)
    function sendBroadcast() {
      const input = document.getElementById('msgInput');
      if (!input.value.trim()) return;
      socket.emit('send-broadcast', input.value);
      input.value = '';
    }

    // 3. Room join karo
    function joinRoom() {
      const roomName = document.getElementById('roomInput').value.trim();
      if (!roomName) return;
      socket.emit('join-room', roomName);
    }

    // 4. Room chhodo
    function leaveRoom() {
      const roomName = document.getElementById('roomInput').value.trim();
      if (!roomName) return;
      socket.emit('leave-room', roomName);
    }

    // 5. Sirf Room me message bhejo (io.to)
    function sendToRoom() {
      const roomName = document.getElementById('roomInput').value.trim();
      const input = document.getElementById('roomMsgInput');
      if (!roomName || !input.value.trim()) return;
      socket.emit('send-to-room', { roomName, text: input.value });
      input.value = '';
    }
  </script>
</body>
</html>
```

---

## 🚀 6. Class Me Live Test Kaise Karein?

1. Server start karein:
   ```bash
   npm run dev
   ```
2. Browser me **2 tabs** side-by-side kholein: `http://localhost:5000`
3. **Demo Step-by-Step:**
   - Tab 1 me *"Welcome"* aayega (`socket.emit`), aur Tab 2 kholte hi Tab 1 me *"Ek naya user aaya"* dikhega (`socket.broadcast.emit`).
   - **Send to All** dabao &rarr; Dono tabs me message aayega (`io.emit`).
   - **Broadcast** dabao &rarr; Sirf doosre tab me aayega, bhejne wale me nahi (`socket.broadcast.emit`).
   - Tab 1 me **Join Room** dabao (`room-1`), Tab 2 me **mat dabao** &rarr; Room message bhejne par sirf Tab 1 ko milega (`io.to(roomName).emit`)!
