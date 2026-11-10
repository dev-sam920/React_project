require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();


app.use(cors());
app.use(express.json());


connectDB();



app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Keepy API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
