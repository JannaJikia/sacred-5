import { z } from "zod";

/** Trim, lowercase, max length, RFC-style email validation (Zod). */
export const zodNormalizedEmail = z
  .string()
  .trim()
  .max(254)
  .transform((s) => s.toLowerCase())
  .pipe(z.string().email("Enter a valid email address"));
