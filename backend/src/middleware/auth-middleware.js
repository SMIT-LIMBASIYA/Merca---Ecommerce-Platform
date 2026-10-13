import jwt from "jsonwebtoken";
import { cache } from "../services/cache-service.js";

const JWT_SECRET = process.env.JWT_SECRET || "merca_dev_secret_key_2026";

export async function requireAuth(req, res, next) {
  try {
    // 1. Extract token from HttpOnly cookie or Authorization Bearer header
    const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required. Please log in." });
    }

    // 2. Check if token was revoked/blacklisted in Redis or localCache
    const isRevoked = await cache.isTokenBlacklisted(token);
    if (isRevoked) {
      return res.status(401).json({ error: "Session has been invalidated. Please log in again." });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid authentication token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
}
