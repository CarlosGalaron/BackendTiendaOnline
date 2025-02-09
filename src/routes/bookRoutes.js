const express = require('express');
const {
  createBook,
  getAllBooks,
  getBookById,
  getBooksByUser,
  updateBook,
  deleteBook,
  searchBooks
} = require('../controllers/bookController');

const router = express.Router();

// Crear un libro
router.post('/books', createBook);

// Obtener todos los libros
router.get('/books', getAllBooks);

// Obtener un libro por ID
router.get('/books/:id', getBookById);

// Obtener todos los libros de un usuario
router.get('/books/user/:userId', getBooksByUser);

// Actualizar un libro
router.put('/books/:id', updateBook);

// Eliminar un libro
router.delete('/books/:id', deleteBook);

// Buscar libros con filtros
router.get('/books/search', searchBooks);

module.exports = router;
