import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, tasks } from "./data";
import { authService } from "./services/auth-service";

const StoreContext = createContext(null);
const makeId = () => `SES-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [compare, setCompare] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [toasts, setToasts] = useState([]);
  const [task, setTask] = useState(() => JSON.parse(localStorage.getItem("eus-task") || "null"));
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(() => authService.getSession());
  const [wishlist, setWishlist] = useState([]);
  const [navigator, setNavigator] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("eus-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("eus-theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        document.body.classList.remove("dark");
      }
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setToasts((v) => v.filter((x) => !x.message.toLowerCase().includes("theme")));
    toast(next === "dark" ? "Black theme enabled" : "White theme enabled");
  };

  const dismissToast = (id) => {
    setToasts((v) => v.filter((x) => x.id !== id));
  };

  const toast = (message, tone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((v) => [...v, { id, message, tone }]);
    setTimeout(() => {
      setToasts((v) => v.filter((x) => x.id !== id));
    }, 3500);
  };
  const record = (type, target, metadata = {}) => {
    if (!task?.startedAt) return;
    setEvents((v) => [...v, { id: crypto.randomUUID(), timestamp: new Date().toISOString(), sessionId: task.sessionId, taskId: task.taskId, page: location.pathname, type, target, metadata }]);
  };
  const updateTask = (next) => {
    setTask((current) => {
      const value = { ...current, ...next };
      localStorage.setItem("eus-task", JSON.stringify(value));
      return value;
    });
  };
  const addCart = (product, qty = 1, customNavigate) => {
    if (!user) {
      try {
        sessionStorage.setItem("eus-pending-cart", JSON.stringify({ product, qty }));
      } catch (e) {
        /* ignore storage quota errors */
      }
      record("auth_required_for_cart", product.name, { quantity: qty });
      toast("Please sign in to add items to your cart", "error");
      const currentPath = typeof window !== "undefined" ? (window.location.pathname + window.location.search) : "/";
      const targetUrl = `/login?redirect=${encodeURIComponent(currentPath)}&reason=cart`;
      if (typeof customNavigate === "function") {
        customNavigate(targetUrl);
      } else if (navigator) {
        navigator(targetUrl);
      } else if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
      }
      return false;
    }
    setCart((v) => v.some((x) => x.id === product.id) ? v.map((x) => x.id === product.id ? { ...x, qty: x.qty + qty } : x) : [...v, { ...product, qty }]);
    record("add_to_cart", product.name, { quantity: qty });
    toast(`${product.name} added to cart`);
    return true;
  };
  const setQty = (id, qty) => {
    setCart((v) => v.map((x) => x.id === id ? { ...x, qty: Math.max(1, qty) } : x));
    record("quantity_change", products.find((p) => p.id === id)?.name, { quantity: Math.max(1, qty) });
  };
  const toggleCompare = (product) => {
    setCompare((v) => {
      if (v.some((x) => x.id === product.id)) return v.filter((x) => x.id !== product.id);
      if (v.length >= 4) { toast("You can compare up to 4 products", "error"); return v; }
      record("add_compare", product.name, { compare_count: v.length + 1 });
      return [...v, product];
    });
  };
  const startTask = (taskId = "TASK-01") => {
    const value = { taskId, sessionId: makeId(), participantId: `P-${Math.floor(1000 + Math.random() * 9000)}`, startedAt: Date.now(), status: "active" };
    setTask(value); localStorage.setItem("eus-task", JSON.stringify(value)); setEvents([]);
  };
  const evaluate = () => {
    const scenario = tasks.find((x) => x.id === task?.taskId);
    const item = cart.find((x) => x.id === scenario?.expectedProduct);
    const checks = { product: !!item, quantity: item?.qty === scenario?.quantity, coupon: !scenario?.coupon || coupon === scenario.coupon };
    const success = Object.values(checks).every(Boolean);
    updateTask({ status: success ? "success" : "failed", completedAt: Date.now(), checks });
    record("task_complete", "Order review", { result: success ? "success" : "failed" });
    return { success, checks };
  };
  const login = async (values) => {
    const next = await authService.login(values);
    setUser(next);
    toast(`Welcome back, ${next.name}`);
    try {
      const pendingStr = sessionStorage.getItem("eus-pending-cart");
      if (pendingStr) {
        const { product, qty } = JSON.parse(pendingStr);
        sessionStorage.removeItem("eus-pending-cart");
        setCart((v) => v.some((x) => x.id === product.id) ? v.map((x) => x.id === product.id ? { ...x, qty: x.qty + qty } : x) : [...v, { ...product, qty }]);
        record("add_to_cart", product.name, { quantity: qty, source: "post_login" });
        toast(`${product.name} added to cart`);
      }
    } catch {
      sessionStorage.removeItem("eus-pending-cart");
    }
    return next;
  };
  const register = async (values) => {
    const next = await authService.register(values);
    setUser(next);
    toast("Account created successfully");
    try {
      const pendingStr = sessionStorage.getItem("eus-pending-cart");
      if (pendingStr) {
        const { product, qty } = JSON.parse(pendingStr);
        sessionStorage.removeItem("eus-pending-cart");
        setCart((v) => v.some((x) => x.id === product.id) ? v.map((x) => x.id === product.id ? { ...x, qty: x.qty + qty } : x) : [...v, { ...product, qty }]);
        record("add_to_cart", product.name, { quantity: qty, source: "post_register" });
        toast(`${product.name} added to cart`);
      }
    } catch {
      sessionStorage.removeItem("eus-pending-cart");
    }
    return next;
  };
  const logout = () => {
    authService.logout();
    setUser(null);
    toast("You’ve been signed out");
  };
  const toggleWishlist = (id) => {
    setWishlist((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    toast(wishlist.includes(id) ? "Removed from saved items" : "Saved for later");
  };
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
  const value = useMemo(() => ({ cart, setCart, compare, toggleCompare, coupon, setCoupon, subtotal, discount: coupon === "SAVE10" ? subtotal * .1 : 0, addCart, setQty, toast, toasts, dismissToast, task, startTask, updateTask, events, record, evaluate, user, login, register, logout, wishlist, toggleWishlist, setNavigator, theme, toggleTheme }), [cart, compare, coupon, subtotal, task, events, toasts, user, wishlist, navigator, theme]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
