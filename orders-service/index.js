require('dotenv').config();
const express = require('express');
const cors = require('cors');   // 👈 importar cors
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ✅ habilitar CORS
app.use(cors({
  origin: "http://localhost:8080", // tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Rutas
app.use('/api/orders', orderRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`✅ Orders service running on port ${PORT}`);
});
