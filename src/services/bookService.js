const Book = require("../models/bookModel");
const { Op } = require("sequelize");

const createBook = async (bookData) => {
  return await Book.create(bookData);
};

const getAllBooks = async () => {
  return await Book.findAll();
};

const getBookById = async (id) => {
  return await Book.findByPk(id);
};

const getBooksByUser = async (userId) => {
  return await Book.findAll({ where: { user_id: userId } });
};

const updateBook = async (id, bookData) => {
  return await Book.update(bookData, { where: { id } });
};

const deleteBook = async (id) => {
  return await Book.destroy({ where: { id } });
};

const searchBooks = async ({ title, author, genre, ISBN }) => {
  const filters = {};
  if (title) filters.title = { [Op.iLike]: `%${title}%` };
  if (author) filters.author = { [Op.iLike]: `%${author}%` };
  if (genre) filters.genre = genre;
  if (ISBN) filters.ISBN = ISBN;
  
  return await Book.findAll({ where: filters });
};

module.exports = { 
  createBook, 
  getAllBooks, 
  getBookById, 
  getBooksByUser, 
  updateBook, 
  deleteBook, 
  searchBooks 
};
