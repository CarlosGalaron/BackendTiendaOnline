const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Payment = db.define("Payment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    total_books: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    account_number: { type: DataTypes.STRING(50), allowNull: false },
    cvc: { type: DataTypes.STRING(10), allowNull: false },
    card_expiry: { type: DataTypes.STRING(10), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    delivery_address: { type: DataTypes.STRING(255), allowNull: false },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

module.exports = Payment;
