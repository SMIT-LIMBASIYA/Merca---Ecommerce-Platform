import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bookmark, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Filter, GitCompareArrows, Grid3X3, Headphones, Heart, Home as HomeIcon, Laptop, List, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Watch, X, Zap } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Badge, Breadcrumbs, Button, EmptyState, Select } from "./components";
import { products } from "./data";
import ProductCard from "./product-card";
import { useStore } from "./store";

const categories = ["All", ...new Set(products.map((p) => p.category))];
const categoryIcons = { Audio: Headphones, Wearables: Watch, Cameras: Sparkles, Home: HomeIcon, Bags: ShoppingBag, Footwear: Sparkles };

function AmazonQuadrantCard({ title, items, linkText, linkTo }) {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between rounded-none">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-snug">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((it, idx) => (
            <Link
              key={idx}
              to={`/product/${it.id}`}
              className="group flex flex-col items-start"
            >
              <div className="w-full aspect-[4/3] bg-slate-50 dark:bg-[#0a0e17] overflow-hidden flex items-center justify-center p-2 rounded-sm border border-slate-100 dark:border-slate-800/60">
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                />
              </div>
              <span className="text-xs text-slate-800 dark:text-slate-300 font-medium mt-1.5 line-clamp-1 group-hover:text-[#007185] dark:group-hover:text-[#5eead4]">
                {it.label || it.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Link
        to={linkTo}
        className="text-xs font-semibold text-[#007185] dark:text-[#5eead4] hover:text-[#c7511f] hover:underline mt-4 inline-block"
      >
        {linkText}
      </Link>
    </div>
  );
}

function AmazonFeaturedDealCard({ title, product, linkText, linkTo }) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  return (
    <div className="bg-white dark:bg-[#111827] p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between rounded-none">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-snug">
          {title}
        </h2>
        <Link to={`/product/${product.id}`} className="block group">
          <div className="w-full aspect-[4/3] bg-slate-50 dark:bg-[#0a0e17] overflow-hidden flex items-center justify-center p-3 rounded-sm border border-slate-100 dark:border-slate-800/60">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
              {discount}% off
            </span>
            <span className="text-[#cc0c39] font-bold text-xs">Limited time deal</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              <span className="text-xs align-top font-semibold">$</span>
              {Math.floor(product.price)}
              <span className="text-xs align-top font-semibold">
                {((product.price % 1) * 100).toFixed(0).padStart(2, "0")}
              </span>
            </span>
            <span className="text-xs text-slate-500 line-through">
              List: ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-1 group-hover:text-[#007185] dark:group-hover:text-[#5eead4]">
            {product.name}
          </p>
        </Link>
      </div>
      <Link
        to={linkTo}
        className="text-xs font-semibold text-[#007185] dark:text-[#5eead4] hover:text-[#c7511f] hover:underline mt-4 inline-block"
      >
        {linkText}
      </Link>
    </div>
  );
}

function AmazonUserCard({ user }) {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between rounded-none">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
          {user ? `Hi, ${user.name}` : "Sign in for the best experience"}
        </h2>
        {user ? (
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your research participant demo profile is active and saving preferences.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[products[8], products[9], products[10], products[11]].map((it) => (
                <Link key={it.id} to={`/product/${it.id}`} className="group block">
                  <div className="aspect-square bg-slate-50 dark:bg-[#0a0e17] p-2 flex items-center justify-center rounded-sm border border-slate-100 dark:border-slate-800">
                    <img src={it.image} alt={it.name} className="h-full w-full object-contain group-hover:scale-105 transition" />
                  </div>
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-1 mt-1 font-medium">{it.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Sign in to add items to your cart, participate in the study, and view past simulator activity.
            </p>
            <Link to="/login" className="block">
              <button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold py-2 px-4 rounded-lg text-xs shadow-sm transition active:scale-[0.99] cursor-pointer">
                Sign in securely
              </button>
            </Link>
            <p className="mt-3 text-center text-xs text-slate-600 dark:text-slate-400">
              New customer?{" "}
              <Link to="/register" className="text-[#007185] dark:text-[#5eead4] hover:underline font-bold">
                Start here.
              </Link>
            </p>
            <div className="mt-5 p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
              <strong className="block font-bold">Academic Usability Lab</strong>
              Free simulated next-day delivery on all eligible demo products.
            </div>
          </div>
        )}
      </div>
      <Link
        to={user ? "/task" : "/catalogue"}
        className="text-xs font-semibold text-[#007185] dark:text-[#5eead4] hover:text-[#c7511f] hover:underline mt-4 inline-block"
      >
        {user ? "View usability study status" : "Explore full catalogue"}
      </Link>
    </div>
  );
}

function AmazonProductItem({ product, onAddCart }) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  return (
    <article className="bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 p-3.5 sm:p-4 flex flex-col justify-between transition-colors duration-200 rounded-none group">
      <div>
        <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] h-44 sm:h-48 bg-[#FAF8F4] dark:bg-[#111827] p-3 overflow-hidden border-b border-[#D8D2C8] dark:border-slate-800 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#EAE5DD] dark:bg-slate-800 text-[#302E2A] dark:text-slate-300 text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 border border-[#D8D2C8] dark:border-slate-700">
              −{discount}%
            </span>
          )}
        </Link>
        <p className="mt-3 text-[9px] font-medium uppercase tracking-widest text-[#77736C] dark:text-slate-400">
          {product.brand} · {product.category}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="mt-1 line-clamp-1 font-serif text-lg sm:text-xl font-normal text-[#302E2A] dark:text-slate-100 hover:opacity-75 leading-snug"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-semibold text-[#302E2A] dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] text-[#77736C] dark:text-slate-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <p className="mt-1 text-[10px] text-[#77736C] dark:text-slate-400 font-light">
          {product.availability} · Solid craftsmanship
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-[#D8D2C8] dark:border-slate-800">
        <button
          onClick={() => onAddCart(product)}
          className="w-full bg-[#383630] hover:bg-[#201f1c] text-[#FAF8F4] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-[11px] font-semibold uppercase tracking-wider py-2.5 px-3 rounded-none transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </article>
  );
}

export function Home() {
  const { addCart, user } = useStore();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  const heroSlides = [
    {
      badge: "LIMITED TIME SAVINGS",
      title: "Big Spring Tech Deals · Up to 40% Off",
      sub: "Explore studio-grade noise-cancelling headphones and portable sound systems.",
      product: products[0],
      bgGradient: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
      accent: "#febd69",
      cta: "Shop audio deals",
      link: "/catalogue?category=Audio",
    },
    {
      badge: "NEXT-GEN WEARABLES",
      title: "Track Every Step with Pulse & Orbit",
      sub: "Lightweight fitness tracking, brilliant OLED displays, and multi-day battery.",
      product: products[1],
      bgGradient: "from-[#042831] via-[#0b3c46] to-[#042831]",
      accent: "#5eead4",
      cta: "Explore smart watches",
      link: "/catalogue?category=Wearables",
    },
    {
      badge: "HOME & LIFESTYLE EDIT",
      title: "Practical Upgrades for Everyday Living",
      sub: "Precision coffee makers, task lighting, and commuter storage built to last.",
      product: products[6],
      bgGradient: "from-[#291705] via-[#43260a] to-[#291705]",
      accent: "#fdba74",
      cta: "Shop home upgrades",
      link: "/catalogue?category=Home",
    },
    {
      badge: "USABILITY LAB STUDY",
      title: "Merca Interactive Research Study",
      sub: "Follow guided participant shopping tasks while the simulator logs UX telemetry.",
      product: products[2],
      bgGradient: "from-[#131921] via-[#232f3e] to-[#131921]",
      accent: "#febd69",
      cta: "Start participant study",
      link: "/task",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const curr = heroSlides[slide];

  return (
    <div className="bg-[#F3F0EB] dark:bg-[#080c14] min-h-screen pb-16">
      {/* 1. Hero Carousel Banner with Bottom Gradient Fade */}
      <section className="relative overflow-hidden w-full min-h-[380px] sm:min-h-[460px] md:min-h-[540px] lg:min-h-[600px] select-none">
        <div className={`absolute inset-0 bg-gradient-to-r ${curr.bgGradient} transition-all duration-700 ease-out`}>
          <div className="page h-full flex flex-col justify-center pt-8 pb-32 sm:pb-48 md:pb-64">
            <div className="grid lg:grid-cols-2 items-center gap-8 h-full">
              <div className="z-10 max-w-xl text-white">
                <span className="inline-block bg-[#cc0c39] text-white text-xs font-black uppercase px-2.5 py-1 rounded tracking-wider mb-4">
                  {curr.badge}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
                  {curr.title}
                </h1>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-200 leading-relaxed max-w-lg">
                  {curr.sub}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link to={curr.link}>
                    <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-extrabold px-6 py-3 rounded-full text-sm shadow-md transition active:scale-95 cursor-pointer">
                      {curr.cta} →
                    </button>
                  </Link>
                  <Link to="/task">
                    <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-full text-sm border border-white/30 backdrop-blur-sm transition cursor-pointer">
                      Usability Study
                    </button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center relative">
                <div className="relative w-80 h-80 rounded-2xl p-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center">
                  <img
                    src={curr.product.image}
                    alt={curr.product.name}
                    className="max-h-64 max-w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20">
                    From ${curr.product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Controls */}
        <button
          onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Previous slide"
          className="absolute left-2 top-28 sm:top-36 md:top-44 -translate-y-1/2 p-3 sm:p-4 rounded text-white bg-black/20 hover:bg-black/50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f90] z-20"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          aria-label="Next slide"
          className="absolute right-2 top-28 sm:top-36 md:top-44 -translate-y-1/2 p-3 sm:p-4 rounded text-white bg-black/20 hover:bg-black/50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f90] z-20"
        >
          <ChevronRight size={28} />
        </button>

        {/* Bottom Fade Mask */}
        <div className="absolute inset-x-0 bottom-0 h-48 sm:h-64 md:h-80 bg-gradient-to-t from-[#F3F0EB] via-[#F3F0EB]/85 to-transparent dark:from-[#080c14] dark:via-[#080c14]/85 pointer-events-none z-10" />
      </section>

      {/* 2. Signature Amazon 4-Quadrant Floating Cards Grid */}
      <div className="page -mt-28 sm:-mt-44 md:-mt-64 relative z-20 mb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AmazonQuadrantCard
            title="Top categories in tech"
            items={[
              { id: products[0].id, name: products[0].name, image: products[0].image, label: "Headphones" },
              { id: products[1].id, name: products[1].name, image: products[1].image, label: "Smart watches" },
              { id: products[2].id, name: products[2].name, image: products[2].image, label: "Cameras" },
              { id: products[3].id, name: products[3].name, image: products[3].image, label: "Speakers" },
            ]}
            linkText="Shop tech deals"
            linkTo="/catalogue?category=Audio"
          />

          <AmazonQuadrantCard
            title="Everyday home & gear"
            items={[
              { id: products[6].id, name: products[6].name, image: products[6].image, label: "Coffee makers" },
              { id: products[7].id, name: products[7].name, image: products[7].image, label: "Task lights" },
              { id: products[4].id, name: products[4].name, image: products[4].image, label: "Backpacks" },
              { id: products[5].id, name: products[5].name, image: products[5].image, label: "Footwear" },
            ]}
            linkText="Explore home & essentials"
            linkTo="/catalogue?category=Home"
          />

          <AmazonFeaturedDealCard
            title="Today’s Featured Deal"
            product={products[0]}
            linkText="See all deals"
            linkTo="/catalogue"
          />

          <AmazonUserCard user={user} />
        </div>
      </div>

      {/* 3. Horizontal Product Strip: Today's Deals */}
      <section className="page mb-8">
        <div className="bg-white dark:bg-[#111827] p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Today’s Deals
              </h2>
              <span className="text-xs font-semibold text-[#cc0c39] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                Up to 35% off
              </span>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-semibold text-[#007185] dark:text-[#5eead4] hover:text-[#c7511f] hover:underline"
            >
              See all deals →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
            {products.slice(0, 7).map((p) => {
              const discount = Math.round((1 - p.price / p.originalPrice) * 100);
              return (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group flex-shrink-0 w-44 sm:w-52 p-3 bg-slate-50 dark:bg-[#0a0e17] rounded-none border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition"
                >
                  <div className="aspect-square w-full p-2 bg-white dark:bg-[#101726] flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      {discount}% off
                    </span>
                    <span className="text-[#cc0c39] text-[11px] font-bold">Deal</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <strong className="text-base font-extrabold text-slate-900 dark:text-white">
                      ${p.price.toFixed(2)}
                    </strong>
                    <span className="text-[11px] text-slate-400 line-through">
                      ${p.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 truncate font-medium group-hover:text-[#007185] dark:group-hover:text-[#5eead4]">
                    {p.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Second 4-Quadrant Row */}
      <section className="page mb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AmazonQuadrantCard
            title="Best Sellers in Cameras"
            items={[
              { id: products[2].id, name: products[2].name, image: products[2].image, label: "4K Mirrorless" },
              { id: products[10].id, name: products[10].name, image: products[10].image, label: "Field Camera X" },
              { id: products[3].id, name: products[3].name, image: products[3].image, label: "Audio gear" },
              { id: products[7].id, name: products[7].name, image: products[7].image, label: "Studio lights" },
            ]}
            linkText="See more cameras"
            linkTo="/catalogue?category=Cameras"
          />

          <AmazonQuadrantCard
            title="Audio upgrades for daily use"
            items={[
              { id: products[0].id, name: products[0].name, image: products[0].image, label: "AeroSound Pro" },
              { id: products[8].id, name: products[8].name, image: products[8].image, label: "Studio Buds 2" },
              { id: products[3].id, name: products[3].name, image: products[3].image, label: "Beam Speaker" },
              { id: products[1].id, name: products[1].name, image: products[1].image, label: "Pulse S4" },
            ]}
            linkText="Browse all audio"
            linkTo="/catalogue?category=Audio"
          />

          <AmazonQuadrantCard
            title="Everyday carry & packs"
            items={[
              { id: products[4].id, name: products[4].name, image: products[4].image, label: "Commuter pack" },
              { id: products[11].id, name: products[11].name, image: products[11].image, label: "Metro sling" },
              { id: products[5].id, name: products[5].name, image: products[5].image, label: "Knit runners" },
              { id: products[9].id, name: products[9].name, image: products[9].image, label: "Orbit watch" },
            ]}
            linkText="Shop backpacks & bags"
            linkTo="/catalogue?category=Bags"
          />

          <div className="bg-gradient-to-br from-[#131921] to-[#232f3e] text-white p-5 shadow-sm border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#febd69] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider mb-2">
                STUDY SCENARIO
              </span>
              <h2 className="text-xl font-bold leading-tight text-white mb-2">
                Ready for the shopping usability task?
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Follow guided scenario TASK-01 (comparing headphones, choosing AeroSound Pro, and testing checkout).
              </p>
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#febd69]" /> No credit cards required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#febd69]" /> Real-time telemetry recording
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#febd69]" /> Free guest participation
                </div>
              </div>
            </div>
            <Link to="/task" className="mt-5 block">
              <button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-extrabold py-2 px-4 rounded-lg text-xs shadow-sm transition active:scale-[0.99] cursor-pointer">
                Enter Task Mode →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Amazon Product Grid: Recommended For You */}
      <section className="page">
        <div className="bg-white dark:bg-[#111827] p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Inspired by your shopping trends
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Top customer-rated electronics, audio, and home gear
              </p>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-semibold text-[#007185] dark:text-[#5eead4] hover:text-[#c7511f] hover:underline"
            >
              Shop full catalogue ({products.length} products) →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <AmazonProductItem
                key={p.id}
                product={p}
                onAddCart={(item) => addCart(item, 1, navigate)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterPanel({ category, setCategory, brand, setBrand, rating, setRating, minPrice, setMinPrice, maxPrice, setMaxPrice, clear, onClose, record }) {
  const apply = (name, value, setter) => {
    setter(value);
    record("filter_change", name, { value });
  };

  return (
    <div className="text-[#302E2A] dark:text-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8] dark:border-slate-800">
        <h3 className="font-serif text-xl font-normal tracking-tight text-[#302E2A] dark:text-white">Filters</h3>
        <div className="flex items-center gap-3">
          <button onClick={clear} className="text-xs uppercase tracking-wider font-medium text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition cursor-pointer">
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 lg:hidden text-[#77736C] hover:text-[#302E2A] cursor-pointer" aria-label="Close filters">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6 text-xs">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400 mb-2">
            Department
          </label>
          <select
            value={category}
            onChange={(e) => apply("category", e.target.value, setCategory)}
            className="w-full bg-[#FAF8F4] dark:bg-slate-900 border border-[#D8D2C8] dark:border-slate-800 p-2.5 text-xs text-[#302E2A] dark:text-slate-100 outline-none rounded-none focus:border-[#383630]"
          >
            {categories.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-[#D8D2C8] dark:border-slate-800">
          <p className="text-[11px] uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400 mb-3">
            Maker / Brand
          </p>
          <div className="space-y-2">
            {["All", ...new Set(products.map((p) => p.brand))].map((x) => (
              <label className="flex items-center gap-2.5 text-xs text-[#77736C] dark:text-slate-300 cursor-pointer hover:text-[#302E2A] dark:hover:text-white transition" key={x}>
                <input
                  type="radio"
                  name="brand"
                  checked={brand === x}
                  onChange={() => apply("brand", x, setBrand)}
                  className="accent-[#383630] cursor-pointer"
                />
                <span>{x}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#D8D2C8] dark:border-slate-800">
          <p className="text-[11px] uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400 mb-3">
            Customer Rating
          </p>
          {[4.5, 4, 0].map((x) => (
            <label className="mt-2 flex items-center gap-2 text-xs text-[#77736C] dark:text-slate-300 cursor-pointer hover:text-[#302E2A] dark:hover:text-white transition" key={x}>
              <input
                type="radio"
                name="rating"
                checked={+rating === x}
                onChange={() => apply("rating", String(x), setRating)}
                className="accent-[#383630] cursor-pointer"
              />
              {x ? (
                <span className="flex items-center gap-1.5">
                  <span className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={12} className={n <= Math.floor(x) ? "fill-[#77736C] text-[#77736C]" : "text-[#D8D2C8]"} />
                    ))}
                  </span>
                  <span>{x} & up</span>
                </span>
              ) : (
                "All ratings"
              )}
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-[#D8D2C8] dark:border-slate-800">
          <p className="text-[11px] uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400 mb-2">
            Price Range ($)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] text-[#77736C] font-light">
              Min
              <input
                className="w-full mt-1 bg-[#FAF8F4] dark:bg-slate-900 border border-[#D8D2C8] dark:border-slate-800 p-2 text-xs text-[#302E2A] dark:text-slate-100 outline-none rounded-none"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(+e.target.value)}
              />
            </label>
            <label className="text-[11px] text-[#77736C] font-light">
              Max
              <input
                className="w-full mt-1 bg-[#FAF8F4] dark:bg-slate-900 border border-[#D8D2C8] dark:border-slate-800 p-2 text-xs text-[#302E2A] dark:text-slate-100 outline-none rounded-none"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Catalogue() {
  const [params] = useSearchParams();
  const paramKey = params.toString();
  const { record } = useStore();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [brand, setBrand] = useState("All");
  const [rating, setRating] = useState("0");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("featured");
  const [layout, setLayout] = useState("grid");
  const [visible, setVisible] = useState(8);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!query || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())) &&
            (category === "All" || p.category === category) &&
            (brand === "All" || p.brand === brand) &&
            p.rating >= +rating &&
            p.price >= minPrice &&
            p.price <= maxPrice
        )
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
            ? b.price - a.price
            : sort === "rating"
            ? b.rating - a.rating
            : a.id - b.id
        ),
    [query, category, brand, rating, minPrice, maxPrice, sort]
  );

  useEffect(() => {
    setQuery(params.get("q") || "");
    setCategory(params.get("category") || "All");
    setVisible(8);
  }, [paramKey]);

  const clear = () => {
    setQuery("");
    setCategory("All");
    setBrand("All");
    setRating("0");
    setMinPrice(0);
    setMaxPrice(500);
    setVisible(8);
  };

  const chips = [
    [category !== "All", category, () => setCategory("All")],
    [brand !== "All", brand, () => setBrand("All")],
    [+rating > 0, `${rating}+ stars`, () => setRating("0")],
    [minPrice > 0 || maxPrice < 500, `$${minPrice}–$${maxPrice}`, () => { setMinPrice(0); setMaxPrice(500); }],
  ].filter((x) => x[0]);

  return (
    <div className="min-h-screen bg-[#F3F0EB] dark:bg-[#080c14] py-8 sm:py-12 transition-colors">
      <div className="page">
        {/* Editorial Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-light text-[#77736C] dark:text-slate-400">
          <Link to="/" className="hover:text-[#302E2A] dark:hover:text-white transition">Home</Link>
          <span className="text-[#D8D2C8] dark:text-slate-700">/</span>
          <span className="text-[#302E2A] dark:text-slate-200 font-normal">
            {category === "All" ? "The Collection" : category}
          </span>
        </nav>

        {/* Header and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-[#D8D2C8] dark:border-slate-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#302E2A] dark:text-white font-normal tracking-tight">
              {category === "All" ? "The Collection" : category}
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-light text-[#77736C] dark:text-slate-400">
              {filtered.length} bespoke pieces handcrafted with architectural precision
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              record("search", "Catalogue search", { query });
            }}
            className="relative w-full md:w-80"
          >
            <Search className="absolute left-3.5 top-3 text-[#77736C]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#FAF8F4] dark:bg-slate-900 border border-[#D8D2C8] dark:border-slate-800 py-2.5 pl-10 pr-3.5 text-xs text-[#302E2A] dark:text-slate-100 placeholder-[#77736C] outline-none rounded-none focus:border-[#383630]"
              placeholder="Search pieces..."
            />
          </form>
        </div>

        {/* Filter Chips */}
        {chips.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {chips.map(([, label, remove]) => (
              <button
                key={label}
                onClick={remove}
                className="flex items-center gap-1.5 bg-[#EAE5DD] dark:bg-slate-800 border border-[#D8D2C8] dark:border-slate-700 px-3 py-1 text-xs text-[#302E2A] dark:text-slate-200 font-normal rounded-none cursor-pointer"
              >
                <span>{label}</span>
                <X size={12} className="text-[#77736C]" />
              </button>
            ))}
            <button
              onClick={clear}
              className="text-xs uppercase tracking-wider font-medium text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition ml-2 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content: Sidebar + Products */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 p-6 h-fit rounded-none">
            <FilterPanel
              {...{ category, setCategory, brand, setBrand, rating, setRating, minPrice, setMinPrice, maxPrice, setMaxPrice, clear, record }}
            />
          </aside>

          {/* Product Listing Section */}
          <section>
            {/* Controls Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 p-3.5 rounded-none">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#302E2A] dark:text-white border border-[#D8D2C8] dark:border-slate-800 px-3 py-2 cursor-pointer"
              >
                <Filter size={14} /> Filters
              </button>

              <p className="hidden text-xs font-light text-[#77736C] dark:text-slate-400 sm:block">
                Showing <strong className="font-medium text-[#302E2A] dark:text-white">{filtered.length}</strong> available works
              </p>

              <div className="ml-auto flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort collection"
                  className="bg-[#FAF8F4] dark:bg-slate-900 border border-[#D8D2C8] dark:border-slate-800 text-xs text-[#302E2A] dark:text-slate-100 py-2 px-3 outline-none rounded-none cursor-pointer"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="hidden sm:flex border border-[#D8D2C8] dark:border-slate-800 p-0.5">
                  <button
                    onClick={() => setLayout("grid")}
                    aria-label="Grid layout"
                    className={`p-1.5 rounded-none transition cursor-pointer ${
                      layout === "grid"
                        ? "bg-[#383630] text-[#FAF8F4] dark:bg-slate-100 dark:text-slate-900"
                        : "text-[#77736C] hover:text-[#302E2A]"
                    }`}
                  >
                    <Grid3X3 size={15} />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    aria-label="List layout"
                    className={`p-1.5 rounded-none transition cursor-pointer ${
                      layout === "list"
                        ? "bg-[#383630] text-[#FAF8F4] dark:bg-slate-100 dark:text-slate-900"
                        : "text-[#77736C] hover:text-[#302E2A]"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {filtered.length ? (
              <>
                <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
                  {filtered.slice(0, visible).map((p) => (
                    <ProductCard key={p.id} product={p} layout={layout} />
                  ))}
                </div>

                {visible < filtered.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisible((v) => v + 8)}
                      className="border border-[#383630] dark:border-slate-300 text-[#302E2A] dark:text-white hover:bg-[#383630] hover:text-[#FAF8F4] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-none transition cursor-pointer"
                    >
                      Load More Pieces
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={Search}
                title="No pieces found"
                text="Try relaxing your filters or searching with broader keywords."
                action={
                  <button
                    onClick={clear}
                    className="border border-[#383630] text-[#302E2A] dark:text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-none cursor-pointer"
                  >
                    Clear all filters
                  </button>
                }
              />
            )}
          </section>
        </div>

        {/* Mobile Filter Modal */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
            <aside className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-[#FAF8F4] dark:bg-[#0f172a] p-6 shadow-2xl">
              <FilterPanel
                {...{ category, setCategory, brand, setBrand, rating, setRating, minPrice, setMinPrice, maxPrice, setMaxPrice, clear, record }}
                onClose={() => setFiltersOpen(false)}
              />
              <button
                className="mt-8 w-full bg-[#383630] text-[#FAF8F4] py-3 text-xs uppercase tracking-widest font-semibold rounded-none cursor-pointer"
                onClick={() => setFiltersOpen(false)}
              >
                Show {filtered.length} Pieces
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = products.find((x) => x.id === +id);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState("Organic Oak");
  const [selectedFinish, setSelectedFinish] = useState("Bora Bora Oyster");
  const [openAccordion, setOpenAccordion] = useState("specs");
  const { addCart, toggleCompare, compare, wishlist, toggleWishlist, toast } = useStore();

  if (!p) {
    return (
      <div className="page py-16">
        <EmptyState
          title="Piece not found"
          text="This piece may no longer be available in our current collection."
          action={
            <Link to="/catalogue">
              <Button>Return to collection</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const gallery = [
    p.image,
    products[(p.id + 2) % products.length].image,
    products[(p.id + 5) % products.length].image,
  ];

  const materialOptions = [
    { name: "Organic Oak", color: "#C4A482" },
    { name: "American Walnut", color: "#5C4033" },
    { name: "Matte Charcoal", color: "#383630" },
  ];

  const finishOptions = [
    { name: "Bora Bora Oyster", color: "#E3DDD3" },
    { name: "Sandstone Beige", color: "#D8D2C8" },
    { name: "Midnight Felt", color: "#1E242B" },
  ];

  const isSaved = wishlist.includes(p.id);

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? "" : key));
  };

  const handleSampleRequest = () => {
    toast(`Sample requested: ${selectedMaterial} / ${selectedFinish}`);
  };

  return (
    <div className="min-h-screen bg-[#F3F0EB] dark:bg-[#080c14] py-8 sm:py-12 text-[#302E2A] dark:text-slate-100 transition-colors">
      <div className="page">
        {/* Editorial Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-light text-[#77736C] dark:text-slate-400">
          <Link to="/" className="hover:text-[#302E2A] dark:hover:text-white transition">Home</Link>
          <span className="text-[#D8D2C8] dark:text-slate-700">/</span>
          <Link to="/catalogue" className="hover:text-[#302E2A] dark:hover:text-white transition">Collection</Link>
          <span className="text-[#D8D2C8] dark:text-slate-700">/</span>
          <Link to={`/catalogue?category=${p.category}`} className="hover:text-[#302E2A] dark:hover:text-white transition">{p.category}</Link>
          <span className="text-[#D8D2C8] dark:text-slate-700">/</span>
          <span className="text-[#302E2A] dark:text-slate-200 font-normal">{p.name}</span>
        </nav>

        {/* Main Editorial Two-Column Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Left Column: Architectural Product Gallery */}
          <div className="space-y-4">
            {/* Primary Hero Stage */}
            <div className="relative aspect-[4/3] bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 flex items-center justify-center p-8 sm:p-12 overflow-hidden">
              <img
                src={gallery[active]}
                alt={p.name}
                className="max-h-full max-w-full object-contain transition-all duration-500 ease-out"
              />
            </div>

            {/* Architectural Detail / Context Shots below hero */}
            <div className="grid grid-cols-2 gap-4">
              {gallery.slice(1).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx + 1)}
                  className={`group relative aspect-[4/3] bg-[#FAF8F4] dark:bg-[#0f172a] border overflow-hidden p-6 text-left transition cursor-pointer ${
                    active === idx + 1
                      ? "border-[#383630] dark:border-slate-300 ring-1 ring-[#383630]/20"
                      : "border-[#D8D2C8] dark:border-slate-800 hover:border-[#77736C]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${p.name} architectural detail`}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase font-medium text-[#77736C] dark:text-slate-400 bg-[#FAF8F4]/90 dark:bg-slate-900/90 px-2 py-0.5">
                    View 0{idx + 2}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Editorial Product Information Panel */}
          <div className="bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 p-7 sm:p-9 lg:sticky lg:top-24">
            {/* Heading and Wishlist Bookmark */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-medium text-[#77736C] dark:text-slate-400">
                  {p.brand} · {p.category}
                </span>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#302E2A] dark:text-white font-normal tracking-tight leading-tight">
                  {p.name}
                </h1>
              </div>
              <button
                onClick={() => toggleWishlist(p.id)}
                aria-label={isSaved ? "Remove from saved pieces" : "Save piece"}
                className="p-2 text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition cursor-pointer shrink-0"
              >
                <Bookmark
                  size={21}
                  className={
                    isSaved
                      ? "fill-[#383630] text-[#383630] dark:fill-white dark:text-white"
                      : "stroke-[1.5]"
                  }
                />
              </button>
            </div>

            {/* Price & Leadtime Metadata */}
            <div className="mt-6 pt-5 border-t border-[#D8D2C8] dark:border-slate-800 grid grid-cols-2 gap-y-3 text-xs">
              <span className="text-[#77736C] dark:text-slate-400 font-light">Price</span>
              <span className="text-[#302E2A] dark:text-slate-100 font-medium text-sm text-right sm:text-left">
                ${p.price.toFixed(2)}
              </span>

              <span className="text-[#77736C] dark:text-slate-400 font-light">Leadtime</span>
              <span className="text-[#302E2A] dark:text-slate-100 font-normal text-right sm:text-left">
                {p.availability} (8–10 weeks)
              </span>

              <span className="text-[#77736C] dark:text-slate-400 font-light">On Display</span>
              <span className="text-[#302E2A] dark:text-slate-100 font-normal text-right sm:text-left">
                Auckland & Melbourne Studio
              </span>
            </div>

            {/* Material & Finish Selectors */}
            <div className="mt-6 pt-5 border-t border-[#D8D2C8] dark:border-slate-800 space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400 block mb-2">
                  Timber / Material · <strong className="text-[#302E2A] dark:text-slate-200 font-semibold">{selectedMaterial}</strong>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {materialOptions.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => setSelectedMaterial(mat.name)}
                      className={`p-2.5 border text-left rounded-none transition flex items-center gap-2 cursor-pointer ${
                        selectedMaterial === mat.name
                          ? "border-[#383630] dark:border-white bg-[#EAE5DD]/60 dark:bg-slate-800"
                          : "border-[#D8D2C8] dark:border-slate-800 hover:border-[#77736C]"
                      }`}
                    >
                      <span className="size-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: mat.color }} />
                      <span className="text-xs font-light truncate">{mat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-medium text-[#77736C] dark:text-slate-400 block mb-2">
                  Upholstery / Finish · <strong className="text-[#302E2A] dark:text-slate-200 font-semibold">{selectedFinish}</strong>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {finishOptions.map((fin) => (
                    <button
                      key={fin.name}
                      onClick={() => setSelectedFinish(fin.name)}
                      className={`p-2.5 border text-left rounded-none transition flex items-center gap-2 cursor-pointer ${
                        selectedFinish === fin.name
                          ? "border-[#383630] dark:border-white bg-[#EAE5DD]/60 dark:bg-slate-800"
                          : "border-[#D8D2C8] dark:border-slate-800 hover:border-[#77736C]"
                      }`}
                    >
                      <span className="size-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: fin.color }} />
                      <span className="text-xs font-light truncate">{fin.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="mt-7 pt-6 border-t border-[#D8D2C8] dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-light text-[#77736C] dark:text-slate-400">Quantity</span>
                <div className="inline-flex items-center border border-[#D8D2C8] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-medium text-[#302E2A] dark:text-white">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons: ADD TO CART and SAMPLE REQUEST */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => addCart(p, qty, navigate)}
                  className="bg-[#383630] text-[#FAF8F4] hover:bg-[#201f1c] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest py-3.5 px-4 rounded-none transition active:scale-[0.99] text-center cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleSampleRequest}
                  className="border border-[#383630] dark:border-slate-300 text-[#302E2A] dark:text-white hover:bg-[#EDE8E0] dark:hover:bg-slate-800 text-xs font-semibold uppercase tracking-widest py-3.5 px-4 rounded-none transition active:scale-[0.99] text-center cursor-pointer"
                >
                  Sample Request
                </button>
              </div>
            </div>

            {/* Expandable Accordion Sections with Thin #D8D2C8 Dividers */}
            <div className="mt-8 border-t border-[#D8D2C8] dark:border-slate-800 divide-y divide-[#D8D2C8] dark:divide-slate-800 text-xs">
              {/* Dimensions */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion("dimensions")}
                  className="w-full flex items-center justify-between text-left font-normal text-[#302E2A] dark:text-slate-200 uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  <span>Dimensions</span>
                  <ChevronRight size={14} className={`text-[#77736C] transition-transform ${openAccordion === "dimensions" ? "rotate-90" : ""}`} />
                </button>
                {openAccordion === "dimensions" && (
                  <div className="pt-3 pb-1 text-[#77736C] dark:text-slate-400 space-y-1.5 font-light leading-relaxed">
                    <p>W: 2400mm · D: 950mm · H: 760mm</p>
                    <p>Seat Height: 440mm · Armrest Height: 620mm</p>
                    <p>Net Weight: {p.specs.Weight || "45 kg"}</p>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion("specs")}
                  className="w-full flex items-center justify-between text-left font-normal text-[#302E2A] dark:text-slate-200 uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  <span>Specifications</span>
                  <ChevronRight size={14} className={`text-[#77736C] transition-transform ${openAccordion === "specs" ? "rotate-90" : ""}`} />
                </button>
                {openAccordion === "specs" && (
                  <div className="pt-3 pb-1 space-y-2 text-[#77736C] dark:text-slate-400 font-light">
                    <p className="leading-relaxed">{p.description}.</p>
                    <div className="space-y-1 pt-1 border-t border-[#D8D2C8]/60 dark:border-slate-800/60">
                      {Object.entries(p.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-[#77736C]">{key}:</span>
                          <span className="text-[#302E2A] dark:text-slate-200 font-normal">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Downloads */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion("downloads")}
                  className="w-full flex items-center justify-between text-left font-normal text-[#302E2A] dark:text-slate-200 uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  <span>Downloads</span>
                  <ChevronRight size={14} className={`text-[#77736C] transition-transform ${openAccordion === "downloads" ? "rotate-90" : ""}`} />
                </button>
                {openAccordion === "downloads" && (
                  <div className="pt-3 pb-1 text-[#77736C] dark:text-slate-400 space-y-2 font-light">
                    <a href="#tear-sheet" onClick={(e) => { e.preventDefault(); toast("Tear sheet PDF downloaded"); }} className="flex items-center gap-2 hover:text-[#302E2A] dark:hover:text-white transition">
                      <FileText size={13} /> Product Specification Tear Sheet (PDF)
                    </a>
                    <a href="#cad" onClick={(e) => { e.preventDefault(); toast("3D CAD package downloaded"); }} className="flex items-center gap-2 hover:text-[#302E2A] dark:hover:text-white transition">
                      <Download size={13} /> 3D DWG, OBJ & Revit BIM Models
                    </a>
                  </div>
                )}
              </div>

              {/* Care & Maintenance */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full flex items-center justify-between text-left font-normal text-[#302E2A] dark:text-slate-200 uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  <span>Care & Maintenance</span>
                  <ChevronRight size={14} className={`text-[#77736C] transition-transform ${openAccordion === "care" ? "rotate-90" : ""}`} />
                </button>
                {openAccordion === "care" && (
                  <div className="pt-3 pb-1 text-[#77736C] dark:text-slate-400 font-light leading-relaxed">
                    Treat timber with natural wax twice annually. Spot-clean upholstery with lukewarm water and a dry cloth. Keep away from harsh direct sunlight.
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion("delivery")}
                  className="w-full flex items-center justify-between text-left font-normal text-[#302E2A] dark:text-slate-200 uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  <span>Delivery & Lead Times</span>
                  <ChevronRight size={14} className={`text-[#77736C] transition-transform ${openAccordion === "delivery" ? "rotate-90" : ""}`} />
                </button>
                {openAccordion === "delivery" && (
                  <div className="pt-3 pb-1 text-[#77736C] dark:text-slate-400 font-light leading-relaxed">
                    Simulated academic research order. Complimentary insured freight and white-glove placement upon delivery.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Curated Pieces Section */}
        <section className="mt-20 pt-12 border-t border-[#D8D2C8] dark:border-slate-800">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-medium text-[#77736C] dark:text-slate-400">
                Curated Collection
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-[#302E2A] dark:text-white font-normal tracking-tight">
                Related Pieces
              </h2>
            </div>
            <Link
              to="/catalogue"
              className="text-xs uppercase tracking-wider font-semibold text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition"
            >
              View all ({products.length}) →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((x) => x.id !== p.id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
