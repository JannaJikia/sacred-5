/**
 * Sacred 5 — brand logo.
 * A radiating sunburst mark + a serif "Sacred 5" wordmark.
 * The mark uses `currentColor`, so it inherits the surrounding text color
 * (cream on the marketing surface, foreground in the themed app).
 */

const CENTER = 32;
const INNER = 5;

// Irregular, hand-drawn-style spark: [angle°, ray length, mid-point bend].
// Uneven angles + slight bends give the sketched starburst from the brand mark.
const RAY_DEFS: [number, number, number][] = [
  [-90, 25, 1.4],
  [-62, 16, -1.2],
  [-34, 22, 1.7],
  [-12, 13, -0.9],
  [16, 18, 1.1],
  [44, 14, -1.4],
  [70, 11, 0.9],
  [92, 23, 1.2],
  [124, 15, -1.1],
  [150, 13, 1.3],
  [172, 24, 1.6],
  [-150, 17, -1.3],
  [-118, 12, 1.0],
];

function rayPoints(angleDeg: number, length: number, bend: number): string {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const nx = -dy;
  const ny = dx;
  const midR = INNER + (length - INNER) * 0.55;
  const p = (r: number, off = 0) =>
    `${(CENTER + dx * r + nx * off).toFixed(1)},${(CENTER + dy * r + ny * off).toFixed(1)}`;
  return `${p(INNER)} ${p(midR, bend)} ${p(length)}`;
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
      <g stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
        {RAY_DEFS.map(([angle, length, bend], i) => (
          <polyline key={i} points={rayPoints(angle, length, bend)} />
        ))}
      </g>
      <circle cx={CENTER} cy={CENTER} r={2.6} fill="currentColor" />
    </svg>
  );
}

/**
 * The logo lockup — sunburst mark snug against the serif "Sacred 5" wordmark,
 * as a single unit. This is the logo used across the UI; the bare mark is only
 * for the favicon.
 */
export function LogoWordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span
        className="font-serif font-semibold leading-none tracking-tight"
        style={{ fontSize: Math.round(size * 0.74) }}
      >
        Sacred 5
      </span>
    </span>
  );
}
