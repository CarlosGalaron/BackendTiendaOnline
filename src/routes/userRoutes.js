// src/routes/userRoutes.js
const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Login
const { loginUser } = require('../controllers/userController');
router.post('/login', loginUser);

//rutas protegidas
const authenticateToken = require('../middlewares/authMiddleware');
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso autorizado' });
});

module.exports = router;
