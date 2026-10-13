export default function MercaLogo({
  size = "md",
  showTagline = false,
  className = "",
  inverse = false,
}) {
  const sizeMap = {
    sm: { h: 22, w: 27, text: "text-lg", tm: "text-[7px]", sub: "text-[7px]" },
    md: { h: 28, w: 35, text: "text-2xl", tm: "text-[8px]", sub: "text-[8px]" },
    lg: { h: 36, w: 45, text: "text-3xl", tm: "text-[10px]", sub: "text-[9px]" },
    xl: { h: 52, w: 64, text: "text-5xl", tm: "text-[12px]", sub: "text-[11px]" },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* ── 3D Cart Icon with Tricolor Leaf Motif (tightly framed, zero excess padding) ── */}
      <svg
        width={s.w}
        height={s.h}
        viewBox="12 18 74 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        <defs>
          {/* Cart Ribbon Gradients */}
          <linearGradient id="mercaCartMain" x1="15" y1="18" x2="85" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4D00" />
            <stop offset="35%" stopColor="#FF7A00" />
            <stop offset="70%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#FF6200" />
          </linearGradient>

          <linearGradient id="mercaCartFold" x1="35" y1="25" x2="65" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E63900" />
            <stop offset="40%" stopColor="#FF6600" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>

          <linearGradient id="mercaSpeed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFA726" />
            <stop offset="100%" stopColor="#FF5722" />
          </linearGradient>

          <radialGradient id="mercaWheel" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFA200" />
            <stop offset="45%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#D82E00" />
          </radialGradient>

          <linearGradient id="mercaLeafSaffron" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF6600" />
          </linearGradient>
          <linearGradient id="mercaLeafGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>
        </defs>

        {/* ── Speed lines on left ── */}
        <rect x="14" y="34" width="16" height="3.5" rx="1.75" fill="url(#mercaSpeed)" />
        <rect x="19" y="42" width="13" height="3.5" rx="1.75" fill="url(#mercaSpeed)" />
        <rect x="25" y="50" width="9" height="3.5" rx="1.75" fill="url(#mercaSpeed)" />

        {/* ── Cart Base Wire ── */}
        <path
          d="M 33 54 L 68 54 C 70 54 71.5 53 71 51 L 69 46"
          stroke="url(#mercaCartMain)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── 3D Ribbon Cart Body ('W' fold) ── */}
        {/* Back handle curve */}
        <path
          d="M 23 20 C 19 20 18 24 20 28 L 36 60 C 37 62 39 63 42 63 L 68 63 C 71 63 73 60 74 57 L 76 50 C 76.5 48 75 46 73 47 C 70 49 66 52 62 49 C 55 44 48 30 43 28 C 39 26 36 32 38 42 L 31 24 C 29 20 26 20 23 20 Z"
          fill="url(#mercaCartFold)"
        />
        {/* Front Ribbon Swoop ('W' highlight) */}
        <path
          d="M 21 21 C 24 19 28 20 31 25 L 44 54 C 45 56 47 57 49 55 L 59 34 C 61 29 66 28 70 32 L 74 38 C 76 42 75 47 71 49 C 66 51 61 46 56 38 L 50 49 C 48 52 44 52 42 48 L 29 22 C 26 19 22 19 21 21 Z"
          fill="url(#mercaCartMain)"
        />

        {/* ── Indian Tricolor Leaf on Top Right ── */}
        {/* Saffron upper wing */}
        <path
          d="M 64 32 C 65 25 70 19 76 19 C 74 25 69 29 64 32 Z"
          fill="url(#mercaLeafSaffron)"
        />
        {/* White middle stripe */}
        <path
          d="M 64.5 32.5 C 67 27.5 71 23 75.5 22.5 C 72.5 26 68 30 64.5 32.5 Z"
          fill="#FFFFFF"
        />
        {/* Green lower wing */}
        <path
          d="M 64 33 C 66 30 70.5 27 75 26.5 C 71 31.5 67 33.5 64 33 Z"
          fill="url(#mercaLeafGreen)"
        />

        {/* ── Front & Rear Wheels (3D orange gradient orbs) ── */}
        {/* Drop shadow */}
        <ellipse cx="43" cy="74" rx="7.5" ry="2" fill="#D4CDBF" opacity="0.4" />
        <ellipse cx="67" cy="74" rx="7.5" ry="2" fill="#D4CDBF" opacity="0.4" />
        {/* Wheels */}
        <circle cx="43" cy="69" r="7.5" fill="url(#mercaWheel)" />
        <circle cx="67" cy="69" r="7.5" fill="url(#mercaWheel)" />
      </svg>

      {/* ── Wordmark: Merca™ + India's E-Commerce Platform ── */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-brand ${s.text} font-black tracking-[-0.03em] ${inverse
                ? "text-white"
                : "text-[#1C1512] dark:text-[#F7F5F0]"
              }`}
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            M
            {/* The signature gradient orange-red 'e' */}
            <span
              className="inline-block font-black bg-gradient-to-tr from-[#E64A19] via-[#FF6D00] to-[#FFA726] bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(135deg, #E64A19 0%, #FF6D00 50%, #FFA726 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              e
            </span>
            rc
            {/* The letter 'a' with the flame/leaf accent directly above it */}
            <span className="relative inline-block">
              a
              <svg
                className="absolute -top-1.5 -right-0.5 w-2.5 h-2.5 pointer-events-none"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2 18 C3 11 9 4 18 2 C16 11 11 17 2 18 Z"
                  fill="url(#mercaLeafSaffron)"
                />
              </svg>
            </span>
          </span>

          {/* ™ symbol */}
          <span
            className={`${s.tm} font-extrabold text-[#777970] ml-0.5 relative -top-2`}
          >
            TM
          </span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <span
            className={`${s.sub} font-semibold uppercase tracking-[0.24em] text-[#777970] dark:text-[#A8B8A0] mt-0.5`}
            style={{ letterSpacing: "0.22em" }}
          >
            India’s E-Commerce Platform
          </span>
        )}
      </div>
    </div>
  );
}
