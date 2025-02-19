const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

// Obtener los matches del usuario (requiere enviar userId desde el frontend)
router.get("/:userId", matchController.getUserMatches);

// Cambiar el estado de un match (requiere userId en el body)
router.put("/:matchId", matchController.updateMatchState);

// Eliminar un match (requiere userId en el body)
router.delete("/:matchId", matchController.deleteMatch);

module.exports = router;
