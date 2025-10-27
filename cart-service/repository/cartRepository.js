const pool = require('../services/db');

class CartRepository {
  async createCart(usuario_id) {
    const [result] = await pool.query(
      'INSERT INTO carritos (usuario_id) VALUES (?)',
      [usuario_id]
    );
    return { id: result.insertId, usuario_id };
  }

  async addItem(carrito_id, producto_id, cantidad) {
    const [result] = await pool.query(
      'INSERT INTO carrito_items (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)',
      [carrito_id, producto_id, cantidad]
    );
    return { id: result.insertId, carrito_id, producto_id, cantidad };
  }

  async getCartByUser(usuario_id) {
    const [rows] = await pool.query(
      `SELECT c.id AS carrito_id, ci.id AS item_id, ci.producto_id, ci.cantidad
       FROM carritos c
       LEFT JOIN carrito_items ci ON c.id = ci.carrito_id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    );
    return rows;
  }

  async removeItem(item_id) {
    const [result] = await pool.query('DELETE FROM carrito_items WHERE id = ?', [item_id]);
    return result.affectedRows > 0;
  }
}

module.exports = new CartRepository();
