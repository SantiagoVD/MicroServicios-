const pool = require('../services/db');

class UserRepository {
  async create(nombre, correo, contrasena, rol = 'usuario') {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contrasena, rol]
    );
    return { id: result.insertId, nombre, correo, rol };
  }

  async loginUsuario(correo, contrasena) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? AND contrasena_hash = ?',
      [correo, contrasena]
    );
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
