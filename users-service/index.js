require('dotenv').config();
const express = require('express');
const cors = require('cors');   
const userRoutes = require('./routes/userRoutes');
const { logRequest } = require('./services/mongo');

const app = express();


app.use(cors({
  origin: true,
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

// rutas
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
   console.log(`✅ Users service running on port ${PORT}`);
});
