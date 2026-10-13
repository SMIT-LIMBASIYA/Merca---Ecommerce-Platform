const SESSION_KEY = "merca_user_session";
const TOKEN_KEY = "merca_auth_token";

export const authService = {
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  },

  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  // ── Step 1: Login ──
  async login({ email, password }) {
    if (!email || !password) throw new Error("Email and password are required.");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send/receive HttpOnly cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // If backend requires the secret password step
      if (data.status === "SECRET_PASSWORD_REQUIRED") {
        return {
          secretRequired: true,
          sessionId: data.sessionId,
          question: data.question || "GIVE SECRET PASSWORD",
          message: data.message,
          email: data.email,
        };
      }

      return this._handleAuthSuccess(data);
    } catch (err) {
      // Fallback for offline dev mode if server is not running
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        console.warn("Backend API not reachable. Using simulated offline session.");
        const mockUser = {
          id: 1,
          email,
          name: email.split("@")[0],
          role: "customer",
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
        return { user: mockUser };
      }
      throw err;
    }
  },

  // ── Step 2: Verify Secret Password ──
  async verifySecretPassword({ sessionId, secretPassword }) {
    if (!sessionId || !secretPassword) {
      throw new Error("Secret password is required.");
    }

    const res = await fetch("/api/auth/verify-secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionId, secretPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Incorrect secret password.");
    }

    return this._handleAuthSuccess(data);
  },

  _handleAuthSuccess(data) {
    if (data.token) {
      try {
        localStorage.setItem(TOKEN_KEY, data.token);
      } catch {}
    }
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.displayName || data.user.firstName || data.user.email.split("@")[0],
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      role: data.user.role,
      phone: data.user.phone,
      avatarUrl: data.user.avatarUrl,
      createdAt: data.user.createdAt,
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {}
    return { user, token: data.token };
  },

  // ── Registration ──
  async register({ name, firstName, lastName, email, password, phone }) {
    const nameParts = (name || "").trim().split(" ");
    const fName = firstName || nameParts[0] || "User";
    const lName = lastName || nameParts.slice(1).join(" ") || "";

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, firstName: fName, lastName: lName, email, password, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return data;
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        return { status: "SUCCESS", message: "Account created (dev mode)" };
      }
      throw err;
    }
  },

  // ── Get Full Profile from Database ──
  async getProfile() {
    try {
      const token = this.getToken();
      const res = await fetch("/api/auth/profile", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch {
      return this.getSession();
    }
  },

  // ── Get Login & Audit History from Database ──
  async getAuthHistory() {
    try {
      const token = this.getToken();
      const res = await fetch("/api/auth/history", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.history || [];
    } catch {
      return [];
    }
  },

  async requestReset(email) {
    if (!email) throw new Error("Enter the email associated with your account.");
    return { ok: true };
  },

  async resetPassword({ token, password }) {
    if (!token || !password) throw new Error("The reset link is invalid or expired.");
    return { ok: true };
  },

  // ── Logout ──
  async logout() {
    try {
      const token = this.getToken();
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
    } catch {}
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};

export default authService;
