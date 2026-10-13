import { Bookmark, GitCompareArrows, Heart, Plus, Star } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useStore } from "./store";

export default function ProductCard({ product, layout = "grid" }) {
  const { addCart, toggleCompare, compare, wishlist, toggleWishlist, record } = useStore();
  const navigate = useNavigate();
  const inCompare = compare.some((x) => x.id === product.id);
  const isSaved   = wishlist.includes(product.id);
  const discount  = Math.round((1 - product.price / product.originalPrice) * 100);

  const open = () => record("view_product", product.name, { source: "catalogue" });

  /* ── LIST LAYOUT ─────────────────────────────────────── */
  if (layout === "list") {
    return (
      <article className="group card flex flex-col sm:flex-row overflow-hidden hover:shadow-[0_4px_16px_0_rgba(41,43,40,0.1)] transition-all duration-200">

        {/* Image */}
        <div className="relative sm:w-40 md:w-44 shrink-0 bg-[#F7F5F0] dark:bg-[#1a1f19] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <Link to={`/product/${product.id}`} onClick={open} className="w-full h-28 sm:h-32 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="product-card-img max-h-full max-w-full object-contain"
            />
          </Link>
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#C8795B] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
              −{discount}%
            </span>
          )}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute top-2 right-2 p-1 rounded-lg bg-white/80 dark:bg-[#1C211B]/80 text-[#777970] hover:text-[#C8795B] transition-colors shadow-xs"
          >
            <Heart size={13} className={isSaved ? "fill-[#C8795B] text-[#C8795B]" : ""} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            <p className="text-[9px] tracking-wider uppercase font-semibold text-[#A8B8A0]">
              {product.brand} · {product.category}
            </p>
            <Link
              to={`/product/${product.id}`}
              onClick={open}
              className="mt-1 block font-serif text-base sm:text-lg text-[#292B28] dark:text-[#E8EAE5] hover:text-[#244C3A] transition-colors leading-snug"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-xs leading-relaxed text-[#777970] max-w-xl line-clamp-1 sm:line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={s <= Math.round(product.rating) ? "fill-[#C8795B] text-[#C8795B]" : "text-[#E7E2D9]"}
                  />
                ))}
              </div>
              <span className="text-xs text-[#777970]">{product.rating}</span>
              <span className="text-xs text-[#D4CDBF]">({product.reviews.toLocaleString()})</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#292B28] dark:text-[#E8EAE5]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#A8B8A0] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => toggleCompare(product)}
                aria-label={inCompare ? "Remove from compare" : "Add to compare"}
                className={`h-8 px-2.5 rounded-lg border text-xs font-semibold transition-colors ${
                  inCompare
                    ? "border-[#244C3A] text-[#244C3A] bg-[#EEE9DF]"
                    : "border-[#E7E2D9] text-[#777970] hover:border-[#244C3A] hover:text-[#244C3A]"
                }`}
              >
                <GitCompareArrows size={13} />
              </button>
              <button
                onClick={() => addCart(product, 1, navigate)}
                className="h-8 px-3 rounded-lg bg-[#244C3A] text-white text-xs font-semibold hover:bg-[#1b3a2b] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={13} />
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ── GRID LAYOUT ─────────────────────────────────────── */
  return (
    <article className="group card flex flex-col overflow-hidden hover:shadow-[0_4px_16px_0_rgba(41,43,40,0.1)] transition-all duration-200">

      {/* Image */}
      <div className="relative bg-[#F7F5F0] dark:bg-[#1a1f19] p-2.5 sm:p-3 flex items-center justify-center overflow-hidden aspect-[4/3] sm:aspect-[4/3]">
        <Link to={`/product/${product.id}`} onClick={open} className="flex items-center justify-center w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img max-h-24 sm:max-h-32 max-w-full object-contain"
          />
        </Link>

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#C8795B] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
            −{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-2 right-2 p-1 rounded-lg bg-white/80 dark:bg-[#1C211B]/80 text-[#777970] hover:text-[#C8795B] transition-colors shadow-xs"
        >
          <Heart size={13} className={isSaved ? "fill-[#C8795B] text-[#C8795B]" : ""} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 pt-2">
        <p className="text-[8px] sm:text-[9px] tracking-wider uppercase font-semibold text-[#A8B8A0]">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.id}`}
          onClick={open}
          className="mt-0.5 font-medium text-xs sm:text-sm leading-snug text-[#292B28] dark:text-[#E8EAE5] hover:text-[#244C3A] transition-colors line-clamp-2 min-h-[1.9rem] sm:min-h-[2.3rem]"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                size={9}
                className={s <= Math.round(product.rating) ? "fill-[#C8795B] text-[#C8795B]" : "text-[#E7E2D9]"}
              />
            ))}
          </div>
          <span className="text-[9px] text-[#A8B8A0] ml-0.5">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + actions */}
        <div className="mt-2 flex items-end justify-between gap-1.5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm md:text-base font-bold text-[#292B28] dark:text-[#E8EAE5]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[9px] text-[#A8B8A0] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleCompare(product)}
              aria-label={inCompare ? "Remove from compare" : "Compare"}
              title={inCompare ? "Remove from compare" : "Compare"}
              className={`h-7 w-7 sm:h-7.5 sm:w-7.5 flex items-center justify-center rounded-lg border transition-colors ${
                inCompare
                  ? "border-[#244C3A] text-[#244C3A] bg-[#EEE9DF]"
                  : "border-[#E7E2D9] text-[#A8B8A0] hover:border-[#244C3A] hover:text-[#244C3A]"
              }`}
            >
              <GitCompareArrows size={12} />
            </button>
            <button
              onClick={() => addCart(product, 1, navigate)}
              aria-label={`Add ${product.name} to bag`}
              title="Add to bag"
              className="h-7 w-7 sm:h-7.5 sm:w-7.5 flex items-center justify-center rounded-lg bg-[#244C3A] text-white hover:bg-[#1b3a2b] transition-colors shadow-xs"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
