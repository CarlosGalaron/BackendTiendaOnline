const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./src/config/db");
const chatHandler = require("./src/chatServer");

const app = require("./src/app");

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Iniciar conexión a DB relacional
sequelize.sync({ alter: true })
  .then(() => {
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error al iniciar la DB:", err));

// Iniciar WebSockets
chatHandler(io);
