const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Asegúrate de que este archivo exporte tu instancia de Sequelize
const User = require("./userModel");

const Offer = sequelize.define("Offer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
    type: DataTypes.ENUM("Nuevo", "Como nuevo", "Usado", "Dañado"),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: "offers",
  timestamps: true,
});

module.exports = Offer;
