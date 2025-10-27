const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.get('/', ProductController.list);              // GET /api/products
router.get('/:id', ProductController.getById);        // GET /api/products/5
router.get('/search/filter', ProductController.filter); // GET /api/products/search/filter?categoria=Laptop&marca=Dell

module.exports = router;
