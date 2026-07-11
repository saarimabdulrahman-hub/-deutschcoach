// Hand-built neon-vector Neuschwanstein Castle scene for the dashboard hero.
// A stylized, synthwave rendering (violet structure, glowing pink roof edges,
// lit windows, cliff, pines, moon, stars) so it merges with the dashboard theme
// rather than reading as a realistic photo. Verified via rasterized review.
//
// viewBox 1180×320 ≈ hero aspect; preserveAspectRatio slice to cover the banner.
// Castle is right-biased (~x800) so the left-aligned hero copy stays legible.

export function CastleScene() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1180 320"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="csHorizon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#d946ef" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="csBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1d60" /><stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="csRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f472b6" /><stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="csGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <ellipse cx="800" cy="250" rx="330" ry="120" fill="url(#csHorizon)" />
      <circle cx="1015" cy="66" r="24" fill="#2a1550" stroke="#f9a8d4" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="1015" cy="66" r="24" fill="#f9a8d4" fillOpacity="0.08" />
      <g fill="#fbcfe8">
        <circle cx="620" cy="50" r="1.2" fillOpacity=".7" /><circle cx="700" cy="34" r="1" fillOpacity=".6" />
        <circle cx="880" cy="40" r="1.2" fillOpacity=".65" /><circle cx="945" cy="120" r="1" fillOpacity=".5" />
        <circle cx="1100" cy="60" r="1.1" fillOpacity=".6" /><circle cx="560" cy="90" r="1" fillOpacity=".5" />
        <circle cx="1130" cy="150" r="1" fillOpacity=".5" /><circle cx="760" cy="30" r="1" fillOpacity=".55" />
      </g>

      {/* distant alps */}
      <path d="M500 258 L610 170 L690 220 L780 150 L860 210 L940 165 L1040 215 L1130 175 L1180 235 L1180 268 L500 268 Z" fill="#0d0522" fillOpacity="0.7" />
      {/* rugged crag */}
      <path d="M540 320 L590 276 L628 296 L672 258 L700 268 L735 250 L775 246 L815 248 L858 244 L900 254 L940 268 L985 250 L1035 288 L1075 320 Z" fill="#160a33" />

      {/* back gabled hall */}
      <rect x="800" y="168" width="42" height="80" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.6" strokeWidth="1" />
      <path d="M796 168 L806 150 L836 150 L846 168 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.55" strokeWidth="0.8" />

      {/* left turret A */}
      <rect x="702" y="192" width="14" height="56" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.6" strokeWidth="1" />
      <path d="M699 192 L709 162 L719 192 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.55" strokeWidth="0.8" />
      {/* round turret B */}
      <rect x="718" y="172" width="22" height="76" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.65" strokeWidth="1" />
      <path d="M714 172 L729 134 L744 172 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.6" strokeWidth="0.9" filter="url(#csGlow)" />
      <line x1="729" y1="134" x2="729" y2="125" stroke="#f9a8d4" strokeWidth="1" /><circle cx="729" cy="124" r="1.5" fill="#f9a8d4" />
      {/* slender spire C */}
      <rect x="746" y="146" width="12" height="102" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.6" strokeWidth="1" />
      <path d="M743 146 L752 108 L761 146 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.6" strokeWidth="0.9" />
      <line x1="752" y1="108" x2="752" y2="99" stroke="#f9a8d4" strokeWidth="1" /><circle cx="752" cy="98" r="1.4" fill="#f9a8d4" />
      {/* MAIN square tower D */}
      <rect x="764" y="124" width="32" height="124" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.75" strokeWidth="1.2" />
      <rect x="764" y="122" width="32" height="4" fill="#4c2570" />
      <path d="M760 124 L780 84 L800 124 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.7" strokeWidth="1" filter="url(#csGlow)" />
      <line x1="780" y1="84" x2="780" y2="72" stroke="#f9a8d4" strokeWidth="1.2" /><circle cx="780" cy="71" r="2" fill="#f9a8d4" />
      {/* turret F */}
      <rect x="804" y="150" width="14" height="98" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.6" strokeWidth="1" />
      <path d="M801 150 L811 118 L821 150 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.55" strokeWidth="0.8" />
      <line x1="811" y1="118" x2="811" y2="110" stroke="#f9a8d4" strokeWidth="1" /><circle cx="811" cy="109" r="1.3" fill="#f9a8d4" />
      {/* Palas G */}
      <rect x="842" y="176" width="56" height="72" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.7" strokeWidth="1" />
      <path d="M838 176 L850 158 L890 158 L902 176 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.6" strokeWidth="0.8" />
      {/* right turret H */}
      <rect x="898" y="192" width="18" height="56" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.65" strokeWidth="1" />
      <path d="M894 192 L907 158 L920 192 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.6" strokeWidth="0.9" />
      <line x1="907" y1="158" x2="907" y2="150" stroke="#f9a8d4" strokeWidth="1" /><circle cx="907" cy="149" r="1.4" fill="#f9a8d4" />
      {/* far turret I */}
      <rect x="920" y="206" width="12" height="42" fill="url(#csBody)" stroke="#f472b6" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M917 206 L926 180 L935 206 Z" fill="url(#csRoof)" stroke="#f9a8d4" strokeOpacity="0.5" strokeWidth="0.8" />

      {/* rows of arched (lit) windows */}
      <rect x="775" y="140" width="6" height="9" rx="3" fill="#fbbf24" fillOpacity="0.8" />
      <rect x="775" y="162" width="6" height="9" rx="3" fill="#0a0420" />
      <rect x="775" y="184" width="6" height="9" rx="3" fill="#fbbf24" fillOpacity="0.8" />
      <rect x="775" y="206" width="6" height="9" rx="3" fill="#0a0420" />
      <g fill="#fbbf24" fillOpacity="0.78">
        <rect x="849" y="188" width="5" height="8" rx="2.5" /><rect x="859" y="188" width="5" height="8" rx="2.5" /><rect x="869" y="188" width="5" height="8" rx="2.5" /><rect x="879" y="188" width="5" height="8" rx="2.5" /><rect x="889" y="188" width="5" height="8" rx="2.5" />
      </g>
      <g fill="#0a0420">
        <rect x="849" y="208" width="5" height="8" rx="2.5" /><rect x="869" y="208" width="5" height="8" rx="2.5" /><rect x="889" y="208" width="5" height="8" rx="2.5" />
      </g>
      <rect x="859" y="208" width="5" height="8" rx="2.5" fill="#fbbf24" fillOpacity="0.78" />
      <rect x="879" y="208" width="5" height="8" rx="2.5" fill="#fbbf24" fillOpacity="0.78" />
      <rect x="725" y="196" width="4" height="7" rx="2" fill="#fbbf24" fillOpacity="0.7" />
      <rect x="725" y="214" width="4" height="7" rx="2" fill="#0a0420" />
      <rect x="808" y="196" width="4" height="7" rx="2" fill="#fbbf24" fillOpacity="0.7" />

      {/* foreground cliff crag the castle emerges from */}
      <path d="M540 320 L580 302 L622 298 L662 286 L700 250 L735 246 L778 248 L822 246 L862 248 L905 252 L948 288 L992 296 L1038 300 L1085 320 Z" fill="#120730" />
      <path d="M700 250 L735 246 L778 248 L822 246 L862 248 L905 252" stroke="#f472b6" strokeOpacity="0.28" strokeWidth="1" fill="none" />

      {/* pine forest foreground */}
      <g fill="#0f0826">
        <path d="M600 302 l10 -26 l10 26 z M603 290 l7 -18 l7 18 z" />
        <path d="M650 308 l11 -30 l11 30 z M653 294 l8 -20 l8 20 z" />
        <path d="M985 304 l10 -26 l10 26 z M988 290 l7 -18 l7 18 z" />
        <path d="M1035 300 l11 -28 l11 28 z" />
        <path d="M560 314 l9 -22 l9 22 z" />
      </g>
    </svg>
  );
}
