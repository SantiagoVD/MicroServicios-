const userService = require('../services/userService');

const UserController = {
  async register(req, res) {
    try {
      const { nombre, correo, contrasena } = req.body;
      console.log('[users][controller] register request', { correo });

      if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const newUser = await userService.registerUser(nombre, correo, contrasena);
      console.log('[users][controller] user created', { userId: newUser.id, correo: newUser.correo });
      res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async login(req, res) {
    try {
      const { correo, contrasena } = req.body;
      console.log('[users][controller] login request', { correo });

      if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const loginUser = await userService.loginUsuario(correo, contrasena);

      if (!loginUser) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      res.status(200).json({
        message: 'Usuario verificado correctamente',
        user: loginUser
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async list(req, res) {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      console.error('Error en list:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = UserController;
