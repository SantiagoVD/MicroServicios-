const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', OrderController.create);                 // Crear pedido
router.get('/:usuario_id', OrderController.listByUser);   // Listar pedidos por usuario
router.patch('/:order_id/status', OrderController.updateStatus); // Cambiar estado

module.exports = router;
