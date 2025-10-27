const orderService = require('../services/orderService');

const OrderController = {
  async create(req, res) {
    try {
      const { usuario_id, total, items } = req.body;
      if (!usuario_id || !total || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'usuario_id, total e items son requeridos' });
      }

      const order = await orderService.createOrder(usuario_id, total, items);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async listByUser(req, res) {
    try {
      const { usuario_id } = req.params;
      const orders = await orderService.getOrdersByUser(usuario_id);
      res.json(orders);
    } catch (error) {
      console.error('Error en listByUser:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { order_id } = req.params;
      const { estado } = req.body;

      const updated = await orderService.updateOrderStatus(order_id, estado);
      if (!updated) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error en updateStatus:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = OrderController;
