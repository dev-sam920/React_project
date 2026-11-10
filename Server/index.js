require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI || '');
};

const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());


app.get('/', async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: 'ok',
      message: 'Keepy API is running',
      database: 'connected',
    });
  } catch (err) {
    let message = err.message;
    const connectionString = process.env.MONGO_URI;

    if (connectionString) {
      message = message.split(connectionString).join('[REDACTED]');
    }

    message = message.replace(/mongodb(?:\+srv)?:\/\/\S+/gi, '[REDACTED]');

    res.status(500).json({
      status: 'error',
      database: 'not connected',
      reason: `${err.name}: ${message}`,
    });
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
