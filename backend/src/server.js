import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import { pool } from "../db/index.js";
import authRoutes from "./routes/auth-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "merca_cookie_secret_key_2026"));

// Routes
app.use("/api/auth", authRoutes);

// Healthcheck endpoint
app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT 1 AS ok;");
    res.json({
      status: "ok",
      serverTime: new Date().toISOString(),
      database: dbRes.rows[0].ok === 1 ? "connected" : "unknown",
    });
  } catch (err) {
    res.status(500).json({
      status: "degraded",
      serverTime: new Date().toISOString(),
      database: "disconnected",
      error: err.message,
    });
  }
});

// Basic info
app.get("/api", (req, res) => {
  res.json({
    name: "Merca Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      auth: "/api/auth",
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Merca backend server running on http://localhost:${PORT}`);
  console.log(`🔗 Connected to frontend origin: ${CLIENT_URL}`);
});

export default app;
