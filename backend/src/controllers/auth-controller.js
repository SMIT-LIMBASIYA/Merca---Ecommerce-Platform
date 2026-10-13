import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db/index.js";
import { cache } from "../services/cache-service.js";

const JWT_SECRET = process.env.JWT_SECRET || "merca_dev_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const LOGIN_SECRET_PASSCODE = process.env.LOGIN_SECRET_PASSCODE || "MERCA_SECURE_2026";

// Helper: parse client IP & device
function getClientMeta(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";
  const isMobile = /mobile|iphone|android/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  const deviceType = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";

  let browser = "Other";
  if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent)) browser = "Safari";
  else if (/edg/i.test(userAgent)) browser = "Edge";

  return { ip, userAgent, deviceType, browser };
}

// ── Log authentication activity to PostgreSQL ──
async function recordAuthHistory(userId, actionType, status, failureReason = null, meta = {}) {
  try {
    await pool.query(
      `INSERT INTO user_auth_history 
        (user_id, action_type, status, ip_address, user_agent, device_type, browser, failure_reason, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        actionType,
        status,
        meta.ip || null,
        meta.userAgent || null,
        meta.deviceType || "Desktop",
        meta.browser || "Unknown",
        failureReason,
        JSON.stringify(meta),
      ]
    );
  } catch (err) {
    console.error("Failed to record auth history:", err.message);
  }
}

// ── STEP 1: Login (Credentials Check & Initiate Secret Gate) ──
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const meta = getClientMeta(req);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const { rows } = await pool.query(
      "SELECT id, email, password_hash, role, status FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ error: `Account is ${user.status.toLowerCase()}` });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      await recordAuthHistory(user.id, "LOGIN", "FAILED", "Incorrect password", meta);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Issue a temporary challenge session for the Secret Password step
    const sessionId = crypto.randomUUID();
    await cache.storePendingChallenge(sessionId, {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: meta.ip,
      userAgent: meta.userAgent,
    }, 600); // 10 minutes expiry

    return res.json({
      status: "SECRET_PASSWORD_REQUIRED",
      sessionId,
      question: "GIVE SECRET PASSWORD",
      message: "Security verification required: Enter the authorized secret password to access your account",
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error during login" });
  }
}

// ── STEP 2: Verify Secret Password & Complete Authentication ──
export async function verifySecretPassword(req, res) {
  try {
    const { sessionId, secretPassword } = req.body;
    const meta = getClientMeta(req);

    if (!sessionId || !secretPassword) {
      return res.status(400).json({ error: "Session ID and secret password are required" });
    }

    // Retrieve pending challenge from Redis/localCache
    const challenge = await cache.getPendingChallenge(sessionId);
    if (!challenge) {
      return res.status(401).json({ error: "Verification session expired. Please log in again." });
    }

    // Compare with configured secret passcode in .env
    const expectedPasscode = (process.env.LOGIN_SECRET_PASSCODE || "MERCA_SECURE_2026").trim();
    const providedPasscode = secretPassword.trim();

    if (providedPasscode !== expectedPasscode) {
      await recordAuthHistory(challenge.userId, "SECRET_PASSWORD_FAILED", "FAILED", "Incorrect secret password", meta);
      return res.status(401).json({
        error: "Incorrect secret password! Access restricted to authorized personnel.",
      });
    }

    // Success! Consume challenge so it cannot be re-used
    await cache.consumePendingChallenge(sessionId);

    // Fetch full user details
    const { rows: userRows } = await pool.query(
      `SELECT u.id, u.email, u.role, u.status, u.avatar_url, u.created_at,
              c.first_name, c.last_name, c.display_name, c.gender, u.phone
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.id
       WHERE u.id = $1`,
      [challenge.userId]
    );

    const user = userRows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Store active session in Redis & local cache
    await cache.storeSession(token, {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: meta.ip,
      device: meta.deviceType,
    });

    // Set HttpOnly Secure Cookie (cannot be touched by client-side JavaScript)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Update user record & log history
    await pool.query(
      "UPDATE users SET last_login_at = now(), last_login_ip = $1, failed_login_attempts = 0 WHERE id = $2",
      [meta.ip, user.id]
    );

    await recordAuthHistory(user.id, "LOGIN", "SUCCESS", null, meta);

    return res.json({
      status: "SUCCESS",
      message: "Authentication successful",
      token, // Also return in body for Authorization header clients
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name || "User",
        lastName: user.last_name || "",
        displayName: user.display_name || user.first_name || "User",
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Verify secret password error:", err);
    return res.status(500).json({ error: "Verification process failed" });
  }
}

// ── Registration ──
export async function register(req, res) {
  const client = await pool.connect();
  try {
    const nameParts = (req.body.name || "").trim().split(" ");
    const firstName = (req.body.firstName || nameParts[0] || "").trim();
    const lastName = (req.body.lastName || nameParts.slice(1).join(" ") || "").trim();
    const { email, password, phone } = req.body;
    const meta = getClientMeta(req);

    if (!firstName || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await client.query("BEGIN;");

    // Insert user
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, role, status, email_verified, phone)
       VALUES ($1, $2, 'CUSTOMER', 'ACTIVE', FALSE, $3)
       RETURNING id, email, role, created_at`,
      [cleanEmail, passwordHash, phone || null]
    );
    const newUser = userRes.rows[0];

    // Insert customer profile
    await client.query(
      `INSERT INTO customers (user_id, first_name, last_name, display_name)
       VALUES ($1, $2, $3, $4)`,
      [newUser.id, firstName.trim(), lastName?.trim() || "", `${firstName.trim()} ${lastName?.trim() || ""}`.trim()]
    );

    await client.query("COMMIT;");

    // Record register history
    await recordAuthHistory(newUser.id, "REGISTER", "SUCCESS", null, meta);

    return res.status(201).json({
      status: "SUCCESS",
      message: "Registration successful! You can now log in.",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName,
        lastName,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK;");
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  } finally {
    client.release();
  }
}

// ── Get Current Profile ──
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.role, u.status, u.avatar_url, u.phone, u.last_login_at, u.created_at,
              c.first_name, c.last_name, c.display_name, c.date_of_birth, c.gender
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const u = rows[0];
    return res.json({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      displayName: u.display_name || u.first_name,
      role: u.role,
      phone: u.phone,
      gender: u.gender,
      avatarUrl: u.avatar_url,
      lastLoginAt: u.last_login_at,
      createdAt: u.created_at,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Failed to load profile" });
  }
}

// ── Get Auth & Login Audit History ──
export async function getAuthHistory(req, res) {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT id, action_type, status, ip_address, device_type, browser, created_at, failure_reason
       FROM user_auth_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    return res.json({ history: rows });
  } catch (err) {
    console.error("Get auth history error:", err);
    return res.status(500).json({ error: "Failed to load activity history" });
  }
}

// ── Logout ──
export async function logout(req, res) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      await cache.revokeSession(token);
    }

    if (req.user?.id) {
      await recordAuthHistory(req.user.id, "LOGOUT", "SUCCESS", null, getClientMeta(req));
    }

    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    return res.json({ status: "SUCCESS", message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
}
