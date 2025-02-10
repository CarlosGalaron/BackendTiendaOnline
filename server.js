const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const bookRoutes = require("./src/routes/bookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Servir imágenes desde la carpeta public/images
app.use("/images", express.static("/public/images"));

// Rutas de la API
app.use("/api", userRoutes);
app.use("/api", bookRoutes);

const PORT = process.env.PORT || 4000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to start server:", err));
