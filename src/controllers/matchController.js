const bookService = require("../services/bookService");
const Match = require("../models/matchModel");

/**
 * Obtener los matches completos del usuario logueado
 */
const getCompleteMatches = async (req, res) => {
  try {
    // Obtener el userId desde los query parameters
    const userId = req.query.userId;

    // Verificar que el userId esté presente
    if (!userId) {
      return res.status(400).json({ success: false, message: "Se requiere el userId" });
    }

    // Llamar al servicio para obtener los matches completos
    const completeMatches = await bookService.findCompleteMatches(userId);

    // Devolver la respuesta con los matches completos
    res.status(200).json({ success: true, data: completeMatches });
  } catch (error) {
    console.error("Error obteniendo matches completos:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Actualizar el estado de un match
 */
const updateMatchState = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId, match_state } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Se requiere userId" });
    }

    if (typeof match_state !== "boolean") {
      return res.status(400).json({ error: "match_state debe ser true o false" });
    }

    const updatedMatch = await bookService.updateMatchState(matchId, userId, match_state);
    if (!updatedMatch) {
      return res.status(403).json({ error: "No tienes permiso para modificar este match" });
    }

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar un match
 */
const deleteMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Se requiere userId" });
    }

    const deleted = await bookService.deleteMatch(matchId, userId);
    if (!deleted) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este match" });
    }

    res.json({ message: "Match eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCompleteMatches,
  updateMatchState,
  deleteMatch,
};