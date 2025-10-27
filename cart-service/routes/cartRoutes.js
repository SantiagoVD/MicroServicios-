const express = require('express');
const CartController = require('../controller/cartController');

const router = express.Router();

router.post('/create', CartController.createCart);         // Crear carrito
router.post('/add', CartController.addItem);               // Agregar producto
router.get('/:usuario_id', CartController.getCart);        // Ver carrito de un usuario
router.delete('/item/:item_id', CartController.removeItem); // Eliminar item

module.exports = router;
