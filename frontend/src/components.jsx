import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { BarChart3, Check, CheckCircle2, ChevronDown, ChevronRight, CircleUserRound, FlaskConical, Heart, LayoutDashboard, LogOut, Menu, Moon, Package, Search, ShoppingBag, SlidersHorizontal, Sun, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import MercaLogo from "./merca-logo";

/* ─── Button ─────────────────────────────────────────────── */
export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:   "bg-[#244C3A] text-white hover:bg-[#1b3a2b] border border-[#244C3A] rounded-[10px] text-xs font-semibold tracking-wide uppercase shadow-sm",
    secondary: "bg-[#FFFDF9] text-[#292B28] border border-[#E7E2D9] hover:border-[#244C3A] hover:bg-[#F7F5F0] rounded-[10px] text-xs font-semibold tracking-wide uppercase",
    ghost:     "text-[#777970] hover:text-[#292B28] hover:bg-[#E7E2D9] rounded-[10px] text-xs font-medium",
    danger:    "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-[10px] text-xs font-semibold",
  };
  return (
    <button
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 px-5 py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#244C3A]/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Field ──────────────────────────────────────────────── */
export function Field({ label, error, hint, ...props }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#777970] dark:text-[#8A9287]">
      {label}
      <input
        className={`mt-2 input ${error ? "border-red-400 focus:border-red-400 focus:shadow-none" : ""}`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
      {hint && !error && <span className="mt-1.5 block text-xs text-[#777970]">{hint}</span>}
    </label>
  );
}

/* ─── Select ─────────────────────────────────────────────── */
export function Select({ label, children, ...props }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#777970] dark:text-[#8A9287]">
      {label && <span className="mb-2 block">{label}</span>}
      <select
        className="w-full rounded-[10px] border-[1.5px] border-[#E7E2D9] bg-[#FFFDF9] px-3.5 py-2.5 text-xs text-[#292B28] outline-none focus:border-[#244C3A] cursor-pointer dark:border-[#2B3329] dark:bg-[#1C211B] dark:text-[#E8EAE5]"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

/* ─── Badge ──────────────────────────────────────────────── */
export function Badge({ children, tone = "blue" }) {
  const c = {
    blue:   "bg-[#EEE9DF] text-[#292B28] border border-[#E7E2D9]",
    green:  "bg-emerald-50 text-emerald-800 border border-emerald-200",
    amber:  "bg-amber-50 text-amber-800 border border-amber-200",
    gray:   "bg-[#EEE9DF] text-[#777970] border border-[#E7E2D9]",
    red:    "bg-red-50 text-red-800 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${c[tone]}`}>
      {children}
    </span>
  );
}

/* ─── Breadcrumbs ────────────────────────────────────────── */
export function Breadcrumbs({ items, className = "mb-6" }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#777970] ${className}`}>
      <Link to="/" className="hover:text-[#244C3A] transition-colors">Home</Link>
      {items.map((x) => (
        <span key={x} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-[#D4CDBF]" />
          <span className="text-[#292B28] dark:text-[#E8EAE5]">{x}</span>
        </span>
      ))}
    </nav>
  );
}

/* ─── EmptyState ─────────────────────────────────────────── */
export function EmptyState({ icon: Icon = Package, title, text, action }) {
  return (
    <div className="card flex flex-col items-center py-20 text-center">
      <span className="mb-5 inline-flex rounded-2xl bg-[#EEE9DF] p-5 text-[#A8B8A0]">
        <Icon size={26} />
      </span>
      <h3 className="font-serif text-2xl font-normal text-[#292B28] dark:text-[#E8EAE5]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#777970]">{text}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

/* ─── ConfirmDialog ──────────────────────────────────────── */
export function ConfirmDialog({ open, title, text, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="card max-w-md w-full p-7">
        <h3 className="text-lg font-bold text-[#292B28] dark:text-[#E8EAE5]">{title}</h3>
        <p className="mt-2 text-sm text-[#777970]">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toasts ─────────────────────────────────────────────── */
export function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all ${
            t.tone === "error"
              ? "bg-red-600 border border-red-500/50"
              : "bg-[#244C3A] border border-[#1b3a2b]"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {t.tone === "error"
              ? <X size={16} className="shrink-0" />
              : <Check size={16} className="shrink-0 text-[#A8B8A0]" />
            }
            <span className="truncate text-xs">{t.message}</span>
          </div>
          <button
            type="button"
            onClick={() => dismissToast && dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="shrink-0 ml-2 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── StoreLayout ────────────────────────────────────────── */
export function StoreLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cart, compare, task, user, logout, record, setNavigator, theme, toggleTheme } = useStore();
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  useEffect(() => {
    if (setNavigator) setNavigator(() => navigate);
  }, [navigate, setNavigator]);

  const submit = (e) => {
    e.preventDefault();
    const q = search.trim();
    record("search", "Merca search bar", { query: q });
    navigate(`/catalogue${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-page)", color: "var(--text-pri)" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9] dark:bg-[#1C211B] border-b border-[#E7E2D9] dark:border-[#2B3329]">

        {/* Main row */}
        <div className="page flex items-center gap-4 py-3">

          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 transition-transform hover:scale-[1.02]"
            aria-label="Merca home"
          >
            <MercaLogo size="md" />
          </Link>

          {/* Search bar */}
          <form
            onSubmit={submit}
            className="hidden md:flex flex-1 max-w-2xl items-center rounded-xl border-[1.5px] border-[#E7E2D9] dark:border-[#2B3329] bg-[#F7F5F0] dark:bg-[#131712] overflow-hidden focus-within:border-[#244C3A] focus-within:shadow-sm transition-all"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products…"
              aria-label="Search products"
              className="h-11 flex-1 min-w-0 px-4 text-sm bg-transparent text-[#292B28] dark:text-[#E8EAE5] outline-none placeholder-[#A8B8A0]"
            />
            <button
              type="submit"
              aria-label="Search"
              className="h-11 px-4 flex items-center text-[#777970] hover:text-[#244C3A] transition-colors cursor-pointer"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1">

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="h-9 w-9 flex items-center justify-center rounded-xl text-[#777970] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Wishlist */}
            <Link
              to="/catalogue"
              aria-label="Wishlist"
              className="h-9 w-9 hidden sm:flex items-center justify-center rounded-xl text-[#777970] hover:text-[#C8795B] hover:bg-[#EEE9DF] transition-colors"
            >
              <Heart size={18} />
            </Link>

            {/* Account */}
            <Link
              to={user ? "/profile" : "/login"}
              aria-label={user ? user.name : "Sign in"}
              className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 h-9 text-xs font-semibold text-[#292B28] dark:text-[#E8EAE5] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors"
            >
              <CircleUserRound size={17} />
              <span className="hidden lg:inline">{user ? user.name : "Sign in"}</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative flex items-center gap-1.5 rounded-xl px-3 h-9 text-xs font-semibold text-[#292B28] dark:text-[#E8EAE5] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 right-1.5 counter">{cartCount}</span>
              )}
              <span className="hidden sm:inline">Bag</span>
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl text-[#777970] hover:bg-[#EEE9DF] transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Category nav row */}
        <div className="border-t border-[#E7E2D9] dark:border-[#2B3329]">
          <div className="page flex items-center gap-0.5 py-1.5 overflow-x-auto scrollbar-none text-xs font-medium">
            {[
              ["All products", "/catalogue"],
              ["Audio", "/catalogue?category=Audio"],
              ["Wearables", "/catalogue?category=Wearables"],
              ["Cameras", "/catalogue?category=Cameras"],
              ["Home", "/catalogue?category=Home"],
              ["Bags", "/catalogue?category=Bags"],
              ["Footwear", "/catalogue?category=Footwear"],
              ["Compare", "/compare"],
            ].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                className="shrink-0 px-3 py-1.5 rounded-lg text-[#777970] hover:text-[#244C3A] hover:bg-[#EEE9DF] dark:hover:bg-[#2B3329] transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile search + nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-[#E7E2D9] dark:border-[#2B3329] bg-[#FFFDF9] dark:bg-[#1C211B] p-4 space-y-1">
            <form onSubmit={submit} className="mb-3 flex rounded-xl border-[1.5px] border-[#E7E2D9] dark:border-[#2B3329] overflow-hidden">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="flex-1 h-10 px-3 text-sm bg-transparent text-[#292B28] dark:text-[#E8EAE5] outline-none"
              />
              <button type="submit" className="px-3 text-[#777970]"><Search size={17} /></button>
            </form>
            {[
              ["Browse all products", "/catalogue"],
              ["Audio & Sound", "/catalogue?category=Audio"],
              ["Smart Wearables", "/catalogue?category=Wearables"],
              ["Cameras", "/catalogue?category=Cameras"],
              ["Home & Kitchen", "/catalogue?category=Home"],
              ["Compare products", "/compare"],
            ].map(([label, to]) => (
              <Link key={label} className="mobile-link" to={to} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <button
              type="button"
              className="mobile-link w-full text-left flex items-center justify-between"
              onClick={toggleTheme}
            >
              <span>Theme</span>
              <span className="flex items-center gap-1.5 text-[#244C3A] font-semibold">
                {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>
            {user ? (
              <button
                className="mobile-link w-full text-left text-red-600"
                onClick={() => { logout(); setMenuOpen(false); }}
              >
                Sign out ({user.name})
              </button>
            ) : (
              <Link className="mobile-link text-[#244C3A] font-semibold" to="/login" onClick={() => setMenuOpen(false)}>
                Sign in or create account
              </Link>
            )}
            <Link className="mobile-link text-[#777970] text-xs" to="/admin" onClick={() => setMenuOpen(false)}>
              Researcher dashboard
            </Link>
          </nav>
        )}
      </header>

      {/* Page body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#EEE9DF] dark:bg-[#1a1f19] hover:bg-[#E7E2D9] dark:hover:bg-[#2B3329] py-3.5 text-center text-xs font-semibold text-[#777970] transition-colors cursor-pointer select-none mt-auto"
      >
        ↑ Back to top
      </button>

      {/* Footer */}
      <footer className="bg-[#292B28] dark:bg-[#0D1210] text-[#A8B8A0]">
        <div className="page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <div className="mb-4">
              <MercaLogo size="md" showTagline={true} inverse={true} />
            </div>
            <p className="text-xs leading-relaxed text-[#A8B8A0]">Thoughtfully curated essentials across audio, wearables, camera, home and commuter design.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5 text-xs text-[#777970]">
              <li><Link to="/catalogue" className="hover:text-[#A8B8A0] transition-colors">All Products</Link></li>
              <li><Link to="/catalogue?category=Audio" className="hover:text-[#A8B8A0] transition-colors">Audio & Sound</Link></li>
              <li><Link to="/catalogue?category=Wearables" className="hover:text-[#A8B8A0] transition-colors">Smart Wearables</Link></li>
              <li><Link to="/compare" className="hover:text-[#A8B8A0] transition-colors">Compare Products</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2.5 text-xs text-[#777970]">
              <li><Link to="/admin" className="hover:text-[#A8B8A0] transition-colors">Admin Console</Link></li>
              <li><span className="text-[#555750]">Privacy Policy</span></li>
              <li><span className="text-[#555750]">Terms of Service</span></li>
              <li><span className="text-[#555750]">Shipping & Returns</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2.5 text-xs text-[#777970]">
              {user ? (
                <li>
                  <button onClick={logout} className="hover:text-[#A8B8A0] transition-colors text-left">
                    Sign out ({user.name})
                  </button>
                </li>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-[#A8B8A0] transition-colors">Sign in</Link></li>
                  <li><Link to="/register" className="hover:text-[#A8B8A0] transition-colors">Create account</Link></li>
                </>
              )}
              <li><Link to="/cart" className="hover:text-[#A8B8A0] transition-colors">Shopping bag</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3a3d39] py-6 text-center text-xs text-[#555750]">
          <p>© {new Date().getFullYear()} Merca — Academic UX Simulator · Built with React & Tailwind CSS</p>
          <p className="mt-1">Demo product photography from Unsplash · No real commercial transactions</p>
        </div>
      </footer>

      <Toasts />
    </div>
  );
}

/* ─── AdminLayout ────────────────────────────────────────── */
const adminNav = [
  ["/admin",           "Overview",            LayoutDashboard],
  ["/admin/sessions",  "Participants",        Users],
  ["/admin/tasks",     "Task management",     SlidersHorizontal],
  ["/admin/logs",      "Interaction logs",    Package],
  ["/admin/analytics", "Analytics",           BarChart3],
  ["/admin/feedback",  "Feedback & Issues",   FlaskConical],
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { logout, theme, toggleTheme } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#131712] lg:flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#FFFDF9] dark:bg-[#1C211B] border-r border-[#E7E2D9] dark:border-[#2B3329] p-5 flex flex-col transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="flex items-center gap-2 font-bold text-[#292B28] dark:text-[#E8EAE5]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#244C3A] text-white">
              <FlaskConical size={16} />
            </span>
            Research Console
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-[#777970]"><X size={18} /></button>
        </div>

        <div className="mb-5 rounded-xl bg-[#EEE9DF] dark:bg-[#2B3329] p-3 text-xs text-[#777970]">
          <strong className="block text-[#244C3A] mb-0.5">Demo workspace</strong>
          All metrics show sample data, not real findings.
        </div>

        <nav className="flex-1 space-y-0.5">
          {adminNav.map(([to, label, Icon], i) => (
            <NavLink
              end={i === 0}
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#244C3A] text-white"
                    : "text-[#777970] hover:bg-[#EEE9DF] dark:hover:bg-[#2B3329] hover:text-[#292B28] dark:hover:text-[#E8EAE5]"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-[#E7E2D9] dark:border-[#2B3329] space-y-1.5">
          <Link className="flex items-center gap-2 text-xs font-medium text-[#777970] hover:text-[#244C3A] transition-colors" to="/">
            ← Participant site
          </Link>
          <button
            className="flex items-center gap-2 text-xs font-medium text-[#777970] hover:text-red-600 transition-colors"
            onClick={() => { logout(); navigate("/"); }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <section className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[#E7E2D9] dark:border-[#2B3329] bg-[#FFFDF9] dark:bg-[#1C211B] px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[#777970]" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="eyebrow">Researcher dashboard</p>
              <p className="text-sm font-bold text-[#292B28] dark:text-[#E8EAE5]">
                {adminNav.find(([to]) => to === loc.pathname)?.[1] || "Session detail"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-xl border border-[#E7E2D9] dark:border-[#2B3329] bg-[#FFFDF9] dark:bg-[#1C211B] p-2 text-[#777970] hover:border-[#244C3A] hover:text-[#244C3A] transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>
            <Badge tone="blue">Demo data</Badge>
          </div>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </section>

      <Toasts />
    </div>
  );
}
