import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Bookmark, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Download, FileText, Filter, GitCompareArrows, Grid3X3, Headphones, Heart,
  Home as HomeIcon, Laptop, List, Minus, Package, Plus, Search, ShieldCheck,
  ShoppingBag, Sparkles, Star, Watch, X, Zap,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Badge, Breadcrumbs, Button, EmptyState, Select } from "./components";
import { products } from "./data";
import ProductCard from "./product-card";
import { useStore } from "./store";

const categories = ["All", ...new Set(products.map((p) => p.category))];
const categoryIcons = { Audio: Headphones, Wearables: Watch, Cameras: Sparkles, Home: HomeIcon, Bags: ShoppingBag, Footwear: Sparkles };

/* ─────────────────────────────────── HOME ─── */
export function Home() {
  const { addCart } = useStore();
  const navigate = useNavigate();
  const [slideIdx, setSlideIdx] = useState(0);

  const heroSlides = [
    {
      product: products[2], // Frame Mini Camera
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      badge: "New Arrivals",
      tag: "TOP PICK",
    },
    {
      product: products[0], // AeroSound Pro
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      badge: "Best Seller",
      tag: "FEATURED",
    },
    {
      product: products[1], // Pulse Watch S4
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      badge: "Trending",
      tag: "EDITOR'S CHOICE",
    },
  ];

  const currentSlide = heroSlides[slideIdx];
  const featured = products.slice(0, 4);
  const popular = products.slice(4, 8);
  const newArrivals = products.slice(8, 12);

  return (
    <>
      {/* ── Hero ── */}
      <section className="page py-10 md:py-16">
        <div className="grid gap-10 lg:gap-14 items-center lg:grid-cols-[1.1fr_1.1fr]">

          {/* Text side */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#777970] uppercase">
                PREMIUM COLLECTION
              </span>
              <span className="w-8 h-[1px] bg-[#D4CDBF]" />
            </div>

            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[54px] font-medium leading-[1.12] text-[#292B28] dark:text-[#E8EAE5] tracking-tight">
              Crafted for those<br />
              <span className="text-[#B86B4D]">who choose wisely.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#777970] max-w-md">
              A curated selection of thoughtfully designed products. Discover, compare, and shop with clarity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link to="/catalogue">
                <button className="bg-[#244C3A] hover:bg-[#1b3a2b] text-white px-7 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shadow-sm flex items-center gap-2.5 cursor-pointer">
                  Browse collection <ArrowRight size={15} />
                </button>
              </Link>
              <Link to="/catalogue">
                <button className="bg-[#FFFDF9] dark:bg-[#1C211B] border border-[#E7E2D9] dark:border-[#2B3329] hover:bg-[#EEE9DF] text-[#292B28] dark:text-[#E8EAE5] px-7 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer">
                  Explore all
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-6 sm:gap-8 flex-wrap pt-2">
              {/* Stat 1 */}
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 rounded-full bg-[#EEE9DF] dark:bg-[#2B3329] flex items-center justify-center text-[#8C7A6B] dark:text-[#A8B8A0] shrink-0">
                  <Package size={19} />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#292B28] dark:text-[#E8EAE5] leading-none">12</p>
                  <p className="text-xs text-[#777970] mt-1">Products</p>
                </div>
              </div>

              <span className="hidden sm:block h-9 w-[1px] bg-[#E7E2D9] dark:border-[#2B3329]" />

              {/* Stat 2 */}
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 rounded-full bg-[#EEE9DF] dark:bg-[#2B3329] flex items-center justify-center text-[#8C7A6B] dark:text-[#A8B8A0] shrink-0">
                  <Grid3X3 size={19} />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#292B28] dark:text-[#E8EAE5] leading-none">6</p>
                  <p className="text-xs text-[#777970] mt-1">Categories</p>
                </div>
              </div>

              <span className="hidden sm:block h-9 w-[1px] bg-[#E7E2D9] dark:border-[#2B3329]" />

              {/* Stat 3 */}
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 rounded-full bg-[#EEE9DF] dark:bg-[#2B3329] flex items-center justify-center text-[#B86B4D] shrink-0">
                  <Star size={19} className="fill-[#B86B4D]" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#292B28] dark:text-[#E8EAE5] leading-none">4.5★</p>
                  <p className="text-xs text-[#777970] mt-1">Avg. rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image side - Exact Showcase Card matching mockup */}
          <div className="order-1 lg:order-2 w-full max-w-[520px] mx-auto lg:ml-auto">
            <div className="relative rounded-[32px] overflow-hidden bg-[#241E19] shadow-2xl aspect-[4/3] group">

              {/* Background Photo */}
              <img
                src={currentSlide.image}
                alt={currentSlide.product.name}
                className="w-full h-full object-cover brightness-[0.95] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none" />

              {/* Top Right Pill Badge */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-[#B86B4D]/85 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 shadow-lg">
                <Sparkles size={13} className="text-white" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Bottom Left Floating Card */}
              <Link
                to={`/product/${currentSlide.product.id}`}
                className="absolute bottom-5 left-5 z-20 bg-[#FBF9F5]/95 dark:bg-[#1C211B]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-white/60 dark:border-[#2B3329] max-w-[210px] sm:max-w-[230px] hover:-translate-y-0.5 transition-transform"
              >
                <p className="text-[10px] font-bold tracking-[0.15em] text-[#8C7A6B] uppercase">
                  {currentSlide.tag}
                </p>
                <p className="mt-1 font-semibold text-sm sm:text-base text-[#292B28] dark:text-[#E8EAE5] leading-tight">
                  {currentSlide.product.name}
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#B86B4D]">
                    ${currentSlide.product.price.toFixed(2)}
                  </span>
                  <span className="h-8 w-8 rounded-full bg-[#B86B4D] hover:bg-[#a35c40] text-white flex items-center justify-center shrink-0 shadow-sm transition-colors">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>

              {/* Bottom Right Carousel Controls */}
              <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSlideIdx((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                    aria-label="Previous slide"
                    className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setSlideIdx((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
                    aria-label="Next slide"
                    className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>

                {/* Pill dots */}
                <div className="flex items-center gap-1.5">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIdx(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                        slideIdx === i ? "w-6 bg-[#B86B4D]" : "w-4 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="page py-10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="eyebrow">Explore</p>
            <h2 className="section-title mt-1">Shop by category</h2>
          </div>
          <Link to="/catalogue" className="text-sm font-semibold text-[#244C3A] hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(1).map((cat) => {
            const Icon = categoryIcons[cat] || Sparkles;
            return (
              <Link
                key={cat}
                to={`/catalogue?category=${cat}`}
                className="group card p-3 sm:p-3.5 flex flex-col items-center gap-2 text-center hover:border-[#244C3A] hover:shadow-[0_4px_16px_0_rgba(36,76,58,0.1)] transition-all duration-200"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#EEE9DF] group-hover:bg-[#244C3A] text-[#244C3A] group-hover:text-white transition-all duration-200">
                  <Icon size={18} />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#292B28] dark:text-[#E8EAE5] group-hover:text-[#244C3A] transition-colors">{cat}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <ProductSection title="Featured products" desc="Editor's selection — best in class." products={featured} />

      {/* ── Promo Banner ── */}
      <section className="page py-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#244C3A] p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A8B8A0] mb-2">Limited offer</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold leading-tight">Use code <span className="text-[#C8795B]">SAVE10</span><br />for 10% off your order</h2>
            <p className="mt-3 text-sm text-[#A8B8A0]">Apply at checkout — valid for all products in this demo.</p>
          </div>
          <Link to="/catalogue">
            <button className="shrink-0 bg-[#C8795B] hover:bg-[#b46647] text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
              Shop now
            </button>
          </Link>
        </div>
      </section>

      {/* ── Popular Picks ── */}
      <ProductSection title="Popular picks" desc="Loved by participants in our usability studies." products={popular} />

      {/* ── New Arrivals ── */}
      <ProductSection title="New arrivals" desc="Fresh additions to our curated collection." products={newArrivals} />

      {/* ── Trust Strip ── */}
      <section className="page py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            [ShieldCheck, "Secure Shopping", "Simulated encrypted checkout with full data privacy."],
            [Star, "Curated quality", "Each product is thoughtfully selected for its design and merit."],
            [Zap, "Fast Dispatch", "Orders packed and dispatched within 24–48 hours."],
          ].map(([Icon, t, d]) => (
            <div key={t} className="card p-6 flex gap-4 items-start">
              <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE9DF] text-[#244C3A]">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-semibold text-sm text-[#292B28] dark:text-[#E8EAE5]">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#777970]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ProductSection({ title, desc, products: list }) {
  return (
    <section className="page py-10">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h2 className="section-title">{title}</h2>
          {desc && <p className="mt-1 text-sm text-[#777970]">{desc}</p>}
        </div>
        <Link to="/catalogue" className="text-sm font-semibold text-[#244C3A] hover:underline shrink-0">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

/* ─────────────────────────────── CATALOGUE ─── */
export function Catalogue() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [brand, setBrand] = useState("All");
  const [rating, setRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const { record } = useStore();

  const filtered = useMemo(() =>
    products
      .filter((p) =>
        (!query || `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())) &&
        (category === "All" || p.category === category) &&
        (brand === "All" || p.brand === brand) &&
        p.rating >= +rating &&
        p.price <= maxPrice
      )
      .sort((a, b) =>
        sort === "price-low" ? a.price - b.price :
          sort === "price-high" ? b.price - a.price :
            sort === "rating" ? b.rating - a.rating :
              a.id - b.id
      ),
    [query, category, brand, rating, maxPrice, sort]
  );

  const PER_PAGE = 12;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clear = () => { setQuery(""); setCategory("All"); setBrand("All"); setRating("0"); setMaxPrice(500); setPage(1); };

  const handleSearch = (e) => {
    e.preventDefault();
    record("search", "Catalogue search", { query });
    setPage(1);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <strong className="text-sm font-semibold text-[#292B28] dark:text-[#E8EAE5]">Filters</strong>
        <button onClick={clear} className="text-xs font-semibold text-[#C8795B] hover:underline cursor-pointer">Clear all</button>
      </div>

      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[#777970]">Category</p>
        <div className="space-y-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${category === c
                  ? "bg-[#244C3A] text-white"
                  : "text-[#777970] hover:bg-[#EEE9DF] dark:hover:bg-[#2B3329]"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[#777970]">Brand</p>
        <select
          value={brand}
          onChange={(e) => { setBrand(e.target.value); setPage(1); }}
          className="input text-xs"
        >
          {["All", ...new Set(products.map((p) => p.brand))].map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[#777970]">Max price: ${maxPrice}</p>
        <input
          type="range" min="50" max="500" step="10"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(+e.target.value); setPage(1); }}
          className="w-full accent-[#244C3A]"
        />
        <div className="flex justify-between text-[10px] text-[#A8B8A0] mt-1">
          <span>$50</span><span>$500</span>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[#777970]">Min rating</p>
        <div className="space-y-1">
          {[["0", "Any rating"], ["4", "4.0+ ★"], ["4.5", "4.5+ ★"]].map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setRating(v); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${rating === v
                  ? "bg-[#244C3A] text-white"
                  : "text-[#777970] hover:bg-[#EEE9DF] dark:hover:bg-[#2B3329]"
                }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page pt-3.5 pb-12">
      <Breadcrumbs items={["Catalogue"]} className="mb-2" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E7E2D9] dark:border-[#2B3329]">
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#292B28] dark:text-[#E8EAE5]">
            The Collection
          </h1>
          <span className="text-xs text-[#777970]">
            ({filtered.length} {filtered.length === 1 ? "product" : "products"})
          </span>
        </div>

        {/* Controls: Search, Sort, Grid/List */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-[#777970] border border-[#E7E2D9] dark:border-[#2B3329] rounded-xl px-2.5 py-1.5 hover:border-[#244C3A] hover:text-[#244C3A] transition-colors cursor-pointer"
          >
            <Filter size={13} />
            Filters {filtered.length < products.length && `(active)`}
          </button>

          <form onSubmit={handleSearch} className="relative hidden sm:block w-48 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B8A0]" size={14} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search catalogue..."
              className="input pl-8.5 pr-2.5 py-1.5 text-xs h-9 rounded-xl"
              aria-label="Search products"
            />
          </form>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="input w-auto text-xs py-1.5 px-3 h-9 rounded-xl"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low → high</option>
            <option value="price-high">Price: high → low</option>
            <option value="rating">Top rated</option>
          </select>

          <div className="flex items-center rounded-xl border border-[#E7E2D9] dark:border-[#2B3329] overflow-hidden h-9">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-full w-8.5 flex items-center justify-center transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#244C3A] text-white" : "text-[#A8B8A0] hover:text-[#244C3A]"}`}
              aria-label="Grid view"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`h-full w-8.5 flex items-center justify-center transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#244C3A] text-white" : "text-[#A8B8A0] hover:text-[#244C3A]"}`}
              aria-label="List view"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters on Left, Product Grid on Right — right at the top */}
      <div className="grid gap-5 lg:grid-cols-[200px_1fr] items-start">
        {/* Sidebar filter — desktop */}
        <aside className="hidden lg:block card p-4">
          <FilterPanel />
        </aside>

        {/* Product column */}
        <div>
          {/* Mobile search bar */}
          <form onSubmit={handleSearch} className="sm:hidden relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B8A0]" size={14} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search catalogue..."
              className="input pl-8.5 pr-2.5 py-1.5 text-xs h-9 rounded-xl w-full"
              aria-label="Search products"
            />
          </form>

          {/* Mobile filter drawer */}
          {filterOpen && (
            <div className="lg:hidden mb-4 card p-4">
              <FilterPanel />
            </div>
          )}

          {/* Products */}
          {shown.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" : "space-y-3"}>
              {shown.map((p) => <ProductCard key={p.id} product={p} layout={viewMode} />)}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No products found"
              text="Try broadening your search or clearing one or more filters."
              action={<Button onClick={clear}>Clear all filters</Button>}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={15} /> Previous
              </Button>
              <span className="text-xs text-[#777970] px-2">Page {page} of {totalPages}</span>
              <Button
                variant="secondary"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={15} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── PRODUCT DETAILS ─── */
export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = products.find((x) => x.id === +id);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const { addCart, toggleCompare, compare, wishlist, toggleWishlist, record } = useStore();

  if (!p) return (
    <div className="page py-14">
      <EmptyState
        title="Product not found"
        text="This product may no longer be available."
        action={<Link to="/catalogue"><Button>Back to catalogue</Button></Link>}
      />
    </div>
  );

  const inCompare = compare.some((x) => x.id === p.id);
  const isSaved = wishlist.includes(p.id);
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="page py-10">
      <Breadcrumbs items={["Catalogue", p.name]} />

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-[#F7F5F0] dark:bg-[#1a1f19] flex items-center justify-center p-8" style={{ aspectRatio: "4/3" }}>
            <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#C8795B] text-white text-xs font-black uppercase tracking-wide px-3 py-1 rounded-full">
                {discount}% off
              </span>
            )}
            <button
              onClick={() => toggleWishlist(p.id)}
              aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 dark:bg-[#1C211B]/80 text-[#777970] hover:text-[#C8795B] transition-colors shadow-sm"
            >
              <Heart size={18} className={isSaved ? "fill-[#C8795B] text-[#C8795B]" : ""} />
            </button>
          </div>
        </div>

        {/* Purchase panel */}
        <div className="py-2">
          <p className="eyebrow">{p.brand} · {p.category}</p>
          <h1 className="page-title mt-2">{p.name}</h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} className={s <= Math.round(p.rating) ? "fill-[#C8795B] text-[#C8795B]" : "text-[#E7E2D9]"} />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#292B28] dark:text-[#E8EAE5]">{p.rating}</span>
            <span className="text-sm text-[#A8B8A0]">· {p.reviews?.toLocaleString() || "128"} reviews</span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#292B28] dark:text-[#E8EAE5]">${p.price.toFixed(2)}</span>
            {p.originalPrice > p.price && (
              <span className="text-base text-[#A8B8A0] line-through">${p.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Availability */}
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={13} />
            {p.availability || "In stock"}
          </p>

          {/* Description */}
          <p className="mt-5 text-sm leading-relaxed text-[#777970]">
            {p.description}. Thoughtfully designed for dependable daily use, with simple controls and a refined finish.
          </p>

          {/* Qty */}
          <div className="mt-7">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#777970]">Quantity</p>
            <div className="inline-flex items-center rounded-xl border-[1.5px] border-[#E7E2D9] dark:border-[#2B3329] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                className="px-4 py-2.5 text-[#777970] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors"
              >
                <Minus size={15} />
              </button>
              <span className="w-12 text-center text-sm font-bold text-[#292B28] dark:text-[#E8EAE5]">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                aria-label="Increase quantity"
                className="px-4 py-2.5 text-[#777970] hover:text-[#244C3A] hover:bg-[#EEE9DF] transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => { addCart(p, qty, navigate); record("add_to_cart", p.name, { quantity: qty }); }} className="px-8 py-3 text-sm">
              <ShoppingBag size={17} />
              Add to bag
            </Button>
            <Button
              variant="secondary"
              onClick={() => toggleCompare(p)}
              className="px-5"
            >
              <GitCompareArrows size={17} />
              {inCompare ? "In compare" : "Compare"}
            </Button>
          </div>

          {/* Trust */}
          <div className="mt-6 flex items-center gap-1.5 text-xs text-[#A8B8A0]">
            <ShieldCheck size={14} />
            Simulation only — no real payment collected
          </div>
        </div>
      </div>

      {/* Tabs — Specs + Description */}
      <div className="mt-14">
        <div className="flex gap-0 border-b border-[#E7E2D9] dark:border-[#2B3329] mb-8">
          {[["specs", "Specifications"], ["desc", "Details"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setActiveTab(k)}
              className={`px-6 pb-3.5 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === k
                  ? "border-[#244C3A] text-[#244C3A]"
                  : "border-transparent text-[#777970] hover:text-[#292B28] dark:hover:text-[#E8EAE5]"
                }`}
            >
              {l}
            </button>
          ))}
        </div>

        {activeTab === "specs" && (
          <dl className="divide-y divide-[#E7E2D9] dark:divide-[#2B3329]">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between py-4 text-sm">
                <dt className="text-[#777970] font-medium">{k}</dt>
                <dd className="font-semibold text-[#292B28] dark:text-[#E8EAE5]">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {activeTab === "desc" && (
          <p className="text-sm leading-relaxed text-[#777970] max-w-2xl">
            {p.description}. Built for everyday dependability with an understated aesthetic — this product exemplifies thoughtful design where every detail serves a purpose. The materials are selected for longevity and the finish is meant to age gracefully.
          </p>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-7">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
            {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
          </div>
        </div>
      )}
    </div>
  );
}
