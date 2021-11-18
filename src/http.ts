import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    transports: ["websocket", "polling"],
});

const PORT = process.env.PORT || 3001;

export { serverHttp, io, PORT };
