const userRepository =  require('../repository/userRepository');

class UserService {
  async registerUser(nombre, correo, contrasena) {
    return await userRepository.create(nombre, correo, contrasena);
  }

  async loginUsuario(correo, contrasena){
    return await userRepository.loginUsuario(correo, contrasena);
  }

  async listUsers() {
    return await userRepository.findAll();
  }
}

module.exports = new UserService();