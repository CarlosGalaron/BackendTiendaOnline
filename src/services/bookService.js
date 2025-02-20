const Book = require("../models/bookModel");
const Match = require("../models/matchModel");
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

  const query = `
    INSERT INTO matches (id_user1, id_user2, book1_id, book2_id)
    SELECT 
        b1.user_id AS id_user1,
        b2.user_id AS id_user2,
        b1.id AS book1_id,
        b2.id AS book2_id
    FROM books b1
    JOIN books b2 ON 
        b1.title = b2.title 
        AND b1.author = b2.author 
        AND b1.type = '${type}' 
        AND b2.type = '${oppositeType}'
        AND b1.user_id != b2.user_id
    WHERE b1.id = ${id} OR b2.id = ${id};
  `;

  try {
    await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });

    // Buscar el match recién insertado
    const [result] = await sequelize.query(
      `SELECT * FROM matches WHERE book1_id = ${id} OR book2_id = ${id} LIMIT 1;`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return result || null;
  } catch (error) {
    console.error("Error creando match:", error);
    return null;
  }
}

/**
 * Editar un libro en catálogo
 */
const updateCatalogBook = async (id, { title, author, book_state, ISBN }) => {
  return await Book.update(
    { title, author, book_state, ISBN },
    { where: { id, type: "catalogo" } }
  );
};

/**
 * Editar un libro en intercambio (solo si es oferta o solicitud)
 */
const updateExchangeBook = async (id, { title, author, book_state }) => {
  return await Book.update(
    { title, author, book_state },
    { where: { id, type: { [Op.in]: ["oferta", "solicitud"] } } }
  );
};

/**
 * Eliminar un libro por ID
 */
const deleteBook = async (id) => {
  return await Book.destroy({ where: { id } });
};

/**
 * Buscar libros con filtros (título, autor)
 */
const searchBooks = async ({ title, author }) => {
  const filters = {};
  if (title) filters.title = { [Op.iLike]: `%${title}%` };
  if (author) filters.author = { [Op.iLike]: `%${author}%` };

  return await Book.findAll({ where: filters });
};

/**
 * Obtener los matches de un usuario
 */
const getUserMatches = async (userId) => {
  try {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ id_user1: userId }, { id_user2: userId }],
      },
      attributes: ["id", "id_user1", "id_user2", "match_state"], // No incluimos los book_id, ya los tenemos en 'include'
      include: [
        {
          model: Book,
          as: "book1",
          attributes: ["id", "title", "author", "genre", "book_state", "type", "user_id"],
          include: [
            {
              model: User,
              attributes: ["id", "name"], // Obtener el nombre del usuario dueño del libro 1
            },
          ],
        },
        {
          model: Book,
          as: "book2",
          attributes: ["id", "title", "author", "genre", "book_state", "type", "user_id"],
          include: [
            {
              model: User,
              attributes: ["id", "name"], // Obtener el nombre del usuario dueño del libro 2
            },
          ],
        },
      ],
    });

    console.log("📄 Matches encontrados en la BD con libros y usuarios:", JSON.stringify(matches, null, 2));
    return matches;
  } catch (error) {
    console.error("❌ Error al obtener los matches:", error);
    throw error;
  }
};

module.exports = { getUserMatches };


/**
 * Actualizar el estado de un match (aceptado/rechazado)
 */
const updateMatchState = async (matchId, userId, match_state) => {
  const match = await Match.findByPk(matchId);
  if (!match) throw new Error("Match no encontrado.");

  // Verificar que el usuario es parte del match
  if (match.id_user1 !== userId && match.id_user2 !== userId) {
    return null; // No tiene permisos
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

  // Solo los involucrados pueden eliminar el match
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
  updateCatalogBook,
  updateExchangeBook,
  deleteBook,
  searchBooks,
  checkAndCreateMatch,
  getUserMatches,
  updateMatchState,
  deleteMatch,
};
