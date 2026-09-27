export type StockState = "in" | "low" | "out";

/** Same thresholds the sample data used: 0 → out, ≤3 → low, else in. */
export function stockState(stock: number): StockState {
  if (stock <= 0) return "out";
  if (stock <= 3) return "low";
  return "in";
}
