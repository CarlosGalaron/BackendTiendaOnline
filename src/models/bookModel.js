const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel"); // Importar User, pero NO Match

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING, // URL de la imagen
      allowNull: true,
    },
    book_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("catalogo", "oferta", "solicitud"),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

module.exports = Book; // Exportar sin definir relaciones aún
