const orderRepository = require('../repository/orderRepository');

class OrderService {
  async createOrder(usuario_id, total, items) {
    const order = await orderRepository.createOrder(usuario_id, total);

    for (const item of items) {
      await orderRepository.addItem(order.id, item.producto_id, item.cantidad, item.precio_unitario);
    }

    return order;
  }

  async getOrdersByUser(usuario_id) {
    return await orderRepository.getOrdersByUser(usuario_id);
  }

  async updateOrderStatus(order_id, estado) {
    return await orderRepository.updateStatus(order_id, estado);
  }
}

module.exports = new OrderService();  
