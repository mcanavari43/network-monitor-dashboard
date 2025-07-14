# network-monitor-dashboard

Aplicación Full Stack para monitorear dispositivos en una red local en tiempo real. Ejecuta pings a hosts/IPs definidos y muestra los resultados con latencia desde un panel web.

## 🚀 Tecnologías utilizadas

- 🔧 Backend: Node.js, Express, Socket.io
- 💻 Frontend: React (Vite)
- 🧪 Ping local vía shell (`ping` CLI)
- 📡 WebSockets para actualización en tiempo real

## 📦 Cómo ejecutar

```bash
# Clonar repositorio
git clone https://github.com/mcanavari43/network-monitor-dashboard.git
cd network-monitor-dashboard

# Backend
cd backend
npm install
node index.js
