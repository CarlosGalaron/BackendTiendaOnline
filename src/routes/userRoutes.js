// src/routes/userRoutes.js
const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/users/register', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Login
const { loginUser } = require('../controllers/userController');
router.post('/users/login', loginUser);

//rutas protegidas
const authenticateToken = require('../middlewares/authMiddleware');
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso autorizado' });
});

module.exports = router;
