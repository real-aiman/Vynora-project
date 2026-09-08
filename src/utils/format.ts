export function formatPrice(n: number): string {
  if (n === 0) return "Free";
  return `$${n.toLocaleString("en-US")}`;
}

export function generateOrderRef(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(100 + Math.random() * 900);
  return `VYNORA-${stamp}-${rand}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Lightweight input masks for the demo payment fields (no real card validation). */
export function formatCardNumberInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, "$1 ");
}

export function formatExpiryInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvcInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}
