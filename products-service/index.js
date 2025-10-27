require('dotenv').config();
const express = require('express');
const cors = require('cors');   // 👈 importar cors
const productRoutes = require('./routes/productRoutes');

const app = express();

// ✅ habilitar CORS
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Products service running on port ${PORT}`);
});
