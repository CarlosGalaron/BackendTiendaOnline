const chatController = require("./controllers/chatController");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔵 Usuario conectado:", socket.id);
    socket.on("join_room", (data) => chatController.joinRoom(socket, data));
    socket.on("chat_message", (data) => chatController.sendMessage(socket, io, data));
    socket.on("chat_file", (data) => chatController.sendFile(socket, io, data));
    socket.on("get_user_chats", (data) => chatController.getUserChats(socket, data));
    socket.on("disconnect", () => console.log("🔴 Usuario desconectado:", socket.id));
  });
};
