// src/models/associations.js
const Book = require('./bookModel');
const Match = require('./matchModel');
const User = require('./userModel');

// 🔗 Relación entre Book y User
Book.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Book, { foreignKey: 'user_id' });

// 🔗 Relación entre Match y Book (book1)
Match.belongsTo(Book, { foreignKey: 'book1_id', as: 'book1' });

// 🔗 Relación entre Match y Book (book2)
Match.belongsTo(Book, { foreignKey: 'book2_id', as: 'book2' });

// 🔗 Relación entre Match y User (user1)
Match.belongsTo(User, { foreignKey: 'id_user1', as: 'user1' });
User.hasMany(Match, { foreignKey: 'id_user1', as: 'matchesAsUser1' });

// 🔗 Relación entre Match y User (user2)
Match.belongsTo(User, { foreignKey: 'id_user2', as: 'user2' });
User.hasMany(Match, { foreignKey: 'id_user2', as: 'matchesAsUser2' });

module.exports = { Book, Match, User };