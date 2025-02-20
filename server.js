const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./src/config/db");
const chatHandler = require("./src/chatServer");

// Importar Express desde app.js
const app = require("./src/app");

// Importar asociaciones antes de sincronizar la DB
require("./src/models/associations");

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

// Crear servidor HTTP y WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Iniciar conexión a la base de datos
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error al iniciar la DB:", err));

// Iniciar WebSockets
chatHandler(io);
