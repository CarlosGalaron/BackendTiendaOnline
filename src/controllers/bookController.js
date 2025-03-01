//bookController.js
const bookService = require("../services/bookService");
const Book = require("../models/bookModel");



/**
 * Obtener todos los libros de tipo "catalogo"
 */
const getCatalogBooks = async (req, res) => {
  try {
    const books = await bookService.getAllCatalogBooks();
    res.json(books);
  } catch (error) {

    res.status(500).json({ error: "Error al obtener los libros del catálogo." });
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
    const { user_id, title, author, book_state, type } = req.body;

    if (!user_id || !title || !author || !book_state || !type) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    console.log("📌 Recibida nueva solicitud de intercambio:", req.body);

    // Registrar el libro y verificar si hay match
    const { book, match } = await bookService.createExchangeBook({
      user_id,
      title,
      author,
      book_state,
      type,
    });

    console.log("✅ Libro registrado con éxito:", book);

    if (match) {
      console.log("🎉 ¡Match creado!", match);
    } else {
      console.log("⚠️ No se encontró match en este momento.");
    }

    res.status(201).json({ message: "Libro registrado", book, match });

  } catch (error) {
    console.error("❌ Error en createExchangeBook:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
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


 const updateOffer = async (req, res) => {
  try {
    const offer = await Book.findOne({
      where: { id: req.params.id, type: "oferta" }
    });
    if (!offer) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    // Actualiza solo el título
    const updatedOffer = await offer.update({ title: req.body.title });
    res.json(updatedOffer);
  } catch (error) {
    console.error("Error en updateOffer:", error);
    res.status(500).json({ error: "Error al actualizar la oferta" });
  }
};


 const deleteOffer = async (req, res) => {
  try {
    const offer = await Book.findOne({
      where: { id: req.params.id, type: "oferta" }
    });
    if (!offer) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    await offer.destroy();
    res.json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteOffer:", error);
    res.status(500).json({ error: "Error al eliminar la oferta" });
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
  updateOffer,
  deleteOffer,
};
