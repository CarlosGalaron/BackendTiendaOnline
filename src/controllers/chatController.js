const chatService = require("../services/chatService");
const fs = require("fs");

const joinRoom = async (socket, { room, user1_id, user2_id }) => {
  try {
    if (!room) room = await chatService.generarLlaveUnica();
    let chat = await chatService.obtenerChat(room);
    if (!chat && user1_id && user2_id) {
      chat = await chatService.crearChat(room, user1_id, user2_id);
    }
    let historial = chat ? JSON.parse(chat.mensajes) : [];

    historial = historial.map((mensaje) => {
      if (mensaje.archivo && mensaje.nombreArchivo) {
        const filePath = `./uploads/${mensaje.nombreArchivo}`;
        if (chatService.verificarArchivoCaducado(filePath)) {
          mensaje.texto = "Archivo caducado";
          mensaje.archivo = null;
        }
      } 
      return mensaje;
    });

    socket.join(room);
    socket.emit("chat_history", historial);
  } catch (err) {
    console.error("❌ Error en join_room:", err);
    socket.emit("chat_error", "Error al unirse a la sala.");
  }
};

const sendMessage = async (socket, io, { room, usuario, texto }) => {
  try {
    const chat = await chatService.obtenerChat(room);
    if (!chat) return;
    let historial = JSON.parse(chat.mensajes);
    historial.push({ usuario, texto });
    await chatService.actualizarMensajes(room, historial);
    io.to(room).emit("chat_message", { usuario, texto });
  } catch (err) {
    console.error("❌ Error en chat_message:", err);
    socket.emit("chat_error", "Error al enviar el mensaje.");
  }
};

const sendFile = async (socket, io, { room, usuario, archivo, nombreArchivo, tipoArchivo }) => {
  try {
    io.to(room).emit("chat_file", { usuario, archivo, nombreArchivo, tipoArchivo });
    const chat = await chatService.obtenerChat(room);
    if (!chat) return;
    let historial = JSON.parse(chat.mensajes);
    historial.push({ usuario, texto: "Archivo caducado", archivo: null, nombreArchivo, tipoArchivo });
    await chatService.actualizarMensajes(room, historial);
  } catch (err) {
    console.error("❌ Error en chat_file:", err);
    socket.emit("chat_error", "Error al enviar el archivo.");
  }
};

const getUserChats = async (socket, usuarioId) => {
  try {
    const chats = await chatService.obtenerChatsDeUsuario(usuarioId);
    socket.emit("user_chats", chats);
  } catch (err) {
    console.error("❌ Error al obtener los chats del usuario:", err);
    socket.emit("chat_error", "Error al obtener los chats.");
  }
};

module.exports = { joinRoom, sendMessage, sendFile, getUserChats };
