import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight, Check, CheckCircle2, ChevronLeft, Circle, Clock3,
  GitCompareArrows, Minus, Plus, ShieldCheck, ShoppingBag, Star,
  Trash2, XCircle,
} from "lucide-react";
import { Badge, Breadcrumbs, Button, ConfirmDialog, EmptyState, Field } from "./components";
import { products, tasks } from "./data";
import { useStore } from "./store";

/* ──────────────────────────────────── CART ─── */
export function Cart() {
  const { cart, setCart, setQty, subtotal, coupon, setCoupon, discount, toast, record } = useStore();
  const [code, setCode]     = useState(coupon || "");
  const [error, setError]   = useState("");
  const [remove, setRemove] = useState(null);

  const apply = () => {
    if (code.trim().toUpperCase() === "SAVE10") {
      setCoupon("SAVE10");
      setError("");
      toast("SAVE10 applied — 10% off");
      record("coupon_apply", "SAVE10", { valid: true });
    } else {
      setCoupon("");
      setError("That code isn't valid. For this demo, try SAVE10.");
      record("coupon_apply", code, { valid: false });
    }
  };

  if (!cart.length) return (
    <div className="page py-14">
      <Breadcrumbs items={["Cart"]} />
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        text="Browse the catalogue and add a product to continue the simulated checkout."
        action={<Link to="/catalogue"><Button>Browse products</Button></Link>}
      />
    </div>
  );

  return (
    <div className="page py-10">
      <Breadcrumbs items={["Cart"]} />
      <h1 className="page-title">Shopping bag</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

        {/* Items */}
        <div className="space-y-4">
          {cart.map((p) => (
            <div key={p.id} className="card flex flex-col gap-3.5 p-3.5 sm:p-4 sm:flex-row sm:items-center">
              {/* Image */}
              <div className="shrink-0 w-full sm:w-20 h-20 bg-[#F7F5F0] dark:bg-[#1a1f19] rounded-xl overflow-hidden flex items-center justify-center p-1.5">
                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A8B8A0]">{p.brand}</p>
                <Link to={`/product/${p.id}`} className="mt-0.5 block font-semibold text-[#292B28] dark:text-[#E8EAE5] hover:text-[#244C3A] transition-colors">
                  {p.name}
                </Link>
                <p className="mt-1 text-sm text-[#777970]">${p.price.toFixed(2)} each</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Qty */}
                <div className="inline-flex items-center rounded-xl border-[1.5px] border-[#E7E2D9] dark:border-[#2B3329] overflow-hidden">
                  <button
                    onClick={() => setQty(p.id, p.qty - 1)}
                    className="px-3 py-2 text-[#777970] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-[#292B28] dark:text-[#E8EAE5]">{p.qty}</span>
                  <button
                    onClick={() => setQty(p.id, p.qty + 1)}
                    className="px-3 py-2 text-[#777970] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors"
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <strong className="text-[#292B28] dark:text-[#E8EAE5] font-bold">${(p.price * p.qty).toFixed(2)}</strong>

                <button
                  onClick={() => setRemove(p)}
                  className="p-1.5 rounded-lg text-[#A8B8A0] hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="card h-fit p-6">
          <h2 className="font-serif text-xl font-medium text-[#292B28] dark:text-[#E8EAE5]">Order summary</h2>

          {/* Coupon */}
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#777970]">Coupon code</p>
            <div className="flex gap-2">
              <input
                className="input flex-1 min-w-0"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SAVE10"
                aria-label="Coupon code"
              />
              <Button variant="secondary" onClick={apply}>Apply</Button>
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            {coupon && !error && <p className="mt-2 text-xs font-semibold text-emerald-600">✓ {coupon} applied</p>}
          </div>

          {/* Totals */}
          <dl className="mt-6 space-y-3 border-y border-[#E7E2D9] dark:border-[#2B3329] py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#777970]">Subtotal</dt>
              <dd className="font-semibold text-[#292B28] dark:text-[#E8EAE5]">${subtotal.toFixed(2)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-emerald-600">Discount</dt>
                <dd className="font-semibold text-emerald-600">−${discount.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#777970]">Delivery</dt>
              <dd className="text-[#777970]">Calculated next</dd>
            </div>
          </dl>

          <div className="flex justify-between py-5 text-lg font-bold text-[#292B28] dark:text-[#E8EAE5]">
            <span>Total</span>
            <span>${(subtotal - discount).toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="block">
            <Button className="w-full justify-center">
              Checkout <ArrowRight size={16} />
            </Button>
          </Link>

          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-[#A8B8A0]">
            <ShieldCheck size={13} />
            Simulation only — no payment collected
          </p>
        </aside>
      </div>

      <ConfirmDialog
        open={!!remove}
        title="Remove item?"
        text={`Remove ${remove?.name} from your bag?`}
        onClose={() => setRemove(null)}
        onConfirm={() => {
          setCart((v) => v.filter((x) => x.id !== remove.id));
          setRemove(null);
          toast("Item removed from bag");
        }}
      />
    </div>
  );
}

/* ─────────────────────────────── CHECKOUT ─── */
export function Checkout() {
  const { cart, subtotal, discount, evaluate, task, record } = useStore();
  const navigate = useNavigate();
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ name: "", email: "", address: "", city: "", postcode: "", delivery: "standard" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = sessionStorage.getItem("checkout-form");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const update = (k, v) => {
    const n = { ...form, [k]: v };
    setForm(n);
    sessionStorage.setItem("checkout-form", JSON.stringify(n));
  };

  const next = () => {
    if (step === 1) {
      const e = {};
      if (!form.name.trim())             e.name     = "Enter your full name";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.address.trim())          e.address  = "Enter a delivery address";
      if (!form.city.trim())             e.city     = "Enter a city";
      if (!form.postcode.trim())         e.postcode = "Enter a postal code";
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    record("checkout_continue", `Step ${step}`, {});
    setStep((s) => s + 1);
  };

  const finish = () => {
    const r = task?.startedAt ? evaluate() : { success: true };
    navigate("/confirmation", { state: { result: r, form } });
  };

  if (!cart.length) return (
    <div className="page py-14">
      <EmptyState
        title="Checkout needs a cart"
        text="Add at least one product before opening checkout."
        action={<Link to="/catalogue"><Button>Browse products</Button></Link>}
      />
    </div>
  );

  const steps = ["Details", "Delivery", "Review"];

  return (
    <div className="page max-w-4xl py-10">
      <Breadcrumbs items={["Cart", "Checkout"]} />
      <h1 className="page-title">Checkout</h1>

      {/* Step indicator */}
      <div className="mt-8 flex items-center">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors ${
              step > i + 1
                ? "bg-[#244C3A] text-white"
                : step === i + 1
                  ? "bg-[#244C3A] text-white ring-4 ring-[#244C3A]/20"
                  : "bg-[#EEE9DF] text-[#A8B8A0]"
            }`}>
              {step > i + 1 ? <Check size={15} /> : i + 1}
            </span>
            <span className="ml-2.5 hidden text-xs font-semibold text-[#292B28] dark:text-[#E8EAE5] sm:inline">{label}</span>
            {i < 2 && (
              <span className={`mx-3 h-px flex-1 transition-colors ${step > i + 1 ? "bg-[#244C3A]" : "bg-[#E7E2D9] dark:bg-[#2B3329]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6 md:p-9">
        {/* Step 1 — Contact */}
        {step === 1 && (
          <>
            <h2 className="font-serif text-2xl font-medium text-[#292B28] dark:text-[#E8EAE5]">Contact & delivery details</h2>
            <p className="mt-1.5 text-sm text-[#777970]">All fields are used only for this simulation.</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Full name"      value={form.name}     onChange={(e) => update("name",     e.target.value)} error={errors.name}     placeholder="Jane Smith" />
              <Field label="Email address"  value={form.email}    onChange={(e) => update("email",    e.target.value)} error={errors.email}    placeholder="jane@example.com" type="email" />
              <div className="sm:col-span-2">
                <Field label="Street address" value={form.address} onChange={(e) => update("address", e.target.value)} error={errors.address} placeholder="123 Main Street" />
              </div>
              <Field label="City"           value={form.city}     onChange={(e) => update("city",     e.target.value)} error={errors.city}     placeholder="London" />
              <Field label="Postal code"    value={form.postcode} onChange={(e) => update("postcode", e.target.value)} error={errors.postcode} placeholder="EC1A 1BB" />
            </div>
          </>
        )}

        {/* Step 2 — Delivery */}
        {step === 2 && (
          <>
            <h2 className="font-serif text-2xl font-medium text-[#292B28] dark:text-[#E8EAE5]">Delivery method</h2>
            <div className="mt-6 grid gap-3">
              {[
                ["standard", "Standard delivery",  "3–5 business days", "Free"],
                ["express",  "Express delivery",   "1–2 business days", "$12.00"],
              ].map(([val, title, time, price]) => (
                <label
                  key={val}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] p-4 transition-all ${
                    form.delivery === val
                      ? "border-[#244C3A] bg-[#EEE9DF]/50"
                      : "border-[#E7E2D9] dark:border-[#2B3329] hover:border-[#A8B8A0]"
                  }`}
                >
                  <input
                    type="radio" name="delivery"
                    checked={form.delivery === val}
                    onChange={() => update("delivery", val)}
                    className="accent-[#244C3A]"
                  />
                  <span className="flex-1">
                    <strong className="block text-sm text-[#292B28] dark:text-[#E8EAE5]">{title}</strong>
                    <span className="text-xs text-[#777970]">{time}</span>
                  </span>
                  <strong className="text-sm text-[#292B28] dark:text-[#E8EAE5]">{price}</strong>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <>
            <h2 className="font-serif text-2xl font-medium text-[#292B28] dark:text-[#E8EAE5]">Review your order</h2>
            <div className="mt-6 divide-y divide-[#E7E2D9] dark:divide-[#2B3329]">
              {cart.map((p) => (
                <div key={p.id} className="flex justify-between py-3.5 text-sm">
                  <span className="text-[#292B28] dark:text-[#E8EAE5]">{p.qty} × {p.name}</span>
                  <strong className="text-[#292B28] dark:text-[#E8EAE5]">${(p.qty * p.price).toFixed(2)}</strong>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-[#EEE9DF] dark:bg-[#1a1f19] p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#777970]">Deliver to</span>
                <strong className="text-[#292B28] dark:text-[#E8EAE5]">{form.name}, {form.city}</strong>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-[#777970]">Method</span>
                <strong className="capitalize text-[#292B28] dark:text-[#E8EAE5]">{form.delivery}</strong>
              </div>
              {discount > 0 && (
                <div className="mt-2 flex justify-between">
                  <span className="text-emerald-600">Discount</span>
                  <strong className="text-emerald-600">−${discount.toFixed(2)}</strong>
                </div>
              )}
              <div className="mt-4 flex justify-between border-t border-[#E7E2D9] dark:border-[#2B3329] pt-4 text-base">
                <span className="font-semibold text-[#292B28] dark:text-[#E8EAE5]">Total</span>
                <strong className="text-[#292B28] dark:text-[#E8EAE5]">
                  ${(subtotal - discount + (form.delivery === "express" ? 12 : 0)).toFixed(2)}
                </strong>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#A8B8A0]">Placing this order will not charge you or create a real order.</p>
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1
            ? <Button variant="secondary" onClick={() => setStep((s) => s - 1)}><ChevronLeft size={16} />Back</Button>
            : <Link to="/cart"><Button variant="ghost">Back to bag</Button></Link>
          }
          {step < 3
            ? <Button onClick={next}>Continue <ArrowRight size={16} /></Button>
            : <Button onClick={finish}>Place simulated order</Button>
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── CONFIRMATION ─── */
export function Confirmation() {
  const { task } = useStore();
  const success  = task?.status !== "failed";

  return (
    <div className="page max-w-3xl py-16">
      <div className="card p-8 text-center md:p-14">
        <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          success ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
        }`}>
          {success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </span>
        <p className="eyebrow mt-7">Order complete</p>
        <h1 className="page-title mt-2">Order confirmed</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#777970]">
          Thank you for your order. A simulated confirmation email has been dispatched. No real charges have been made.
        </p>

        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-[#EEE9DF] dark:bg-[#1a1f19] p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-[#777970]">Reference</span>
            <strong className="font-mono text-[#292B28] dark:text-[#E8EAE5]">DEMO-{Date.now().toString().slice(-6)}</strong>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/"><Button>Return home</Button></Link>
          <Link to="/catalogue"><Button variant="secondary">Continue shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── COMPARE ─── */
export function Compare() {
  const { compare, toggleCompare, addCart } = useStore();
  const navigate = useNavigate();

  if (!compare.length) return (
    <div className="page py-14">
      <Breadcrumbs items={["Compare"]} />
      <EmptyState
        icon={GitCompareArrows}
        title="Nothing to compare yet"
        text="Add two to four products to see their differences side by side."
        action={<Link to="/catalogue"><Button>Browse products</Button></Link>}
      />
    </div>
  );

  const keys = [...new Set(compare.flatMap((p) => Object.keys(p.specs)))];

  return (
    <div className="page py-10">
      <Breadcrumbs items={["Compare"]} />
      <div className="mb-7">
        <p className="eyebrow">Side-by-side</p>
        <h1 className="page-title mt-1">Compare products</h1>
        <p className="mt-1.5 text-sm text-[#777970]">Differences are highlighted to help you evaluate.</p>
      </div>

      <div className="table-wrap">
        <table className="w-full min-w-[640px] text-left">
          <tbody>
            {/* Product header row */}
            <tr>
              <th className="compare-label">Product</th>
              {compare.map((p) => (
                <td key={p.id} className="compare-cell">
                  <button
                    className="float-right text-[#A8B8A0] hover:text-red-500 transition-colors"
                    onClick={() => toggleCompare(p)}
                    aria-label={`Remove ${p.name}`}
                  >
                    <XCircle size={17} />
                  </button>
                  <div className="mb-2.5 h-20 sm:h-24 w-full overflow-hidden rounded-xl bg-[#F7F5F0] dark:bg-[#1a1f19] flex items-center justify-center p-2">
                    <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <Link className="font-semibold text-sm text-[#292B28] dark:text-[#E8EAE5] hover:text-[#244C3A]" to={`/product/${p.id}`}>
                    {p.name}
                  </Link>
                </td>
              ))}
            </tr>

            {/* Attribute rows */}
            {[
              ["Price",  (p) => `$${p.price.toFixed(2)}`],
              ["Rating", (p) => `${p.rating} / 5`],
              ["Brand",  (p) => p.brand],
              ...keys.map((k) => [k, (p) => p.specs[k] || "—"]),
            ].map(([label, get]) => {
              const vals = compare.map(get);
              const diff = new Set(vals).size > 1;
              return (
                <tr key={label}>
                  <th className="compare-label">{label}</th>
                  {compare.map((p) => (
                    <td
                      key={p.id}
                      className={`compare-cell ${diff ? "bg-amber-50/60 dark:bg-[#2B3329]/60" : ""}`}
                    >
                      {get(p)}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Add to cart row */}
            <tr>
              <th className="compare-label">Action</th>
              {compare.map((p) => (
                <td key={p.id} className="compare-cell">
                  <Button className="w-full justify-center" onClick={() => addCart(p, 1, navigate)}>
                    Add to bag
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Link
        to="/catalogue"
        className="mt-5 inline-block text-sm font-semibold text-[#244C3A] hover:underline"
      >
        + Add or replace products
      </Link>
    </div>
  );
}

/* ──────────────────────────────── TASK MODE ─── */
export function TaskMode() {
  const { task, startTask, cart, coupon, compare } = useStore();
  const [now, setNow] = useState(Date.now());
  const scenario = tasks.find((x) => x.id === (task?.taskId || "TASK-01"));

  useEffect(() => {
    if (!task?.startedAt || task.status !== "active") return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [task]);

  const elapsed = task?.startedAt
    ? Math.floor(((task.completedAt || now) - task.startedAt) / 1000) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const target = cart.find((x) => x.id === scenario.expectedProduct);
  const checks = [
    ["Compare the two products", compare.some((x) => x.id === scenario.expectedProduct) && compare.some((x) => x.id === scenario.compareProduct)],
    ["Choose AeroSound Pro",     !!target],
    [`Set quantity to ${scenario.quantity}`, target?.qty === scenario.quantity],
    ["Apply SAVE10",             coupon === scenario.coupon],
    ["Reach final checkout",     task?.status === "success"],
  ];

  /* Pre-task screen */
  if (!task?.startedAt) return (
    <div className="page max-w-4xl py-10">
      <Breadcrumbs items={["Task mode"]} />
      <div className="card overflow-hidden">
        {/* Banner */}
        <div className="bg-[#244C3A] p-7 text-white md:p-10">
          <Badge tone="green">Participant study</Badge>
          <h1 className="mt-4 font-serif text-3xl font-semibold">{scenario.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A8B8A0]">
            Read the task carefully before beginning. The timer and event recording start only when you select "Begin task."
          </p>
        </div>
        {/* Details */}
        <div className="p-7 md:p-10">
          <h2 className="font-semibold text-[#292B28] dark:text-[#E8EAE5]">Your task</h2>
          <div className="mt-3 rounded-2xl bg-[#EEE9DF] dark:bg-[#1a1f19] p-5 text-sm leading-relaxed text-[#292B28] dark:text-[#E8EAE5]">
            {scenario.instructions}
          </div>
          <div className="mt-5 flex items-start gap-3 text-sm text-[#777970]">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#A8B8A0]" size={18} />
            <p>Your interactions are recorded for this demo session only. No personal data or real payment details are required.</p>
          </div>
          <div className="mt-7">
            <Button onClick={() => startTask(scenario.id)}>
              Begin task <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  /* Active task screen */
  return (
    <div className="page py-10">
      <Breadcrumbs items={["Task mode"]} />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

        <div className="space-y-5">
          {/* Task card */}
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge tone={task.status === "success" ? "green" : task.status === "failed" ? "red" : "blue"}>
                  {task.status === "active" ? "In progress" : task.status}
                </Badge>
                <h1 className="mt-3 font-serif text-2xl font-medium text-[#292B28] dark:text-[#E8EAE5]">{scenario.title}</h1>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#EEE9DF] dark:bg-[#2B3329] px-4 py-3 font-mono text-xl font-bold text-[#292B28] dark:text-[#E8EAE5]">
                <Clock3 size={18} className="text-[#A8B8A0]" />
                {mm}:{ss}
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#777970]">{scenario.instructions}</p>
            <div className="mt-6 flex gap-3">
              <Link to="/catalogue">
                <Button disabled={task.status !== "active"}>
                  Continue shopping <ArrowRight size={16} />
                </Button>
              </Link>
              {task.status !== "active" && (
                <Button variant="secondary" onClick={() => startTask(scenario.id)}>Try again</Button>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="card p-6">
            <h2 className="font-semibold text-[#292B28] dark:text-[#E8EAE5] mb-4">Completion checklist</h2>
            <div className="space-y-3">
              {checks.map(([label, done]) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  {done
                    ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                    : <Circle      size={18} className="shrink-0 text-[#D4CDBF]" />}
                  <span className={done ? "text-[#A8B8A0] line-through" : "font-medium text-[#292B28] dark:text-[#E8EAE5]"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="card h-fit p-6">
          <p className="eyebrow mb-4">Session details</p>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[#777970]">Participant ID</dt>
              <dd className="mt-1 font-mono font-bold text-[#292B28] dark:text-[#E8EAE5]">{task.participantId}</dd>
            </div>
            <div>
              <dt className="text-[#777970]">Session ID</dt>
              <dd className="mt-1 font-mono font-bold text-[#292B28] dark:text-[#E8EAE5]">{task.sessionId}</dd>
            </div>
            <div>
              <dt className="text-[#777970]">Task</dt>
              <dd className="mt-1 font-bold text-[#292B28] dark:text-[#E8EAE5]">{task.taskId}</dd>
            </div>
          </dl>
          <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
            Leaving before confirmation preserves progress and marks the session incomplete until resumed.
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────────── 404 ─── */
export function NotFound() {
  return (
    <div className="page py-16">
      <EmptyState
        title="Page not found"
        text="The page you're looking for doesn't exist or has been moved."
        action={<Link to="/"><Button>Return home</Button></Link>}
      />
    </div>
  );
}
