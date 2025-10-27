const cartService = require('../services/cartService');

const CartController = {
  async createCart(req, res) {
    try {
      const { usuario_id } = req.body;
      if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
      }

      const cart = await cartService.createCart(usuario_id);
      res.status(201).json(cart);
    } catch (error) {
      console.error('Error en createCart:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async addItem(req, res) {
    try {
      const { carrito_id, producto_id, cantidad } = req.body;
      if (!carrito_id || !producto_id || !cantidad) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const item = await cartService.addItem(carrito_id, producto_id, cantidad);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en addItem:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getCart(req, res) {
    try {
      const { usuario_id } = req.params;
      const cart = await cartService.getCartByUser(usuario_id);
      res.json(cart);
    } catch (error) {
      console.error('Error en getCart:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async removeItem(req, res) {
    try {
      const { item_id } = req.params;
      const deleted = await cartService.removeItem(item_id);

      if (!deleted) {
        return res.status(404).json({ error: 'Item no encontrado' });
      }

      res.json({ message: 'Item eliminado del carrito' });
    } catch (error) {
      console.error('Error en removeItem:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = CartController;
