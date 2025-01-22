import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

// Basic Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await connectDB();
});
