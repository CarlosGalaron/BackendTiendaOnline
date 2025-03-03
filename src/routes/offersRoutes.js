// routes/offersRoutes.js
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Nota: Estas rutas operan sobre el modelo Book filtrado por type: "oferta"
router.put("/:id", bookController.updateOffer);
router.delete("/:id", bookController.deleteOffer);

module.exports = router;
