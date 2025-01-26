// src/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga el archivo .env donde estan las credenciales de la base de datos

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST, //direccion donde se aloja el servidor de la aplicacion --> localhost (127.0.0.1)
        dialect: 'mysql', //dialecto de la base de datos --> mysql
        port: process.env.DB_PORT, // Puerto especificado en .env --> 3306 (si se deja vacio se usa el default)
    });

sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
