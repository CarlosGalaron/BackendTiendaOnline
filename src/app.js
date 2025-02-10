// app.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Importamos userRoutes
const bookRoutes = require('./routes/bookRoutes'); // Importamos bookRoutes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes); // Rutas de usuarios
app.use('/api/books', bookRoutes); // Rutas de libros

module.exports = app;
