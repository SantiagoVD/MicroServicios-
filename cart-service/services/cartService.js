const cartRepository = require('../repository/cartRepository');

class CartService {
  async createCart(usuario_id) {
    return await cartRepository.createCart(usuario_id);
  }

  async addItem(carrito_id, producto_id, cantidad) {
    return await cartRepository.addItem(carrito_id, producto_id, cantidad);
  }

  async getCartByUser(usuario_id) {
    return await cartRepository.getCartByUser(usuario_id);
  }

  async removeItem(item_id) {
    return await cartRepository.removeItem(item_id);
  }
}

module.exports = new CartService();
