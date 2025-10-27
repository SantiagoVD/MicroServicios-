require('dotenv').config();
const express = require('express');
const cors = require('cors');   // 👈 importar cors
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// ✅ habilitar CORS para que el frontend (http://localhost:8080) pueda acceder
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Rutas
app.use('/api/cart', cartRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`✅ Cart service running on port ${PORT}`);
});
