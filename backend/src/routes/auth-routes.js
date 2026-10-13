import express from "express";
import {
  login,
  verifySecretPassword,
  register,
  getProfile,
  getAuthHistory,
  logout,
} from "../controllers/auth-controller.js";
import { requireAuth } from "../middleware/auth-middleware.js";

const router = express.Router();

// Public auth endpoints
router.post("/login", login);
router.post("/verify-secret", verifySecretPassword);
router.post("/register", register);
router.post("/logout", logout);

// Authenticated user endpoints
router.get("/me", requireAuth, getProfile);
router.get("/profile", requireAuth, getProfile);
router.get("/history", requireAuth, getAuthHistory);

export default router;
