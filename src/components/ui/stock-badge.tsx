import { stockState } from "@/lib/stock";

type StockBadgeProps = {
  stock: number;
  className?: string;
};

const styles: Record<string, string> = {
  in: "border-[var(--color-line)] text-ink",
  low: "border-[var(--color-accent)] text-[var(--color-accent)]",
  out: "border-[var(--color-line)] text-muted",
};

const labels: Record<string, string> = {
  in: "In stock",
  low: "Low stock",
  out: "Out of stock",
};

/** Simple stock state indicator reusing Atelier eyebrow + hairline language. */
export function StockBadge({ stock, className = "" }: StockBadgeProps) {
  const state = stockState(stock);
  const detail = state === "low" ? ` — only ${stock} left` : "";
  return (
    <p
      role="status"
      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] ${styles[state]} ${className}`}
    >
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          state === "in" ? "bg-[var(--color-ink)]" : state === "low" ? "bg-[var(--color-accent)]" : "bg-[var(--color-muted)]"
        }`}
      />
      {labels[state]}
      {detail}
    </p>
  );
}
