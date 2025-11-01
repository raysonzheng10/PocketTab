export function isDigit(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

export function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
