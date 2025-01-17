import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); // Deprecated options removed
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit the application if the database connection fails
    }
};

// Basic Route
app.get("/", (req, res) => {
    res.status(200).send("Server is ready and running smoothly!");
});

// Catch-All Route for 404 Errors
app.use((req, res) => {
    res.status(404).send({ message: "Route not found" });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).send({
        message: "An unexpected error occurred on the server.",
        error: err.message || "Internal Server Error",
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    console.log(`Server started at http://localhost:${PORT}`);
    await connectDB(); // Connect to the database after the server starts
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error.stack || error);
    process.exit(1); // Forcefully exit the process
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1); // Forcefully exit the process
});
