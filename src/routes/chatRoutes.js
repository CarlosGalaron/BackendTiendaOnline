const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/user/:id", async (req, res) => {
  try {
    const chats = await chatController.getUserChats(req.params.id);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los chats" });
  }
});

module.exports = router;
