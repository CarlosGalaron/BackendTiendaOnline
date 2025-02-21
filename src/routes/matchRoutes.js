const express = require("express"); 
const router = express.Router();
const matchController = require("../controllers/matchController");

// Obtener los matches del usuario (ajustamos la ruta a `/user/:userId`)
router.get("/:userId", matchController.getUserMatches);

// Cambiar el estado de un match
router.put("/:matchId", matchController.updateMatchState);

// Eliminar un match
router.delete("/:matchId", matchController.deleteMatch);

module.exports = router;
