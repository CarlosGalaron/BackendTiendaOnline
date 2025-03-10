const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    match_state: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "matches",
    timestamps: false,
  }
);

module.exports = Match; // Exportar sin definir relaciones aún
