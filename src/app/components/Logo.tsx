/**
 * Sacred 5 — logo mark
 * An "S5" monogram seal on the forest/amber brand.
 * Used in the sidebar, landing page nav, and auth pages.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sacred 5 logo"
    >
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="100%" stopColor="#0a3018" />
        </linearGradient>
        <linearGradient id="lm-mono" x1="18" y1="14" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>

      {/* Seal */}
      <rect width="64" height="64" rx="16" fill="url(#lm-bg)" />
      {/* Subtle inner edge highlight for depth */}
      <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#ffffff" strokeOpacity="0.06" />

      {/* S5 monogram */}
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="var(--font-bricolage), ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="-1.5"
        fill="url(#lm-mono)"
      >
        S5
      </text>
    </svg>
  );
}

/** Full wordmark — logo mark + "Sacred 5" text side by side */
export function LogoWordmark({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <div>
        <div className="font-display text-sm font-semibold leading-tight tracking-tight">Sacred 5</div>
        <div className="text-xs text-muted-foreground leading-tight">Daily practices</div>
      </div>
    </div>
  );
}
