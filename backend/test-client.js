const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("🟢 Conectado al servidor");
  socket.emit("pingHost", "46.231.32.19"); // IP pública de Google
});

socket.on("pingResult", (data) => {
  console.log("📡 Resultado del ping:", data);
  socket.disconnect();
});

socket.on("disconnect", () => {
  console.log("🔌 Desconectado del servidor");
});
