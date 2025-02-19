import dotenv  from "dotenv";
import { app } from "./app.js";
import http from "http"
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials:true
  },
});

const userSocketMap = {};
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


io.on("connection", (socket) => {
  console.log("A user Connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id);
  });
});



export { io, app, server };
