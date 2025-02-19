const bookService = require("../services/bookService");

/**
 * Obtener los matches del usuario logeado
 */
const getUserMatches = async (req, res) => {
  try {
    const { userId } = req.params; // El userId ahora viene del cliente
    if (!userId) {
      return res.status(400).json({ error: "Se requiere userId" });
    }

    const matches = await bookService.getUserMatches(userId);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar el estado de un match
 */
const updateMatchState = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId, match_state } = req.body; // userId viene en el body

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
    const { userId } = req.body; // userId viene en el body

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
  getUserMatches,
  updateMatchState,
  deleteMatch,
};
