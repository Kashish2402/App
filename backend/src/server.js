import dotenv from "dotenv";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

const userSocketMap = {};
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user Connected ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  socket.on("sendMessage",(message)=>{
    console.log(`New Message Recieved ${JSON.stringify(message)}`)
    const receiverSocketId = getReceiverSocketId(message.recieverId);
    const senderSocketId = socket.id;
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    //Emit back to sender.
    if(senderSocketId){
      io.to(senderSocketId).emit("newMessage", message);
    }
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
