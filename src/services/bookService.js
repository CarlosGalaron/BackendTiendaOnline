const Book = require("../models/bookModel");

const getAllBooks = async () => {
  return await Book.findAll();
};

module.exports = { getAllBooks };
