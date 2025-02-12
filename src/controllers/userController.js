const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserService.createUser({ name, email, password: hashedPassword });

    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    res.status(400).json({ error: 'Error creando el usuario' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Error obteniendo los usuarios' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(400).json({ error: 'Error obteniendo el usuario' });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUser = await UserService.updateUser(req.params.id, {
      name,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: 'Usuario actualizado', updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Error actualizando el usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error eliminando el usuario' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar token con el id del usuario
    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

    // Enviar también el id y los datos del usuario para tablas que dependes de usuario
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
