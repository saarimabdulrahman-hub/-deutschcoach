export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background: rounded square with subtle gradient */}
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b2e" />
          <stop offset="100%" stopColor="#14111f" />
        </linearGradient>
        <linearGradient id="logoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="logoLetter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="logoAccent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      {/* Rounded square */}
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="14"
        fill="url(#logoBg)"
        stroke="url(#logoStroke)"
        strokeWidth="1.5"
      />

      {/* Stylised "D" with flowing tail */}
      <path
        d="M16 13h10c4.97 0 9 3.58 9 8s-3.58 8-9 8h-6V13z"
        fill="none"
        stroke="url(#logoLetter)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Flowing accent line inside the D */}
      <path
        d="M20 17c1.5 0 3 .8 4 2"
        stroke="url(#logoAccent)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Gold accent dot */}
      <circle cx="34" cy="14" r="3" fill="url(#logoAccent)" opacity="0.9" />
    </svg>
  );
}
