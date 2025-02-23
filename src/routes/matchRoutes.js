const express = require("express"); 
const router = express.Router();
const matchController = require("../controllers/matchController");

// Obtener los matches completos del usuario logueado
router.get('/complete-matches', matchController.getCompleteMatches);

// Otras rutas de matches (actualizar estado, eliminar, etc.)
router.put('/:matchId/state', matchController.updateMatchState);
router.delete('/:matchId', matchController.deleteMatch);

module.exports = router;
