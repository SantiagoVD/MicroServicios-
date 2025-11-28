const pool = require('../services/db');

class UserRepository {
  async create(nombre, correo, passwordHash, rol = 'usuario') {
    console.log('[users][repo] insert user', { correo, rol });
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, passwordHash, rol]
    );
    return { id: result.insertId, nombre, correo, rol };
  }

  async findByCorreo(correo) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows.length > 0 ? rows[0] : null;
  }

  async findAll() {
    const [rows] = await pool.query(
      'SELECT id, nombre, correo, rol, fecha_creacion FROM usuarios'
    );
    return rows;
  }
}

module.exports = new UserRepository();
