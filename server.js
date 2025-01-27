import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Route to Check MongoDB Status
app.get("/api/db-status", (req, res) => {
  const connectionStatus = mongoose.connection.readyState;
  const statuses = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  const message = statuses[connectionStatus] || "Unknown State";
  const statusCode = connectionStatus === 1 ? 200 : 500;
  res.status(statusCode).json({ message });
});

// Attendance Management API
app.post("/api/clock-in", (req, res) => {
  try {
    const now = new Date();
    res.status(200).json({ status: "Clocked In", time: now.toLocaleTimeString() });
  } catch (error) {
    res.status(500).json({ message: "Failed to clock in", error: error.message });
  }
});

app.post("/api/clock-out", (req, res) => {
  try {
    const now = new Date();
    res.status(200).json({ status: "Clocked Out", time: now.toLocaleTimeString() });
  } catch (error) {
    res.status(500).json({ message: "Failed to clock out", error: error.message });
  }
});

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 Fallback for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
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
