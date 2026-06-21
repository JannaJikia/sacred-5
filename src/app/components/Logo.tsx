/**
 * Sacred 5 — brand logo.
 * A radiating sunburst mark + a serif "Sacred 5" wordmark.
 * The mark uses `currentColor`, so it inherits the surrounding text color
 * (cream on the marketing surface, foreground in the themed app).
 */

const RAYS = 12;
const CENTER = 32;

function sunburstRays() {
  return Array.from({ length: RAYS }, (_, i) => {
    const angle = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
    const long = i % 2 === 0;
    const inner = 5.5;
    const outer = long ? 28 : 19;
    const half = 2.1;
    const px = Math.cos(angle);
    const py = Math.sin(angle);
    const nx = -py;
    const ny = px;
    const bx = CENTER + px * inner;
    const by = CENTER + py * inner;
    const tip = `${(CENTER + px * outer).toFixed(2)},${(CENTER + py * outer).toFixed(2)}`;
    const a = `${(bx + nx * half).toFixed(2)},${(by + ny * half).toFixed(2)}`;
    const b = `${(bx - nx * half).toFixed(2)},${(by - ny * half).toFixed(2)}`;
    return `${a} ${b} ${tip}`;
  });
}

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
      {sunburstRays().map((points, i) => (
        <polygon key={i} points={points} fill="currentColor" />
      ))}
      <circle cx={CENTER} cy={CENTER} r={4} fill="currentColor" />
    </svg>
  );
}

/** Full wordmark — sunburst mark + the serif "Sacred 5" wordmark, with an optional sub-line. */
export function LogoWordmark({ size = 32, subtitle }: { size?: number; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <div className="leading-tight">
        <div className="font-serif font-semibold tracking-tight" style={{ fontSize: Math.round(size * 0.62) }}>
          Sacred 5
        </div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}
