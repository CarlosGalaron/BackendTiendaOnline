const { Op } = require("sequelize");
const Chat = require("../models/chatModel");
const generarLlave = require("../utils/generarLlave");
const fs = require("fs");

const existeChat = async (numRoom) => {
  return await Chat.findOne({ where: { numRoom } });
};

const generarLlaveUnica = async (longitud = 20) => {
  let llave;
  let existe;
  do {
    llave = generarLlave(longitud);
    existe = await existeChat(llave);
  } while (existe);
  return llave;
};

const obtenerChat = async (numRoom) => {
  return await Chat.findOne({ where: { numRoom } });
};

const crearChat = async (numRoom, user1_id, user2_id) => {
  return await Chat.create({ numRoom, user1_id, user2_id, mensajes: JSON.stringify([]) });
};

const actualizarMensajes = async (numRoom, mensajes) => {
  return await Chat.update({ mensajes: JSON.stringify(mensajes) }, { where: { numRoom } });
};

const obtenerChatsDeUsuario = async (usuarioId) => {
  return await Chat.findAll({ where: { [Op.or]: [{ user1_id: usuarioId }, { user2_id: usuarioId }] } });
};

const verificarArchivoCaducado = (filePath) => {
  if (!fs.existsSync(filePath)) return true;
  const fileStats = fs.statSync(filePath);
  return Date.now() - fileStats.mtimeMs > 24 * 60 * 60 * 1000;
};

module.exports = { existeChat, generarLlaveUnica, obtenerChat, crearChat, actualizarMensajes, obtenerChatsDeUsuario, verificarArchivoCaducado };
