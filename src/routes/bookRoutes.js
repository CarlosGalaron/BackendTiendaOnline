//bookRoutes
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Obtener todos los libros del catálogo
router.get("/catalog", bookController.getCatalogBooks);

// Obtener los libros de intercambio de un usuario específico
router.get("/exchange/:userId", bookController.getUserExchangeBooks);

// Registrar un libro en el catálogo
router.post("/catalog", bookController.createCatalogBook);

// Registrar un libro para intercambio (oferta o solicitud)
router.post("/register-exchange", bookController.createExchangeBook);

// Editar un libro del catálogo
router.put("/catalog/:id", bookController.editCatalogBook);

// Editar un libro de intercambio
router.put("/exchange/:id", bookController.editExchangeBook);

// Eliminar un libro por ID
router.delete("/:id", bookController.deleteBook);

// Buscar libros por título o autor
router.get("/search", bookController.searchBooks);

module.exports = router;
