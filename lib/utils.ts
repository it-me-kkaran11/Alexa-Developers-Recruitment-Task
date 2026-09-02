/**
 * Format currency amount to display string
 */
export function formatCurrency(amount: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  
  // Convert from smallest unit to display unit (e.g., paisa to rupees)
  const displayAmount = amount / 100;
  
  return `${symbol}${displayAmount.toFixed(2)}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Get status badge color
 */
export function getStatusColor(
  status: string
): "green" | "yellow" | "red" | "blue" | "gray" {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
      return "green";
    case "pending":
    case "processing":
      return "yellow";
    case "failed":
    case "cancelled":
      return "red";
    case "checkout_started":
      return "blue";
    default:
      return "gray";
  }
}

/**
 * Get status display text
 */
export function getStatusText(status: string): string {
  const mapping: Record<string, string> = {
    PENDING: "Pending",
    CHECKOUT_STARTED: "Checkout In Progress",
    PAID: "Confirmed",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
  };

  return mapping[status] || status;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * Generate a random string (for tokens, etc.)
 */
export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
