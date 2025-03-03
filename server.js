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

// Enable CORS
app.use(cors({ origin: "*", methods: "GET,POST", allowedHeaders: "Content-Type" }));

// Setup Logger
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

// Middleware
app.use(express.json());

// Configure Multer for File Uploads
const upload = multer({ dest: "uploads/" });

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected`);
  } catch (error) {
    logger.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

// Mongoose Schema
const RecordSchema = new mongoose.Schema({
  text: { type: String, required: true }
});
const RecordModel = mongoose.model("Record", RecordSchema);

// Health Check
app.get("/api/status", (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const renderStatus = "Render service is running";
  const statusMessages = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
  logger.info("Status endpoint accessed");
  res.status(200).json({
    server: "Server is running",
    render: renderStatus,
    mongo: statusMessages[mongoStatus] || "Unknown",
    status: mongoStatus === 1 ? "All systems operational" : "Issues detected"
  });
});

// Save Record
app.post("/api/save", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }
    const newRecord = new RecordModel({ text });
    await newRecord.save();
    logger.info("Record saved successfully");
    res.status(201).json({ message: "Saved successfully", record: newRecord });
  } catch (error) {
    logger.error(`Error saving record: ${error.message}`);
    res.status(500).json({ error: "Failed to save record" });
  }
});

// Get Records
app.get("/api/records", async (req, res) => {
  try {
    const records = await RecordModel.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    logger.error(`Error fetching records: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// File Upload
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  logger.info(`File uploaded: ${req.file.filename}`);
  res.status(200).json({ filename: req.file.filename });
});

// **Fix: Serve Static Files from the Correct Directory**
app.use(express.static(path.join(__dirname, "public")));

// **Fix: Correctly Serve index.html**
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await connectDB();
  logger.info(`Server running at http://localhost:${PORT}`);
});
