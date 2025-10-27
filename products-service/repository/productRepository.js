const pool = require('../services/db');

class ProductRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
  }

  async findByFilters(categoria, marca) {
    let query = 'SELECT * FROM productos WHERE 1=1';
    const params = [];

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (marca) {
      query += ' AND marca = ?';
      params.push(marca);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = new ProductRepository();
