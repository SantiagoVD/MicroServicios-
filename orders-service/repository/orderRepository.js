const pool = require('../services/db');

class OrderRepository {
  async createOrder(usuario_id, total) {
    console.log('[orders][repo] insert order', { usuario_id, total });
    const [result] = await pool.query(
      'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
      [usuario_id, total]
    );
    return { id: result.insertId, usuario_id, total, estado: 'pendiente' };
  }

  async addItem(order_id, producto_id, cantidad, precio_unitario) {
    console.log('[orders][repo] insert item', { order_id, producto_id, cantidad, precio_unitario });
    const [result] = await pool.query(
      'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [order_id, producto_id, cantidad, precio_unitario]
    );
    return { id: result.insertId, order_id, producto_id, cantidad, precio_unitario };
  }

  async getOrdersByUser(usuario_id) {
    const [rows] = await pool.query(
      `SELECT p.id AS pedido_id, p.estado, p.total, p.fecha_creacion,
              pi.id AS item_id, pi.producto_id, pi.cantidad, pi.precio_unitario
       FROM pedidos p
       LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
       WHERE p.usuario_id = ?`,
      [usuario_id]
    );
    return rows;
  }

  async updateStatus(order_id, estado) {
    const [result] = await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, order_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new OrderRepository();
