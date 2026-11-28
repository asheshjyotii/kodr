import createApp from "./app.js";
import env from "./config/env.js";
import { Server } from "socket.io"
import logger from "./config/logger.js";
import http from "http"
import { connectDB } from "./database/mongodb.js";
import initSocket from "./socket/socket.js";

const app = createApp();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN.split(",").map((origin)=> origin.trim()), // string[]
    methods: ["GET", "POST"],
    credentials: true
  }
});

initSocket(io)

const startServer = () => {
    connectDB().then(()=>{
        httpServer.listen(env.PORT, ()=>{
            logger.info({ port: env.PORT }, "server running");
        })
    }).catch(err=>{
        logger.error({ error:err }, "error while running server")
    })
}

startServer();