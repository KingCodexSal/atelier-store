/** Format minor-unit prices (cents) for display. */
export function formatPrice(priceCents: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // Whole-dollar prices render as "$1,290" (matching the original UI);
    // cents appear only when nonzero (e.g. "$19.99").
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}
