// ============================================
// Agentic AI - Real-Time Cybersecurity Response System
// Backend Server (server.js)
// (Updated: robust mongoose connection + retry + clearer errors)
// ============================================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Import routes
import incidentRoutes from "./routes/incidentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";

dotenv.config(); // Load environment variables from .env

const app = express();

// --------------------------------------------
// Middleware
// --------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --------------------------------------------
// Test Route (Root)
// --------------------------------------------
app.get("/", (req, res) => {
  res.send("Agentic AI Backend Running Successfully");
});

// --------------------------------------------
// API Routes
// --------------------------------------------
app.use("/api/incidents", incidentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai_logs", aiRoutes);
app.use("/api/recovery_actions", recoveryRoutes);

// --------------------------------------------
// Global Error Handler
// --------------------------------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err);
  res.status(500).json({ message: "Internal Server Error", error: err.message || err });
});

// --------------------------------------------
// Database connection (robust)
// --------------------------------------------
const rawUri = process.env.MONGO_URI || ""; // prefer full URI
// Optionally build URI from parts if provided
const buildUriFromParts = () => {
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;
  const hosts = process.env.DB_HOSTS; // e.g. "cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017"
  const dbName = process.env.DB_NAME || "test";
  const replica = process.env.DB_REPLICA_SET ? `&replicaSet=${process.env.DB_REPLICA_SET}` : "";
  if (!user || !pass || (!hosts && !process.env.DB_HOST)) return null;

  // If using SRV style host like "cluster0.xxxxx.mongodb.net" set srv=true
  if (process.env.DB_SRV && process.env.DB_SRV.toLowerCase() === "true" && process.env.DB_HOST) {
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${process.env.DB_HOST}/${dbName}?retryWrites=true&w=majority`;
  }

  const hostString = hosts || process.env.DB_HOST;
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostString}/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority${replica}`;
};

const uri = rawUri || buildUriFromParts();

if (!uri) {
  console.error("❌ No MongoDB connection string found. Set MONGO_URI or DB_USER/DB_PASS/DB_HOST(S).");
  process.exit(1);
}

async function connectWithRetry(uri, attempts = 3) {
  try {
    console.log("Attempting MongoDB connection...");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s - fail fast if cannot reach server
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error("❌ MongoDB connection error:", msg);

    // Helpful hints for common errors
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || msg.includes("failed to connect")) {
      console.error(" → Network/DNS issue. Check Atlas cluster status, Network Access (IP whitelist), VPN/firewall, and DNS resolution for SRV records.");
    } else if (msg.toLowerCase().includes("authentication failed") || msg.toLowerCase().includes("unauthorized")) {
      console.error(" → Auth failed. Verify DB user & password and make sure password is URL-encoded if it has special characters.");
    } else if (msg.includes("bad auth") || msg.includes("Authentication")) {
      console.error(" → Authentication / user permissions issue.");
    }

    if (attempts > 1) {
      console.log(`Retrying connection (${attempts - 1} attempts left) in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
      return connectWithRetry(uri, attempts - 1);
    } else {
      console.error("All MongoDB connection attempts failed. Exiting process.");
      process.exit(1);
    }
  }
}

// Start: connect DB then start server
const PORT = process.env.PORT || 5000;
connectWithRetry(uri)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend connected at ${process.env.CLIENT_URL || "http://localhost:5173"}`);
    });

    // Graceful shutdown handlers
    const shutdown = (signal) => {
      console.log(`Received ${signal}. Closing server and MongoDB connection...`);
      server.close(async () => {
        try {
          await mongoose.disconnect();
          console.log("MongoDB disconnected. Exiting.");
          process.exit(0);
        } catch (e) {
          console.error("Error during disconnect:", e);
          process.exit(1);
        }
      });
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  })
  .catch((e) => {
    console.error("Fatal error starting server:", e);
    process.exit(1);
  });
