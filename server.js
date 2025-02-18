import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import winston from "winston";
import "winston-daily-rotate-file";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS to allow cross-origin requests
app.use(cors());

// Setup Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: "logs/server-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d"
    })
  ]
});

// Middleware to parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

// Define a sample Mongoose schema and model for test records
const SampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});
const SampleModel = mongoose.model("Sample", SampleSchema);

// Health Check Endpoint
app.get("/api/status", (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const renderStatus = "Render service is running";
  const statusMessages = {
    0: "MongoDB Disconnected",
    1: "MongoDB Connected",
    2: "MongoDB Connecting",
    3: "MongoDB Disconnecting"
  };
  const mongoMessage = statusMessages[mongoStatus] || "Unknown MongoDB State";
  const allSystemsOperational = mongoStatus === 1 ? "All systems are operational" : "Issues detected";
  logger.info("Status endpoint accessed");
  res.status(200).json({
    server: "Server is running",
    render: renderStatus,
    mongo: mongoMessage,
    status: allSystemsOperational
  });
});

// Test Record Creation Endpoint
app.post("/api/test-record", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      logger.warn("Test record creation failed: Missing name or email");
      return res.status(400).json({ message: "Name and email are required" });
    }
    const newRecord = new SampleModel({ name, email });
    await newRecord.save();
    logger.info("Test record created successfully");
    res.status(201).json({
      message: "Record created successfully",
      record: newRecord
    });
  } catch (error) {
    logger.error(`Error creating record: ${error.message}`);
    res.status(500).json({
      message: "Failed to create record",
      error: error.message
    });
  }
});

// File Upload Endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    logger.warn("File upload failed: No file provided");
    return res.status(400).json({ message: "No file uploaded" });
  }
  logger.info(`File uploaded: ${req.file.filename}`);
  res.status(200).json({ filename: req.file.filename });
});

// Serve static files from the "public" directory (including index.html)
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for the root URL
app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 Fallback for Undefined Routes
app.use((req, res) => {
  logger.warn(`404 Error - Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    logger.info(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    logger.error(`Server startup error: ${error.message}`);
    process.exit(1);
  }
});
