export function isValidEmail(raw: string): boolean {
  const email = raw.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
