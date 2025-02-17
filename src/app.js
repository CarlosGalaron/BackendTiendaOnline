// src/app.js
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express(); // ✅ Se inicializa antes de usarlo

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes); // Rutas de usuarios
app.use("/api/books", bookRoutes); // Rutas de libros


const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api", paymentRoutes);



module.exports = app;

