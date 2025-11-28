require('dotenv').config();
const express = require('express');
const cors = require('cors');   // 👈 importar cors
const orderRoutes = require('./routes/orderRoutes');
const { logRequest } = require('./services/mongo');

const app = express();

// ✅ habilitar CORS
app.use(cors({
  origin: true, // permitir localhost:5173 u otros frontends configurados
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Middleware de logging hacia MongoDB (no afecta la lógica si falla)
app.use((req, res, next) => {
  logRequest({
    accion: req.method,
    usuario: req.headers['x-user-id'] || req.headers['user-id'] || 'anon',
    ruta: req.originalUrl,
    fecha: new Date()
  });
  next();
});

// Rutas
app.use('/api/orders', orderRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`✅ Orders service running on port ${PORT}`);
});
