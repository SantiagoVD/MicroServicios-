const productRepository = require('../repository/productRepository');

class ProductService {
  async listProducts() {
    return await productRepository.findAll();
  }

  async getProductById(id) {
    return await productRepository.findById(id);
  }

  async filterProducts(categoria, marca) {
    return await productRepository.findByFilters(categoria, marca);
  }
}

module.exports = new ProductService();
