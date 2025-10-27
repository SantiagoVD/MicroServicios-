const productService = require('../services/productService');

const ProductController = {
  async list(req, res) {
    try {
      const products = await productService.listProducts();
      res.json(products);
    } catch (error) {
      console.error('Error en list:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async filter(req, res) {
    try {
      const { categoria, marca } = req.query;
      const products = await productService.filterProducts(categoria, marca);
      res.json(products);
    } catch (error) {
      console.error('Error en filter:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = ProductController;
