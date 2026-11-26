// import 'dotenv/config';
// import express from 'express';
// import http from 'http';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { setupSocket } from './sockets/sockets.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5001;

// // 1. Express ko Node ke http server se joda (Socket.IO ke liye zaroori hai)
// const httpServer = http.createServer(app);

// // 2. public folder ki HTML file browser me dikhane ke liye
// app.use(express.static(path.join(__dirname, 'public')));

// // 3. Socket.IO setup function call kiya
// setupSocket(httpServer);

// // 4. Server start kiya (app.listen nahi, httpServer.listen!)
// httpServer.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


import 'dotenv/config'
import express from 'express'
import http from 'http'
import path from 'path'
import {fileURLToPath} from 'url'
import {setupSocket} from './sockets/sockets.js'

// import.meta.url current file path deti ha
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(import.meta.url)

const app = express()
const PORT  = 5001

const httpServer = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

setupSocket(httpServer)

httpServer.listen(5001, ()=>{
    console.log("server is running....5001")
})