import { useEffect, useRef, useState } from "react";
import { CircleAlert, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, ShoppingBag } from "lucide-react";
import { Link, Navigate, Outlet, useLocation, useNavigate, useSearchParams } from "react-router";
import { Button } from "./components";
import { authService } from "./services/auth-service";
import { useStore } from "./store";
import MercaLogo from "./merca-logo";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─── Auth field component ─────────────────── */
function AuthField({ label, icon: Icon, error, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777970]">
      {label}
      <span className={`mt-2 flex items-center rounded-xl border-[1.5px] bg-[#FFFDF9] dark:bg-[#1C211B] overflow-hidden focus-within:ring-2 focus-within:ring-[#244C3A]/10 transition-shadow ${
        error
          ? "border-red-400 focus-within:border-red-400"
          : "border-[#E7E2D9] dark:border-[#2B3329] focus-within:border-[#244C3A]"
      }`}>
        <span className="px-3 text-[#A8B8A0]">
          <Icon size={17} />
        </span>
        <input
          className="min-w-0 flex-1 bg-transparent py-3 pr-3 text-sm text-[#292B28] dark:text-[#E8EAE5] outline-none placeholder-[#A8B8A0]"
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="px-3 text-[#A8B8A0] hover:text-[#244C3A] transition-colors cursor-pointer"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </span>
      {error && <span role="alert" className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

/* ─── Auth layout shell ─────────────────────── */
function AuthShell({ eyebrow, title, text, children }) {
  const { record } = useStore();
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) { record("auth_page_view", title, {}); tracked.current = true; }
  }, [record, title]);

  return (
    <div className="page grid min-h-[calc(100vh-10rem)] place-items-center py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border-[1.5px] border-[#E7E2D9] dark:border-[#2B3329] bg-[#FFFDF9] dark:bg-[#1C211B] shadow-[0_8px_40px_rgba(41,43,40,0.1)] lg:grid-cols-[.85fr_1.15fr]">

        {/* Left panel */}
        <aside className="hidden bg-[#244C3A] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
            <MercaLogo size="lg" showTagline={true} inverse={true} />
          </Link>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A8B8A0]">Research-friendly shopping</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">
              Shop naturally.<br />
              <span className="text-[#A8B8A0]">Help us learn.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Accounts are optional. Anonymous participant tasks are always available without sign-in.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#A8B8A0]">
            <ShieldCheck size={16} />
            No real purchases or payment data
          </div>
        </aside>

        {/* Right panel */}
        <section className="p-7 sm:p-10 lg:p-12">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title mt-2">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#777970]">{text}</p>
          <div className="mt-7">{children}</div>
        </section>
      </div>
    </div>
  );
}

/* ─── Login ──────────────────────────────────── */
export function Login() {
  const { login, verifySecretPassword } = useStore();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const [form, setForm]         = useState({ email: "", password: "", role: "participant" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState("");
  
  // ── 2-Step Secret Password State ──
  const [challenge, setChallenge] = useState(null); // { sessionId, question, email }
  const [secretInput, setSecretInput] = useState("");

  const reason         = params.get("reason");
  const redirectTarget = params.get("redirect");
  const registerUrl    = redirectTarget
    ? `/register?redirect=${encodeURIComponent(redirectTarget)}${reason ? `&reason=${reason}` : ""}`
    : "/register";

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!emailPattern.test(form.email)) next.email    = "Enter a valid email address.";
    if (!form.password)                 next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await login(form);
      if (res?.secretRequired) {
        setChallenge(res);
        setLoading(false);
        return;
      }
      navigate(redirectTarget || (res?.role === "researcher" ? "/admin" : "/"));
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitSecret = async (e) => {
    e.preventDefault();
    if (!secretInput.trim()) {
      setErrors({ secret: "Please enter the secret password." });
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const user = await verifySecretPassword({
        sessionId: challenge.sessionId,
        secretPassword: secretInput.trim(),
      });
      navigate(redirectTarget || (user.role === "researcher" ? "/admin" : "/"));
    } catch (err) {
      setServerError(err.message || "Invalid secret password.");
    } finally {
      setLoading(false);
    }
  };

  if (challenge) {
    return (
      <AuthShell
        eyebrow="Security Verification"
        title={challenge.question || "GIVE SECRET PASSWORD"}
        text={`Access to this platform is protected. Please enter the authorized secret access password for ${challenge.email}.`}
      >
        {serverError && (
          <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-900">
            <CircleAlert size={16} className="shrink-0 text-red-600" />
            {serverError}
          </div>
        )}

        <form onSubmit={submitSecret} noValidate className="space-y-5">
          <div className="rounded-2xl border-[1.5px] border-[#B86B4D]/30 bg-[#FBF7F2] dark:bg-[#1E1B18] p-4 text-xs text-[#777970] leading-relaxed">
            <span className="font-bold text-[#B86B4D]">Prompt: </span>
            {challenge.question || "GIVE SECRET PASSWORD"}
          </div>

          <AuthField
            label="Secret Access Password"
            icon={LockKeyhole}
            type="password"
            autoComplete="off"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            error={errors.secret}
            placeholder="Enter secret password..."
          />

          <Button className="w-full justify-center bg-[#244C3A] hover:bg-[#1C3B2D] text-white" disabled={loading}>
            {loading ? "Verifying…" : "VERIFY SECRET PASSWORD →"}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => { setChallenge(null); setServerError(""); }}
              className="text-xs text-[#777970] hover:text-[#244C3A] underline transition"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      text="Use your registered email and password to access your Merca account."
    >
      {reason === "cart" && (
        <div role="status" className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-900">
          <ShoppingBag size={16} className="shrink-0 text-amber-600" />
          Please sign in to add items to your cart and proceed.
        </div>
      )}

      {serverError && (
        <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-900">
          <CircleAlert size={16} className="shrink-0 text-red-600" />
          {serverError}
        </div>
      )}

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField
          label="Email address" icon={Mail} type="email" autoComplete="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email} placeholder="you@example.com"
        />
        <AuthField
          label="Password" icon={LockKeyhole} type="password" autoComplete="current-password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-[#777970] cursor-pointer">
            <input
              type="checkbox"
              checked={form.role === "researcher"}
              onChange={(e) => setForm({ ...form, role: e.target.checked ? "researcher" : "participant" })}
              className="accent-[#244C3A]"
            />
            Researcher demo access
          </label>
          <Link to="/forgot-password" className="text-xs font-semibold text-[#244C3A] hover:underline">
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</div>
        )}

        <Button className="w-full justify-center" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[#777970]">
        New here?{" "}
        <Link to={registerUrl} className="font-bold text-[#244C3A] hover:underline">Create an account</Link>
      </p>

      <div className="my-5 flex items-center gap-3 text-xs text-[#D4CDBF]">
        <span className="h-px flex-1 bg-[#E7E2D9] dark:bg-[#2B3329]" />or
        <span className="h-px flex-1 bg-[#E7E2D9] dark:bg-[#2B3329]" />
      </div>

      <Link to="/catalogue">
        <Button variant="secondary" className="w-full justify-center">Continue browsing as guest</Button>
      </Link>
    </AuthShell>
  );
}

/* ─── Register ───────────────────────────────── */
export function Register() {
  const { register } = useStore();
  const navigate     = useNavigate();
  const [params]     = useSearchParams();
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const reason         = params.get("reason");
  const redirectTarget = params.get("redirect");
  const loginUrl       = redirectTarget
    ? `/login?redirect=${encodeURIComponent(redirectTarget)}${reason ? `&reason=${reason}` : ""}`
    : "/login";

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2)   next.name     = "Enter your full name.";
    if (!emailPattern.test(form.email)) next.email   = "Enter a valid email address.";
    if (form.password.length < 6)       next.password = "Use at least 6 characters.";
    if (form.confirm !== form.password) next.confirm  = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setServerError("");
    try {
      await register(form);
      navigate(loginUrl);
    } catch (err) {
      setServerError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create your account"
      title="Create an account"
      text="Sign up for Merca to manage orders, wishlist, and profile."
    >
      {serverError && (
        <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-900">
          <CircleAlert size={16} className="shrink-0 text-red-600" />
          {serverError}
        </div>
      )}

      {reason === "cart" && (
        <div role="status" className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-900">
          <ShoppingBag size={16} className="shrink-0 text-amber-600" />
          Create an account to add items to your cart and proceed.
        </div>
      )}

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField
          label="Full name" icon={ShieldCheck} autoComplete="name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name} placeholder="Jane Smith"
        />
        <AuthField
          label="Email address" icon={Mail} type="email" autoComplete="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email} placeholder="jane@example.com"
        />
        <AuthField
          label="Password" icon={LockKeyhole} type="password" autoComplete="new-password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <AuthField
          label="Confirm password" icon={LockKeyhole} type="password" autoComplete="new-password"
          value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          error={errors.confirm}
        />
        <p className="text-xs leading-relaxed text-[#A8B8A0]">
          Your account is secured in PostgreSQL with bcrypt hashing and audit logging.
        </p>
        <Button className="w-full justify-center" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[#777970]">
        Already registered?{" "}
        <Link to={loginUrl} className="font-bold text-[#244C3A] hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}

/* ─── Forgot Password ───────────────────────── */
export function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!emailPattern.test(email)) { setError("Enter a valid email address."); return; }
    setLoading(true);
    await authService.requestReset(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      text="We'll simulate sending a secure reset link to your address."
    >
      {sent ? (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 text-emerald-900 dark:text-emerald-300">
          <ShieldCheck size={24} />
          <h2 className="mt-3 font-semibold">Check your inbox</h2>
          <p className="mt-1 text-sm">A simulated reset link was created for <strong>{email}</strong>.</p>
          <div className="mt-5">
            <Link to="/reset-password?token=demo-reset-session">
              <Button>Open demo reset link</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <AuthField
            label="Email address" icon={Mail} type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            error={error} placeholder="you@example.com"
          />
          <Button className="w-full justify-center" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-xs">
        <Link to="/login" className="font-bold text-[#244C3A] hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}

/* ─── Reset Password ──────────────────────── */
export function ResetPassword() {
  const navigate     = useNavigate();
  const { toast }    = useStore();
  const [params]     = useSearchParams();
  const [form, setForm]     = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.password.length < 8)       next.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) next.confirm  = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    await authService.resetPassword({ token: params.get("token"), password: form.password });
    setLoading(false);
    toast("Password updated successfully");
    navigate("/login", { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Choose a new password"
      title="Set new password"
      text="Enter a strong password for this simulated reset flow."
    >
      <form onSubmit={submit} className="space-y-5">
        <AuthField
          label="New password" icon={LockKeyhole} type="password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <AuthField
          label="Confirm new password" icon={LockKeyhole} type="password"
          value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          error={errors.confirm}
        />
        <Button className="w-full justify-center" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}

/* ─── Route guard ─────────────────────────── */
export function RequireRole({ role = "researcher" }) {
  const { user } = useStore();
  const location = useLocation();
  if (!user)            return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}

/* ─── Profile & Security History View ──────────────────────── */
export function Profile() {
  const { user, logout } = useStore();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let mounted = true;
    authService.getAuthHistory().then((data) => {
      if (mounted) {
        setHistory(data || []);
        setLoadingHistory(false);
      }
    }).catch(() => {
      if (mounted) setLoadingHistory(false);
    });
    return () => { mounted = false; };
  }, []);

  if (!user) {
    return <Navigate to="/login?redirect=/profile" replace />;
  }

  return (
    <div className="page max-w-4xl py-10">
      <div className="mb-8">
        <p className="eyebrow">Account Dashboard</p>
        <h1 className="page-title mt-1">User Profile & Security</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="card p-6 md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#244C3A] text-2xl font-bold text-white shadow-md">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
            <h2 className="mt-4 font-serif text-xl font-medium text-[#292B28] dark:text-[#E8EAE5]">{user.name || "Merca User"}</h2>
            <p className="text-xs text-[#777970]">{user.email}</p>
            <span className="mt-3 inline-block rounded-full bg-[#EEE9DF] dark:bg-[#2B3329] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#244C3A] dark:text-[#A8B8A0]">
              {user.role || "Customer"}
            </span>
          </div>

          <div className="mt-6 border-t border-[#E7E2D9] dark:border-[#2B3329] pt-4 space-y-2 text-xs text-[#777970]">
            {user.phone && <div className="flex justify-between"><span>Phone</span><span className="font-semibold text-[#292B28] dark:text-[#E8EAE5]">{user.phone}</span></div>}
            <div className="flex justify-between"><span>Session ID</span><span className="font-mono text-[10px] text-[#A8B8A0]">Active</span></div>
          </div>

          <div className="mt-6">
            <Button variant="danger" className="w-full justify-center" onClick={logout}>Sign Out</Button>
          </div>
        </div>

        {/* Database Audit History */}
        <div className="card p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-medium text-[#292B28] dark:text-[#E8EAE5]">Recent Login & Security History</h3>
            <span className="text-[10px] font-bold text-[#A8B8A0] uppercase tracking-wider">Live Database Logs</span>
          </div>

          {loadingHistory ? (
            <div className="py-8 text-center text-xs text-[#777970]">Loading audit history from database…</div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#777970]">
              No activity logs recorded yet. Current active session is secured with HttpOnly cookies and Redis/LocalCache.
            </div>
          ) : (
            <div className="divide-y divide-[#E7E2D9] dark:divide-[#2B3329] overflow-hidden">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${item.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-semibold text-[#292B28] dark:text-[#E8EAE5]">{item.action_type}</span>
                      <span className="rounded bg-[#EEE9DF] dark:bg-[#2B3329] px-1.5 py-0.5 text-[9px] text-[#777970]">
                        {item.device_type || "Web"} · {item.browser || "Browser"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#777970]">IP: {item.ip_address || "127.0.0.1"}</p>
                  </div>
                  <span className="text-[11px] text-[#A8B8A0]">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

