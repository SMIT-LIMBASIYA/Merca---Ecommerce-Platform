const SESSION_KEY = "eus-auth-session";
const wait = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

function safeUser(email, name, role) {
  return { id: crypto.randomUUID(), email, name: name || email.split("@")[0], role };
}

export const authService = {
  getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  },
  async login({ email, password, role = "participant" }) {
    await wait();
    if (!email || !password) throw new Error("Email and password are required.");
    const user = safeUser(email, "", role);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  async register({ name, email, password }) {
    await wait(800);
    if (!name || !email || !password) throw new Error("Complete all required fields.");
    const user = safeUser(email, name, "participant");
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  async requestReset(email) {
    await wait();
    if (!email) throw new Error("Enter the email associated with your account.");
    return { ok: true };
  },
  async resetPassword({ token, password }) {
    await wait(800);
    if (!token || !password) throw new Error("The reset link is invalid or expired.");
    return { ok: true };
  },
  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
