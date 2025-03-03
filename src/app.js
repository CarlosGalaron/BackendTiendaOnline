// src/app.js
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const matchRoutes = require("./routes/matchRoutes");
const offersRoutes = require("./routes/offersRoutes");
const solicitudRoutes = require("./routes/solicitudRoutes");




const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes); // Rutas de usuarios
app.use("/api/books", bookRoutes); // Rutas de libros

app.use("/api/matches", matchRoutes); // Rutas de matches


const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api", paymentRoutes);

app.use("/api/books/offers", offersRoutes);
app.use("/api/books/solicitudes", solicitudRoutes);




module.exports = app;
