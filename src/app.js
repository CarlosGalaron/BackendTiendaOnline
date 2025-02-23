// src/app.js
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api", paymentRoutes);

const offersRoutes = require("./routes/offersRoutes");
app.use("/api/offers", offersRoutes);


module.exports = app;
