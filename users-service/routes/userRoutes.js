const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Registrar usuario
router.post('/register', UserController.register);

// Login usuario
router.post('/login', UserController.login);

// Listar usuarios
router.get('/', UserController.list);

module.exports = router;
