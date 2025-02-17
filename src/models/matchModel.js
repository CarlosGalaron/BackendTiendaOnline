// matchModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Se incrementa automáticamente en la base de datos
    },
    id_user1: {
      type: DataTypes.INTEGER,
      allowNull: false, // Usuario 1 involucrado en el intercambio
    },
    id_user2: {
      type: DataTypes.INTEGER,
      allowNull: false, // Usuario 2 involucrado en el intercambio
    },
    book1_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Libro ofrecido por el usuario 1
    },
    book2_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Libro ofrecido por el usuario 2
    },
  },
  {
    tableName: "matches",
    timestamps: false, // No guardamos automáticamente createdAt ni updatedAt
  }
);

module.exports = Match;
