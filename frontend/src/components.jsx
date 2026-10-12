import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { BarChart3, Check, CheckCircle2, ChevronDown, ChevronRight, CircleUserRound, FlaskConical, LayoutDashboard, LogOut, MapPin, Menu, Moon, Package, Search, ShoppingBag, SlidersHorizontal, Sun, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "./store";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-[#383630] text-[#FAF8F4] hover:bg-[#201f1c] border border-[#383630] rounded-none uppercase tracking-wider text-xs font-semibold",
    secondary: "bg-[#FAF8F4] text-[#302E2A] border border-[#D8D2C8] hover:border-[#383630] hover:bg-[#EDE8E0] rounded-none uppercase tracking-wider text-xs font-semibold",
    ghost: "text-[#77736C] hover:text-[#302E2A] hover:bg-[#EDE8E0] rounded-none text-xs font-medium",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-none text-xs font-semibold"
  };
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 px-5 py-2.5 transition focus:outline-none focus:ring-1 focus:ring-[#383630]/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

export function Field({ label, error, hint, ...props }) {
  return <label className="block text-xs uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400">{label}<input className={`mt-1.5 w-full rounded-none border bg-[#FAF8F4] dark:bg-slate-900 px-3.5 py-2.5 text-xs text-[#302E2A] dark:text-slate-100 outline-none transition focus:border-[#383630] dark:focus:border-white ${error ? "border-red-400" : "border-[#D8D2C8] dark:border-slate-800"}`} {...props} />{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}{hint && !error && <span className="mt-1 block text-xs text-[#77736C]">{hint}</span>}</label>;
}

export function Select({ label, children, ...props }) {
  return <label className="block text-xs uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400">{label && <span className="mb-1.5 block">{label}</span>}<select className="w-full rounded-none border border-[#D8D2C8] dark:border-slate-800 bg-[#FAF8F4] dark:bg-slate-900 px-3.5 py-2.5 text-xs text-[#302E2A] dark:text-slate-100 outline-none focus:border-[#383630] dark:focus:border-white cursor-pointer" {...props}>{children}</select></label>;
}

export function Badge({ children, tone = "blue" }) {
  const c = { blue: "bg-[#EAE5DD] text-[#302E2A] border border-[#D8D2C8]", green: "bg-emerald-50 text-emerald-800 border border-emerald-200", amber: "bg-amber-50 text-amber-800 border border-amber-200", gray: "bg-[#EAE5DD] text-[#77736C] border border-[#D8D2C8]", red: "bg-red-50 text-red-800 border border-red-200" };
  return <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase ${c[tone]}`}>{children}</span>;
}

export function Breadcrumbs({ items }) {
  return <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-light text-[#77736C] dark:text-slate-400"><Link to="/" className="hover:text-[#302E2A] dark:hover:text-white transition">Home</Link>{items.map((x) => <span className="flex items-center gap-1.5" key={x}><span className="text-[#D8D2C8] dark:text-slate-700">/</span><span className="text-[#302E2A] dark:text-slate-200 font-normal">{x}</span></span>)}</nav>;
}

export function EmptyState({ icon: Icon = Package, title, text, action }) {
  return <div className="card flex flex-col items-center py-16 text-center border border-[#D8D2C8] dark:border-slate-800 bg-[#FAF8F4] dark:bg-[#0f172a] rounded-none"><span className="mb-4 rounded-none bg-[#EAE5DD] dark:bg-slate-800 p-4 text-[#77736C] dark:text-slate-300"><Icon size={24} /></span><h3 className="font-serif text-2xl font-normal text-[#302E2A] dark:text-white">{title}</h3><p className="mt-2 max-w-md text-xs font-light text-[#77736C] dark:text-slate-400 leading-relaxed">{text}</p>{action && <div className="mt-6">{action}</div>}</div>;
}

export function ConfirmDialog({ open, title, text, onConfirm, onClose }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4" role="dialog" aria-modal="true"><div className="card max-w-md p-6"><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-slate-600">{text}</p><div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm}>Confirm</Button></div></div></div>;
}

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl border transition-all ${t.tone === "error"
              ? "bg-red-600 border-red-500/50"
              : "bg-[#131921] border-slate-700/80"
            }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {t.tone === "error" ? (
              <X size={17} className="shrink-0 text-white" />
            ) : (
              <Check size={17} className="shrink-0 text-[#febd69]" />
            )}
            <span className="truncate">{t.message}</span>
          </div>
          <button
            type="button"
            onClick={() => dismissToast && dismissToast(t.id)}
            aria-label="Remove notification"
            title="Remove notification"
            className="p-1 -mr-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 ml-3"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function StoreLayout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { cart, compare, task, user, logout, record, setNavigator, theme, toggleTheme } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (setNavigator) {
      setNavigator(() => navigate);
    }
  }, [navigate, setNavigator]);

  const submit = (e) => {
    e.preventDefault();
    const value = search.trim();
    record("search", "Amazon top search", { query: value, category });
    const queryParams = new URLSearchParams();
    if (value) queryParams.set("q", value);
    if (category !== "All") queryParams.set("category", category);
    navigate(`/catalogue?${queryParams.toString()}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F3F0EB] dark:bg-[#080c14] text-[#302E2A] dark:text-slate-100 flex flex-col font-sans">
      {/* Amazon Header Bar */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white">


        {/* Main Navbar */}
        <div className="px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-3 md:flex-nowrap">
          {/* Merca Brand Logo with Curved Arrow Smile */}
          <Link to="/" className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
            <div className="flex flex-col leading-none">
              <div className="flex items-baseline font-black tracking-tight text-xl text-white">
                <span>mer</span>
                <span className="text-[#febd69]">ca</span>
                <span className="text-[10px] text-slate-400 font-semibold ml-0.5">.com</span>
              </div>
              <svg className="w-16 h-2 text-[#febd69] -mt-0.5" viewBox="0 0 100 20" fill="none">
                <path d="M5 6 Q50 22 95 6" stroke="#febd69" strokeWidth="4" strokeLinecap="round" />
                <path d="M86 3 L95 6 L88 12" stroke="#febd69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>

          {/* Deliver to Location Widget */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 cursor-pointer text-left shrink-0">
            <MapPin size={18} className="text-white mt-1 shrink-0" />
            <div className="leading-tight">
              <span className="block text-[11px] text-slate-300">Deliver to</span>
              <strong className="block text-xs font-bold text-white whitespace-nowrap">United States</strong>
            </div>
          </div>

          {/* Amazon Search Bar */}
          <form onSubmit={submit} className="order-last md:order-none flex flex-1 w-full max-w-4xl items-center rounded-md overflow-hidden bg-white text-slate-900 shadow-sm focus-within:ring-2 focus-within:ring-[#f90]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Search department"
              className="h-10 bg-slate-100 hover:bg-slate-200 text-xs px-2.5 font-medium border-r border-slate-300 text-slate-700 outline-none cursor-pointer hidden sm:block shrink-0"
            >
              <option value="All">All</option>
              <option value="Audio">Audio</option>
              <option value="Wearables">Wearables</option>
              <option value="Cameras">Cameras</option>
              <option value="Home">Home</option>
              <option value="Bags">Bags</option>
              <option value="Footwear">Footwear</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Merca products, electronics, and deals"
              aria-label="Search Merca"
              className="h-10 min-w-0 flex-1 px-3 text-sm text-slate-900 outline-none bg-white placeholder-slate-400"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="h-10 px-4 bg-[#febd69] hover:bg-[#f3a847] text-slate-900 flex items-center justify-center transition shrink-0 cursor-pointer"
            >
              <Search size={20} className="stroke-[2.5]" />
            </button>
          </form>

          {/* Language Selector */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 cursor-pointer text-xs font-bold text-white shrink-0">
            <span className="text-sm">🇺🇸</span>
            <span>EN</span>
            <ChevronDown size={11} className="text-slate-400" />
          </div>

          {/* Account & Lists */}
          <Link
            to={user ? "/" : "/login"}
            className="hidden sm:flex flex-col leading-tight px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 text-left shrink-0"
          >
            <span className="text-[11px] text-slate-300 truncate max-w-28">
              Hello, {user ? user.name : "sign in"}
            </span>
            <strong className="text-xs font-bold text-white flex items-center gap-0.5 whitespace-nowrap">
              Account & Lists <ChevronDown size={11} className="text-slate-400" />
            </strong>
          </Link>

          {/* Returns & Orders */}
          <Link
            to="/task"
            className="hidden md:flex flex-col leading-tight px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 text-left shrink-0"
          >
            <span className="text-[11px] text-slate-300">Returns</span>
            <strong className="text-xs font-bold text-white whitespace-nowrap">& Orders</strong>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to white theme" : "Switch to black theme"}
            title={theme === "dark" ? "Switch to white theme" : "Switch to black theme"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 text-xs font-bold text-slate-200 transition shrink-0 cursor-pointer"
          >
            <span className="grid size-5 place-items-center">
              {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-300" />}
            </span>
            <span className="hidden xl:inline text-[11px] font-bold">
              {theme === "dark" ? "White Theme" : "Black Theme"}
            </span>
          </button>

          {/* Amazon Cart Widget */}
          <Link
            to="/cart"
            className="flex items-end px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/60 text-white ml-auto md:ml-0 shrink-0"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingBag size={28} className="text-white" />
              <span className="absolute -top-1 left-3.5 min-w-4 text-center font-black text-xs text-[#f08804]">
                {cart.reduce((s, x) => s + x.qty, 0)}
              </span>
            </div>
            <strong className="text-xs font-bold hidden sm:inline ml-1 pb-0.5">Cart</strong>
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="p-2 text-white md:hidden hover:outline hover:outline-1 hover:outline-white/60 rounded"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Secondary Amazon Subnav Strip */}
        <div className="bg-[#232f3e] text-white text-xs sm:text-sm border-t border-[#37475a]/40">
          <div className="px-3 sm:px-4 flex items-center gap-4 py-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 px-2 py-1 rounded font-bold hover:outline hover:outline-1 hover:outline-white/60 cursor-pointer shrink-0"
            >
              <Menu size={17} />
              <span>All</span>
            </button>
            <Link to="/catalogue" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 font-semibold shrink-0">
              Today's Deals
            </Link>
            <Link to="/catalogue?category=Audio" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
              Audio & Sound
            </Link>
            <Link to="/catalogue?category=Wearables" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
              Smart Wearables
            </Link>
            <Link to="/catalogue?category=Cameras" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
              Cameras
            </Link>
            <Link to="/catalogue?category=Home" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
              Home & Kitchen
            </Link>
            <Link to="/catalogue?category=Bags" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
              Bags & Travel
            </Link>
            <Link to="/catalogue?category=Footwear" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/60 shrink-0">
              Footwear
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav className="bg-[#232f3e] p-4 text-white border-t border-[#37475a] space-y-2 md:hidden">
            <Link className="mobile-link text-white hover:bg-[#37475a]" to="/catalogue" onClick={() => setOpen(false)}>All products</Link>
            <Link className="mobile-link text-white hover:bg-[#37475a]" to="/catalogue?category=Audio" onClick={() => setOpen(false)}>Audio & Sound</Link>
            <Link className="mobile-link text-white hover:bg-[#37475a]" to="/catalogue?category=Wearables" onClick={() => setOpen(false)}>Smart Wearables</Link>
            <Link className="mobile-link text-white hover:bg-[#37475a]" to="/catalogue?category=Cameras" onClick={() => setOpen(false)}>Cameras</Link>
            <Link className="mobile-link text-white hover:bg-[#37475a]" to="/catalogue?category=Home" onClick={() => setOpen(false)}>Home & Kitchen</Link>
            <button type="button" className="mobile-link text-white flex w-full items-center justify-between hover:bg-[#37475a]" onClick={toggleTheme}>
              <span>Theme</span>
              <span className="flex items-center gap-1.5 font-bold text-[#febd69]">
                {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
                {theme === "dark" ? "White Theme" : "Black Theme"}
              </span>
            </button>
            {user ? (
              <button className="mobile-link w-full text-left text-white hover:bg-[#37475a]" onClick={() => { logout(); setOpen(false); }}>
                Sign out ({user.name})
              </button>
            ) : (
              <Link className="mobile-link text-white hover:bg-[#37475a]" to="/login" onClick={() => setOpen(false)}>
                Sign in or register
              </Link>
            )}
            <Link className="mobile-link text-slate-300 hover:bg-[#37475a]" to="/admin" onClick={() => setOpen(false)}>
              Researcher dashboard
            </Link>
          </nav>
        )}
      </header>

      {/* Usability study active alert banner */}
      {task?.startedAt && task.status === "active" && (
        <div className="bg-[#f08804] py-2 text-center text-xs font-bold text-slate-900 shadow-inner">
          Usability Study in progress · Session {task.sessionId} · <Link className="underline font-black" to="/task">View task details</Link>
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Amazon Back to Top Strip */}
      <div
        onClick={scrollToTop}
        className="bg-[#37475a] hover:bg-[#485769] text-white text-xs font-bold py-3.5 text-center cursor-pointer transition select-none mt-12"
      >
        Back to top
      </div>

      {/* Amazon Multi-Column Footer */}
      <footer className="bg-[#232f3e] text-slate-300">
        <div className="page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div>
            <h3 className="font-bold text-white text-sm mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/" className="hover:underline">About Merca</Link></li>
              <li><Link to="/task" className="hover:underline">Participant Usability Study</Link></li>
              <li><Link to="/admin" className="hover:underline">Research Console</Link></li>
              <li><span className="text-slate-400">Academic Usability Guidelines</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm mb-3">Shop with Us</h3>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/catalogue" className="hover:underline">Today's Deals</Link></li>
              <li><Link to="/catalogue?category=Audio" className="hover:underline">Electronics & Audio</Link></li>
              <li><Link to="/catalogue?category=Wearables" className="hover:underline">Smart Wearables</Link></li>
              <li><Link to="/compare" className="hover:underline">Side-by-side Product Comparison</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm mb-3">Simulated Shopping</h3>
            <ul className="space-y-2 text-slate-300">
              <li><span className="text-slate-400">No Real Payment</span></li>
              <li><span className="text-slate-400">No Credit Card Required</span></li>
              <li><span className="text-slate-400">Zero Commercial Transactions</span></li>
              <li><Link to="/task" className="hover:underline text-[#febd69]">Begin Usability Task</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm mb-3">Account & Help</h3>
            <ul className="space-y-2 text-slate-300">
              {user ? (
                <li><button onClick={logout} className="hover:underline text-left">Sign Out ({user.name})</button></li>
              ) : (
                <>
                  <li><Link to="/login" className="hover:underline">Your Account (Sign In)</Link></li>
                  <li><Link to="/register" className="hover:underline">Create Demo Account</Link></li>
                </>
              )}
              <li><Link to="/cart" className="hover:underline">View Shopping Cart</Link></li>
              <li><Link to="/admin" className="hover:underline">Researcher Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3a4553] py-7 text-center text-xs text-slate-400 bg-[#131921]">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <span className="font-black text-white text-base tracking-tight">merca<span className="text-[#febd69]">.com</span></span>
            <span className="rounded border border-slate-600 px-2 py-0.5 text-slate-300">🌐 English</span>
            <span className="rounded border border-slate-600 px-2 py-0.5 text-slate-300">$ USD - U.S. Dollar</span>
            <span className="rounded border border-slate-600 px-2 py-0.5 text-slate-300">🇺🇸 United States</span>
          </div>
          <p>Academic UX Usability Simulator · Built with React & Tailwind CSS · Modeled after the Amazon shopping experience</p>
          <p className="mt-1 text-slate-500">Demo product data, photography from Unsplash, no real purchases.</p>
        </div>
      </footer>
      <Toasts />
    </div>
  );
}

const adminNav = [["/admin", "Overview", LayoutDashboard], ["/admin/sessions", "Participants & sessions", Users], ["/admin/tasks", "Task management", SlidersHorizontal], ["/admin/logs", "Interaction logs", Package], ["/admin/analytics", "Analytics", BarChart3], ["/admin/feedback", "Feedback & UX issues", FlaskConical]];
export function AdminLayout() {
  const [open, setOpen] = useState(false); const loc = useLocation(); const { logout, theme, toggleTheme } = useStore(); const navigate = useNavigate();
  return <div className="min-h-screen bg-mist lg:flex"><aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between"><Link to="/admin" className="flex items-center gap-2 font-extrabold"><span className="grid size-9 place-items-center rounded-xl bg-teal text-white"><FlaskConical size={20} /></span>Research Console</Link><button onClick={() => setOpen(false)} className="lg:hidden"><X /></button></div><div className="mt-8 rounded-xl bg-blue-50 p-3 text-xs text-blue-800"><strong className="block">Demo workspace</strong>All metrics are labelled sample data, not research findings.</div><nav className="mt-6 space-y-1">{adminNav.map(([to, label, Icon], i) => <NavLink end={i === 0} key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${isActive ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}><Icon size={18} />{label}</NavLink>)}</nav><div className="absolute bottom-6 left-7 right-7 space-y-2"><Link className="block text-sm font-semibold text-slate-500" to="/">← Participant site</Link><button className="flex items-center gap-2 text-sm font-semibold text-slate-500" onClick={() => { logout(); navigate("/") }}><LogOut size={16} />Sign out</button></div></aside><section className="min-w-0 flex-1"><header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8"><div className="flex items-center"><button className="mr-3 lg:hidden" onClick={() => setOpen(true)}><Menu /></button><div><p className="text-xs font-semibold uppercase tracking-widest text-teal">Researcher dashboard</p><p className="font-bold">{adminNav.find(([to]) => to === loc.pathname)?.[1] || "Session detail"}</p></div></div><div className="flex items-center gap-3"><button type="button" onClick={toggleTheme} aria-label="Toggle theme" title={theme === "dark" ? "Switch to light theme" : "Switch to black theme"} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:border-teal hover:text-teal">{theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}</button><Badge tone="blue">Demo data</Badge></div></header><main className="p-5 lg:p-8"><Outlet /></main></section><Toasts /></div>;
}
