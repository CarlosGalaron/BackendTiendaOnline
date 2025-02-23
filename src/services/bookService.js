const Book = require("../models/bookModel");
const Match = require("../models/matchModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Obtener todos los libros de tipo "catalogo"
 */
const getAllCatalogBooks = async () => {
  return await Book.findAll({ where: { type: "catalogo" } });
};

/**
 * Obtener los libros de intercambio (ofertas y solicitudes) de un usuario
 */
const getExchangeBooksByUser = async (userId) => {
  return await Book.findAll({
    where: {
      user_id: userId,
      type: { [Op.in]: ["oferta", "solicitud"] },
    },
    order: [["id", "DESC"]],
  });
};

/**
 * Crear un libro en catálogo
 */
const createCatalogBook = async ({ user_id, title, author, book_state, ISBN }) => {
  return await Book.create({
    user_id,
    type: "catalogo",
    title,
    author,
    book_state,
    ISBN,
  });
};

/**
 * Crear un libro en intercambio (oferta o solicitud) y verificar matches
 */
const createExchangeBook = async ({ user_id, type, title, author, book_state }) => {
  if (!["oferta", "solicitud"].includes(type)) {
    throw new Error("El tipo debe ser 'oferta' o 'solicitud'.");
  }

  const book = await Book.create({ user_id, type, title, author, book_state });

  // Verificar y registrar un match si es posible
  const match = await checkAndCreateMatch(book);

  return { book, match };
};

/**
 * Comprueba si existen coincidencias entre ofertas y solicitudes de intercambio.
 * Si hay un match doble entre dos usuarios, lo registra en la tabla 'matches'.
 */
async function checkAndCreateMatch(newBook) {
  const { id, user_id, title, author, type } = newBook;
  const oppositeType = type === "oferta" ? "solicitud" : "oferta";

  // Buscar si ya existe un match recíproco
  const existingMatch = await sequelize.query(
    `SELECT * FROM matches 
     WHERE (book1_id = ${id} OR book2_id = ${id})`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (existingMatch.length > 0) {
    return null; // Ya hay un match, no lo duplicamos
  }

  // Buscar coincidencias de oferta y solicitud
  const reciprocalMatch = await sequelize.query(
    `SELECT b1.user_id AS id_user1, b2.user_id AS id_user2, 
            b1.id AS book1_id, b2.id AS book2_id
     FROM books b1
     JOIN books b2 ON 
        b1.title = b2.title 
        AND b1.author = b2.author 
        AND b1.type = '${type}' 
        AND b2.type = '${oppositeType}'
        AND b1.user_id != b2.user_id
     WHERE (b1.id = ${id} OR b2.id = ${id})
     LIMIT 1;`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (reciprocalMatch.length === 0) {
    return null; // No hay match recíproco
  }

  const match = reciprocalMatch[0];

  // Crear el match único con la reciprocidad completa
  await sequelize.query(
    `INSERT INTO matches (id_user1, id_user2, book1_id, book2_id) 
     VALUES (${match.id_user1}, ${match.id_user2}, ${match.book1_id}, ${match.book2_id})`,
    { type: sequelize.QueryTypes.INSERT }
  );

  // Devolver el match recién creado
  return await Match.findOne({
    where: { book1_id: match.book1_id, book2_id: match.book2_id }
  });
}

/**
 * Encontrar matches completos con información detallada de libros y usuarios
 */
async function findCompleteMatches(userId) {
  try {
    console.log("Buscando matches para el usuario:", userId); // Depuración

    // 1. Obtener todos los matches del usuario logueado (como user1 o user2)
    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { id_user1: userId },
          { id_user2: userId },
        ],
      },
      include: [
        {
          model: Book,
          as: 'book1',
          include: [{ model: User, attributes: ['id', 'name'] }],
        },
        {
          model: Book,
          as: 'book2',
          include: [{ model: User, attributes: ['id', 'name'] }],
        },
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'name'],
        },
      ],
    });

    // 2. Formatear la respuesta para el frontend
    const formattedMatches = matches.map((match) => {
      const isUser1 = match.id_user1 === userId;
      const miOferta = isUser1 ? match.book1 : match.book2;
      const suOferta = isUser1 ? match.book2 : match.book1;

      return {
        id: match.id,
        id_user1: match.id_user1,
        id_user2: match.id_user2,
        book1_id: match.book1_id,
        book2_id: match.book2_id,
        match_state: match.match_state,
        mi_oferta: {
          title: miOferta.title,
          author: miOferta.author,
          type: miOferta.type,
          state: miOferta.state,
          registrado_por: miOferta.User.id,
        },
        su_oferta: {
          title: suOferta.title,
          author: suOferta.author,
          type: suOferta.type,
          state: suOferta.state,
          registrado_por: suOferta.User.id,
        },
        user1: match.user1,
        user2: match.user2,
      };
    });

    console.log("Matches encontrados:", formattedMatches); // Depuración
    return formattedMatches;
  } catch (error) {
    console.error("Error en findCompleteMatches:", error);
    throw new Error(`Error finding complete matches: ${error.message}`);
  }
}

/**
 * Actualizar el estado de un match (aceptado/rechazado)
 */
const updateMatchState = async (matchId, userId, match_state) => {
  const match = await Match.findByPk(matchId);
  if (!match) throw new Error("Match no encontrado.");

  if (match.id_user1 !== userId && match.id_user2 !== userId) {
    return null;
  }

  match.match_state = match_state;
  await match.save();

  return match;
};

/**
 * Eliminar un match (si se rechaza)
 */
const deleteMatch = async (matchId, userId) => {
  const match = await Match.findByPk(matchId);
  if (!match) return null;

  if (match.id_user1 !== userId && match.id_user2 !== userId) {
    return null;
  }

  await match.destroy();
  return true;
};

module.exports = {
  getAllCatalogBooks,
  getExchangeBooksByUser,
  createCatalogBook,
  createExchangeBook,
  checkAndCreateMatch,
  findCompleteMatches,
  updateMatchState,
  deleteMatch,
};