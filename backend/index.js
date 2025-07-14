require('dotenv').config();
const PORT = process.env.PORT || 4000;
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { exec } = require('child_process');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('pingHost', (host) => {
exec(`ping -n 1 ${host}`, (err, stdout, stderr) => {
  if (err) {
    socket.emit("pingResult", { host, success: false });
  } else {
    // Buscar tiempo en la salida de Windows
    const timeMatch = stdout.match(/tiempo[=<]\s?(\d+)\s?ms/i) || stdout.match(/time[=<]?\s?(\d+)\s?ms/i);
    const time = timeMatch ? parseInt(timeMatch[1]) : null;

    socket.emit("pingResult", { host, success: true, latency: time });
  }
});

  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('🚀 Servidor backend corriendo en puerto 4000');
});
