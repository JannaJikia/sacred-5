/** Normalizes email for lookup/storage (trim + lowercase). */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
