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
    book_state: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.STRING,
    },
    ISBN: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM("offer", "request"), // Nuevo campo para identificar tipo de libro
      allowNull: false,
    },
  },
  {
    tableName: "books",
    timestamps: true,
  }
);

Book.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Book, { foreignKey: "user_id" });

module.exports = Book;
