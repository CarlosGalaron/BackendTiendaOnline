const Book = require("../models/bookModel");
const { Op } = require("sequelize");

/**
 * Obtener todos los libros de tipo "catalogo"
 */
const getAllCatalogBooks = async () => {
  return await Book.findAll({ where: { type: "catalogo" } });
};

/**
 * Obtener todos los libros de un usuario cuando sean "oferta" o "solicitud"
 */
const getExchangeBooksByUser = async (userId) => {
  return await Book.findAll({
    where: {
      user_id: userId,
      type: { [Op.in]: ["oferta", "solicitud"] },
    },
    order: [['id', 'DESC']], // Orden por ID descendente
  });
};

/**
 * Crear un libro en catálogo
 */
const createCatalogBook = async ({ user_id, title, author, book_state, ISBN }) => {
  return await Book.create({
    user_id,
    type: "catalogo",
    title,
    author,
    book_state,
    ISBN,
  });
};

/**
 * Crear un libro en intercambio (oferta o solicitud)
 */
const createExchangeBook = async ({ user_id, type, title, author, book_state }) => {
  if (!["oferta", "solicitud"].includes(type)) {
    throw new Error("El tipo debe ser 'oferta' o 'solicitud'.");
  }
  return await Book.create({
    user_id,
    type,
    title,
    author,
    book_state,
  });
};

/**
 * Editar un libro en catálogo
 */
const updateCatalogBook = async (id, { title, author, book_state, ISBN }) => {
  return await Book.update(
    { title, author, book_state, ISBN },
    { where: { id, type: "catalogo" } }
  );
};

/**
 * Editar un libro en intercambio (solo si es oferta o solicitud)
 */
const updateExchangeBook = async (id, { title, author, book_state }) => {
  return await Book.update(
    { title, author, book_state },
    { where: { id, type: { [Op.in]: ["oferta", "solicitud"] } } }
  );
};

/**
 * Eliminar un libro por ID
 */
const deleteBook = async (id) => {
  return await Book.destroy({ where: { id } });
};

/**
 * Buscar libros con filtros (título, autor)
 */
const searchBooks = async ({ title, author }) => {
  const filters = {};
  if (title) filters.title = { [Op.iLike]: `%${title}%` };
  if (author) filters.author = { [Op.iLike]: `%${author}%` };

  return await Book.findAll({ where: filters });
};

module.exports = {
  getAllCatalogBooks,
  getExchangeBooksByUser,
  createCatalogBook,
  createExchangeBook,
  updateCatalogBook,
  updateExchangeBook,
  deleteBook,
  searchBooks,
};
