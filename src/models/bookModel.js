const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

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
      type: DataTypes.STRING, // Solo para intercambio
      allowNull: true,
    },
    ISBN: {
      type: DataTypes.STRING, // Solo para intercambio
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("catalogo", "oferta", "solicitud"),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Solo necesario en intercambio
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "books",
    timestamps: true,
  }
);

// Relación solo si es intercambio
Book.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Book, { foreignKey: "user_id" });

module.exports = Book;
