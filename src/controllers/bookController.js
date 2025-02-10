const Book = require("../models/bookModel");

const createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null; // Guarda la URL de la imagen

    const newBook = await Book.create({
      title,
      author,
      genre,
      image: imageUrl,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error al crear el libro:", error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
};

module.exports = { createBook, getAllBooks };
