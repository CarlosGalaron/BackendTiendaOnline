const express = require("express");
const multer = require("multer");
const path = require("path");
const { createBook, getAllBooks } = require("../controllers/bookController");

const router = express.Router();

// Configurar multer para subir archivos a la carpeta public/images
const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Guardar con nombre único
  },
});

const upload = multer({ storage });

// Ruta para crear un libro con imagen (POST)
router.post("/books", upload.single("image"), createBook);

// Ruta para obtener todos los libros (GET)
router.get("/books", getAllBooks);

module.exports = router;
