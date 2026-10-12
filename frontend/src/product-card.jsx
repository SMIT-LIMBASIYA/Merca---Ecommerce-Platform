import { Bookmark, GitCompareArrows, Heart, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useStore } from "./store";

export default function ProductCard({ product, layout = "grid" }) {
  const { addCart, toggleCompare, compare, wishlist, toggleWishlist, record } = useStore();
  const navigate = useNavigate();
  const selected = compare.some((x) => x.id === product.id);
  const isSaved = wishlist.includes(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const open = () => record("view_product", product.name, { source: "catalogue" });

  if (layout === "list") {
    return (
      <article className="group bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 transition-colors duration-200 flex flex-col sm:flex-row overflow-hidden">
        {/* Left: Image Container */}
        <div className="relative sm:w-72 shrink-0 bg-[#FAF8F4] dark:bg-[#111827] border-b sm:border-b-0 sm:border-r border-[#D8D2C8] dark:border-slate-800 flex items-center justify-center p-6 overflow-hidden">
          <Link to={`/product/${product.id}`} onClick={open} className="w-full h-56 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute top-3 right-3 p-2 text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition"
          >
            <Bookmark size={17} className={isSaved ? "fill-[#383630] text-[#383630] dark:fill-white dark:text-white" : "stroke-[1.5]"} />
          </button>
        </div>

        {/* Right: Info and Actions */}
        <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] tracking-widest uppercase font-medium text-[#77736C] dark:text-slate-400">
                {product.brand} · {product.category}
              </span>
              <span className="text-xs text-[#77736C] dark:text-slate-400 font-light">
                {product.availability}
              </span>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={open}
              className="mt-2 block font-serif text-2xl text-[#302E2A] dark:text-slate-100 font-normal tracking-tight hover:opacity-75 transition leading-snug"
            >
              {product.name}
            </Link>

            <p className="mt-2 text-xs leading-relaxed text-[#77736C] dark:text-slate-400 max-w-xl">
              {product.description}. Architectural form and enduring materials designed for everyday living.
            </p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-lg font-medium text-[#302E2A] dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#77736C] dark:text-slate-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#D8D2C8] dark:border-slate-800 flex items-center gap-3">
            <button
              onClick={() => addCart(product, 1, navigate)}
              className="bg-[#383630] text-[#FAF8F4] hover:bg-[#22211e] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-medium uppercase tracking-widest py-3 px-6 rounded-none transition active:scale-[0.99] cursor-pointer"
            >
              Add to cart
            </button>
            <button
              onClick={() => toggleCompare(product)}
              title={selected ? "Remove from comparison" : "Add to comparison"}
              aria-label="Compare"
              className={`border text-xs uppercase tracking-wider py-3 px-4 rounded-none transition cursor-pointer flex items-center gap-1.5 ${
                selected
                  ? "border-[#383630] text-[#302E2A] dark:text-white dark:border-white bg-[#EDE8E0] dark:bg-slate-800"
                  : "border-[#D8D2C8] text-[#77736C] hover:border-[#383630] hover:text-[#302E2A] dark:border-slate-800 dark:hover:border-slate-600"
              }`}
            >
              <GitCompareArrows size={15} />
              <span>{selected ? "Compared" : "Compare"}</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Grid layout (Woodwrights minimalist card - medium size)
  return (
    <article className="group bg-[#FAF8F4] dark:bg-[#0f172a] border border-[#D8D2C8] dark:border-slate-800 flex flex-col justify-between transition-colors duration-200 overflow-hidden">
      <div>
        {/* Product Image Area with medium proportions and warm ivory backdrop */}
        <div className="relative aspect-[4/3] bg-[#FAF8F4] dark:bg-[#111827] flex items-center justify-center p-4 border-b border-[#D8D2C8] dark:border-slate-800 overflow-hidden h-44 sm:h-48">
          <Link
            to={`/product/${product.id}`}
            onClick={open}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Minimalist Wishlist Bookmark */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute top-2.5 right-2.5 p-1.5 text-[#77736C] hover:text-[#302E2A] dark:hover:text-white transition cursor-pointer"
          >
            <Bookmark
              size={15}
              className={
                isSaved
                  ? "fill-[#383630] text-[#383630] dark:fill-white dark:text-white"
                  : "stroke-[1.5]"
              }
            />
          </button>

          {/* Subtle Discount Note if applicable */}
          {discount > 0 && (
            <span className="absolute bottom-2.5 left-2.5 text-[9px] tracking-wider uppercase font-medium text-[#77736C] dark:text-slate-400 bg-[#EAE5DD]/90 dark:bg-slate-800/90 px-1.5 py-0.5">
              −{discount}%
            </span>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-3.5 sm:p-4">
          <span className="block text-[9px] tracking-widest uppercase font-medium text-[#77736C] dark:text-slate-400 mb-1">
            {product.brand} · {product.category}
          </span>

          <Link
            to={`/product/${product.id}`}
            onClick={open}
            className="block font-serif text-lg sm:text-xl text-[#302E2A] dark:text-slate-100 font-normal tracking-tight hover:opacity-75 transition leading-snug line-clamp-1"
          >
            {product.name}
          </Link>

          <div className="mt-2.5 flex items-baseline justify-between gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-semibold text-[#302E2A] dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] text-[#77736C] dark:text-slate-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#77736C] dark:text-slate-400 font-light">
              {product.availability}
            </span>
          </div>
        </div>
      </div>

      {/* Understated Action Bar */}
      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-0 grid grid-cols-[1fr_auto] gap-2">
        <button
          onClick={() => addCart(product, 1, navigate)}
          className="w-full bg-[#383630] text-[#FAF8F4] hover:bg-[#22211e] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-[11px] font-semibold uppercase tracking-wider py-2.5 px-3 rounded-none transition active:scale-[0.99] cursor-pointer text-center"
        >
          Add to Cart
        </button>

        <button
          onClick={() => toggleCompare(product)}
          title={selected ? "Remove from comparison" : "Add to comparison"}
          aria-label="Compare"
          className={`border p-2.5 rounded-none transition cursor-pointer flex items-center justify-center ${
            selected
              ? "border-[#383630] text-[#302E2A] dark:text-white dark:border-white bg-[#EDE8E0] dark:bg-slate-800"
              : "border-[#D8D2C8] text-[#77736C] hover:border-[#383630] hover:text-[#302E2A] dark:border-slate-800 dark:hover:border-slate-600"
          }`}
        >
          <GitCompareArrows size={14} />
        </button>
      </div>
    </article>
  );
}
