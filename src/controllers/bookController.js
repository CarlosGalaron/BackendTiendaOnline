const bookService = require("../services/bookService");

/**
 * Obtener todos los libros de tipo "catalogo"
 */
const getCatalogBooks = async (req, res) => {
  try {
    const books = await bookService.getAllCatalogBooks();
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los libros del catálogo." });
  }
};

/**
 * Obtener los libros de intercambio (ofertas y solicitudes) de un usuario
 */
const getUserExchangeBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const books = await bookService.getExchangeBooksByUser(userId);
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los libros de intercambio del usuario.",
      });
  }
};

/**
 * Registrar un libro en el catálogo
 */
const createCatalogBook = async (req, res) => {
  try {
    const { user_id, title, author, book_state, ISBN } = req.body;
    const newBook = await bookService.createCatalogBook({
      user_id,
      title,
      author,
      book_state,
      ISBN,
    });
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al registrar el libro en el catálogo." });
  }
};

/**
 * Registrar un libro para intercambio (oferta o solicitud)
 */
const createExchangeBook = async (req, res) => {
  try {
    const { user_id, type, title, author, book_state } = req.body;
    const newBook = await bookService.createExchangeBook({
      user_id,
      type,
      title,
      author,
      book_state,
    });
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(400)
      .json({
        error: error.message || "Error al registrar el libro para intercambio.",
      });
  }
};

/**
 * Editar un libro en el catálogo
 */
const editCatalogBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, book_state, ISBN } = req.body;
    const updated = await bookService.updateCatalogBook(id, {
      title,
      author,
      book_state,
      ISBN,
    });

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ error: "Libro no encontrado o sin cambios aplicados." });
    }

    res.json({ message: "Libro actualizado correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el libro del catálogo." });
  }
};

/**
 * Editar un libro en intercambio
 */
const editExchangeBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, book_state } = req.body;
    const updated = await bookService.updateExchangeBook(id, {
      title,
      author,
      book_state,
    });

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ error: "Libro no encontrado o sin cambios aplicados." });
    }

    res.json({ message: "Libro actualizado correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el libro de intercambio." });
  }
};

/**
 * Eliminar un libro
 */
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await bookService.deleteBook(id);

    if (deleted === 0) {
      return res.status(404).json({ error: "Libro no encontrado." });
    }

    res.json({ message: "Libro eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el libro." });
  }
};

/**
 * Buscar libros por título o autor
 */
const searchBooks = async (req, res) => {
  try {
    const { title, author } = req.query;
    const books = await bookService.searchBooks({ title, author });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error en la búsqueda de libros." });
  }
};

module.exports = {
  getCatalogBooks,
  getUserExchangeBooks,
  createCatalogBook,
  createExchangeBook,
  editCatalogBook,
  editExchangeBook,
  deleteBook,
  searchBooks,
};
