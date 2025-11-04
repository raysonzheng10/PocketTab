export function isDigit(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

export function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAmount(amount: number): string {
  return `$${Number(amount).toFixed(2)}`;
}
