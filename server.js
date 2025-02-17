//server.js
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/db");

const app = require('./src/app');

app.use(cors());
app.use(express.json());

// Servir imágenes desde la carpeta public/images
app.use("/images", express.static("/public/images"));

const PORT = process.env.PORT || 4000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to start server:", err));