const DEFAULT_CURRENCY = "GHS";
const DEFAULT_LOCALE = "en-GH";

/** Format a numeric amount as a localized currency string. */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Compute the discount percentage between a list price and a sale price. */
export function discountPercent(price: number, compareAtPrice?: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Sum cart-style line items into a subtotal. */
export function calcSubtotal(items: { unitPrice: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
