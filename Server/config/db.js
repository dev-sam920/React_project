const mongoose = require('mongoose');

let cached = global.mongooseCache;
if (!cached) cached = global.mongooseCache = { conn: null, promise: null };

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  if (!cached.promise || mongoose.connection.readyState === 0) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 5,
      })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
