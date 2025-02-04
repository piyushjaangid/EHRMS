import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import winston from "winston";
import "winston-daily-rotate-file";

dotenv.config();
const app = express();

// Winston Logger Setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: "logs/server-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Basic Route
app.get("/", (req, res) => {
  logger.info("Root route accessed");
  res.status(200).json({ message: "Server is running!" });
});

// Example API Endpoint for Employees
app.get("/api/employees", (req, res) => {
  try {
    const employees = [
      { name: "John Doe", position: "Software Engineer", department: "IT" },
      { name: "Jane Smith", position: "HR Manager", department: "HR" },
    ];
    logger.info("Employees endpoint accessed");
    res.status(200).json({ employees });
  } catch (error) {
    logger.error(`Error in /api/employees: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Fallback Route for Undefined Routes
app.use((req, res, next) => {
  logger.warn(`404 Error - Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    logger.info(`Server starting on port ${PORT}`);
    await connectDB();
    logger.info(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
  }
});
