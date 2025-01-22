import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    throw new Error("Database connection error");
  }
};

// Route to Check MongoDB Status
app.get("/api/db-status", async (req, res) => {
  const connectionStatus = mongoose.connection.readyState;
  switch (connectionStatus) {
    case 0:
      res.status(500).json({ message: "MongoDB Disconnected" });
      break;
    case 1:
      res.status(200).json({ message: "MongoDB Connected" });
      break;
    case 2:
      res.status(503).json({ message: "MongoDB Connecting" });
      break;
    case 3:
      res.status(500).json({ message: "MongoDB Disconnecting" });
      break;
    default:
      res.status(500).json({ message: "Unknown MongoDB State" });
  }
});

// Basic API Routes for Attendance Management
app.post("/api/clock-in", async (req, res) => {
  try {
    const now = new Date();
    res.status(200).json({ status: "Clocked In", time: now.toLocaleTimeString() });
  } catch (error) {
    res.status(500).json({ message: "Failed to clock in", error: error.message });
  }
});

app.post("/api/clock-out", async (req, res) => {
  try {
    const now = new Date();
    res.status(200).json({ status: "Clocked Out", time: now.toLocaleTimeString() });
  } catch (error) {
    res.status(500).json({ message: "Failed to clock out", error: error.message });
  }
});

// Serve Static Files
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
});
