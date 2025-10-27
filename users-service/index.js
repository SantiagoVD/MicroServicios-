require('dotenv').config();
const express = require('express');
const cors = require('cors');   
const userRoutes = require('./routes/userRoutes');

const app = express();


app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// rutas
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
   console.log(`✅ Users service running on port ${PORT}`);
});
