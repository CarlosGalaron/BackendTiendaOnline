const Book = require("./bookModel");
const Match = require("./matchModel");
const User = require("./userModel");

// 🔗 Relación entre Book y User
Book.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Book, { foreignKey: "user_id" });

// 🔗 Relación entre Match y Book
Match.belongsTo(Book, { foreignKey: "book1_id", as: "book1" });
Match.belongsTo(Book, { foreignKey: "book2_id", as: "book2" });

// 🔗 Relación entre Book y Match
Book.hasMany(Match, { foreignKey: "book1_id", as: "matchesAsBook1" });
Book.hasMany(Match, { foreignKey: "book2_id", as: "matchesAsBook2" });

module.exports = { Book, Match, User }; // Exportamos para asegurarnos de que Sequelize las cargue correctamente
