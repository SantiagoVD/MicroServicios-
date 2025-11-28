const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || 'logs';

const logSchema = new mongoose.Schema({
  accion: { type: String, default: '' },
  usuario: { type: String, default: 'anon' },
  fecha: { type: Date, default: Date.now },
  ruta: { type: String, default: '' },
}, { collection: 'logs' });

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

let connectPromise = null;

async function connectMongo() {
  if (!MONGO_URI) {
    console.warn('[mongo] MONGO_URI no definido, se omite conexión');
    return null;
  }
  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGO_URI, { dbName: MONGO_DB })
      .then(() => {
        console.log('[mongo] conectado a', MONGO_DB);
        return mongoose.connection;
      })
      .catch((err) => {
        console.error('[mongo] error de conexión', err.message);
        connectPromise = null;
        return null;
      });
  }
  return connectPromise;
}

async function logRequest(entry) {
  try {
    const conn = await connectMongo();
    if (!conn) return;
    await Log.create(entry);
  } catch (err) {
    console.error('[mongo] error guardando log', err.message);
  }
}

module.exports = { connectMongo, logRequest, Log };
