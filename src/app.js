// src/app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

// Rutas de la API
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

module.exports = app;
