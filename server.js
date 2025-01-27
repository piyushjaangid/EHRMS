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
    process.exit(1); // Exit with failure
  }
};

// Define a sample Mongoose schema and model
const SampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
const SampleModel = mongoose.model("Sample", SampleSchema);

// Health Check Endpoint
app.get("/api/status", async (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const renderStatus = "Render service is running";

  const statusMessages = {
    0: "MongoDB Disconnected",
    1: "MongoDB Connected",
    2: "MongoDB Connecting",
    3: "MongoDB Disconnecting",
  };

  const mongoMessage = statusMessages[mongoStatus] || "Unknown MongoDB State";

  const allSystemsOperational =
    mongoStatus === 1 ? "All systems are operational" : "Issues detected";

  res.status(200).json({
    server: "Server is running",
    render: renderStatus,
    mongo: mongoMessage,
    status: allSystemsOperational,
  });
});

// Test Record Creation Endpoint
app.post("/api/test-record", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const newRecord = new SampleModel({ name, email });
    await newRecord.save();

    res.status(201).json({
      message: "Record created successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error("Error creating record:", error.message);
    res.status(500).json({
      message: "Failed to create record",
      error: error.message,
    });
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
