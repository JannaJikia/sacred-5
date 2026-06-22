import Image from "next/image";

/**
 * Sacred 5 brand logo (the provided lockup, background removed).
 * The artwork is cream, which reads on dark surfaces as-is; on light app/auth
 * backgrounds a CSS filter renders it as a dark silhouette so it stays visible
 * (see `.brand-logo` in globals.css).
 */
const LOGO_W = 731;
const LOGO_H = 213;

export function LogoWordmark({ size = 30 }: { size?: number }) {
  const height = size;
  const width = Math.round((size * LOGO_W) / LOGO_H);
  return (
    <Image
      src="/sacred5-logo.png"
      alt="Sacred 5"
      width={width}
      height={height}
      className="brand-logo select-none"
    />
  );
}

/** Compact alias — same lockup. */
export const LogoMark = LogoWordmark;
