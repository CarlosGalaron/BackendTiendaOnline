const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Chat = sequelize.define(
  "Chat",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numRoom: { type: DataTypes.STRING, allowNull: false },
    user1_id: { type: DataTypes.INTEGER, allowNull: false },
    user2_id: { type: DataTypes.INTEGER, allowNull: false },
    mensajes: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "chats", timestamps: false }
);

module.exports = Chat;
