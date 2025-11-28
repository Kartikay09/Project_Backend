// ============================================
// Agentic AI - Real-Time Cybersecurity Response System
// Backend Server (server.js)
// ============================================

// Import core packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import incidentRoutes from "./routes/incidentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";

// --------------------------------------------
// Environment & Database Setup
// --------------------------------------------
dotenv.config(); // Load environment variables from .env
connectDB(); // Connect MongoDB via mongoose

// Initialize Express App
const app = express();

// --------------------------------------------
// Middleware
// --------------------------------------------
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --------------------------------------------
// Test Route (Root)
// --------------------------------------------
app.get("/", (req, res) => {
  res.send(" Agentic AI Backend Running Successfully");
});

// --------------------------------------------
// API Routes
// --------------------------------------------
app.use("/api/incidents", incidentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai_logs", aiRoutes);
app.use("/api/recovery_actions", recoveryRoutes);

// --------------------------------------------
// Global Error Handler (optional)
// --------------------------------------------
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// --------------------------------------------
// Start Server
// --------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Frontend connected at ${process.env.CLIENT_URL || "http://localhost:5173"}`);
});
