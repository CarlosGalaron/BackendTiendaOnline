// controllers/offersController.js
const Book = require("../models/bookModel");

// Obtener todas las ofertas
exports.getOffers = async (req, res) => {
  try {
    const offers = await Book.findAll({ where: { type: "oferta" } });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ofertas" });
  }
};

// Obtener una oferta por ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Book.findOne({
      where: { id: req.params.id, type: "oferta" }
    });
    if (!offer) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la oferta" });
  }
};

// Crear una nueva oferta
exports.createOffer = async (req, res) => {
  try {
    // Aseguramos que el nuevo registro tenga type "oferta"
    const newOffer = await Book.create({ ...req.body, type: "oferta" });
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la oferta" });
  }
};

// Actualizar una oferta
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Book.findOne({
      where: { id: req.params.id, type: "oferta" }
    });
    if (!offer) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    await offer.update(req.body);
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la oferta" });
  }
};

// Eliminar una oferta
exports.deleteOffer = async (req, res) => {
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
    res.status(500).json({ error: "Error al eliminar la oferta" });
  }
};
