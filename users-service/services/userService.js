const crypto = require('crypto');
const userRepository =  require('../repository/userRepository');

function hashPassword(password){
  // Simple SHA-256 hash; for production, use bcrypt/scrypt with salt
  return crypto.createHash('sha256').update(String(password || '')).digest('hex');
}

class UserService {
  async registerUser(nombre, correo, contrasena) {
    console.log('[users][service] register', { correo });
    const passwordHash = hashPassword(contrasena);
    return await userRepository.create(nombre, correo, passwordHash);
  }

  async loginUsuario(correo, contrasena){
    console.log('[users][service] login attempt', { correo });
    const user = await userRepository.findByCorreo(correo);
    if (!user) return null;
    const incomingHash = hashPassword(contrasena);
    const stored = user.contrasena_hash || '';
    const isMatch = incomingHash === stored || contrasena === stored; // allow legacy plain-text until data migrates
    if (!isMatch) return null;
    const { contrasena_hash, ...safeUser } = user;
    return safeUser;
  }

  async listUsers() {
    return await userRepository.findAll();
  }
}

module.exports = new UserService();
