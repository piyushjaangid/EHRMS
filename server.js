// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Mongoose Schema and Model
const recordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const Record = mongoose.model('Record', recordSchema);

// Routes
app.get('/api/status', (req, res) => {
  res.status(200).json({
    server: 'Server is running',
    mongo: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'MongoDB Disconnected',
    status: 'All systems are operational',
  });
});

app.post('/api/records', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  try {
    const newRecord = new Record({ name, email });
    await newRecord.save();
    res.status(201).json({ message: 'Record saved successfully', record: newRecord });
  } catch (error) {
    console.error('Error saving record:', error.message);
    res.status(500).json({ message: 'Failed to save record' });
  }
});

app.get('/api/records', async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching records:', error.message);
    res.status(500).json({ message: 'Failed to load records' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
