import express from "express";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(path.resolve(), "public")));

// Example API endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the E-HRMS API!" });
});

// Fallback route to serve `index.html` for undefined routes
app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
