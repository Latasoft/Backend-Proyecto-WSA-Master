import app from "./app.js";
import { PORT } from "./config/config.js";
import http from 'http'
import {Server as SocketIOServer } from 'socket.io'
import { setSocketIO } from "./config/socket.js"; 
const server = http.createServer(app)

const io = new SocketIOServer(server,{
    cors:{origin:'*'}
});

io.on("connection", (socket) => {
    console.log(`Client Connected: ${socket.id}`);
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} se unió a la sala ${room}`);
    });
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
  
setSocketIO(io); // Asigna la instancia de Socket.io para usarla en otros módulos

  
server.listen(PORT,()=>{
    console.log("Servidor corriendo en puerto", PORT)
})  