const bookService = require("../services/bookService");

const createBook = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Error creating book" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Error fetching book" });
  }
};

const getBooksByUser = async (req, res) => {
  try {
    const books = await bookService.getBooksByUser(req.params.userId);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user's books" });
  }
};

const updateBook = async (req, res) => {
  try {
    const updated = await bookService.updateBook(req.params.id, req.body);
    if (updated[0] === 0) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating book" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleted = await bookService.deleteBook(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting book" });
  }
};

const searchBooks = async (req, res) => {
  try {
    const books = await bookService.searchBooks(req.query);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Error searching books" });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  getBooksByUser,
  updateBook,
  deleteBook,
  searchBooks,
};
