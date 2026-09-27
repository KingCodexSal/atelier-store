"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { StoreProduct } from "@/db/queries";
import { ProductCard } from "@/components/ui/product-card";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · Low to high" },
  { value: "price-desc", label: "Price · High to low" },
  { value: "name", label: "Alphabetical" },
];

type ProductListingProps = {
  products: StoreProduct[];
};

/**
 * Restrained listing controls — text-only category row, single hairline
 * toolbar for count/sort/search. Imagery stays the focus; no boxed panels.
 */
export function ProductListing({ products }: ProductListingProps) {
  const categories = useMemo(() => {
    const seen = new Map<string, number>();
    for (const p of products) seen.set(p.category, (seen.get(p.category) ?? 0) + 1);
    return [{ name: "All", count: products.length }, ...[...seen.entries()].map(([name, count]) => ({ name, count }))];
  }, [products]);

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (availableOnly && p.stock <= 0) return false;
      if (q && !`${p.name} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.priceCents - b.priceCents);
      case "price-desc":
        return [...list].sort((a, b) => b.priceCents - a.priceCents);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, category, sort, query, availableOnly]);

  const hasActiveFilters = category !== "All" || query.trim() !== "" || availableOnly;

  return (
    <div>
      {/* Category row — horizontally scrollable on mobile, text only */}
      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {categories.map((c) => {
          const active = category === c.name;
          return (
            <button
              key={c.name}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(c.name)}
              className={`shrink-0 whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors ${
                active ? "text-ink underline underline-offset-8 decoration-1" : "text-muted hover:text-ink"
              }`}
            >
              {c.name}
              <span aria-hidden className="ml-1.5 text-[0.68rem] tracking-normal">
                ({c.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Hairline toolbar — count left, restrained controls right */}
      <div className="mt-5 flex flex-col gap-4 border-y hairline py-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="eyebrow !text-[0.68rem]">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          {category !== "All" ? ` — ${category}` : ""}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <label className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search products"
              className="h-9 w-full border-b hairline bg-transparent text-sm normal-case tracking-normal text-ink placeholder:text-muted focus:border-[var(--color-ink)] focus:outline-none sm:w-36"
            />
          </label>

          <button
            type="button"
            aria-pressed={availableOnly}
            onClick={() => setAvailableOnly((v) => !v)}
            className={`text-left text-[0.72rem] uppercase tracking-[0.16em] transition-colors sm:text-right ${
              availableOnly ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink"
            }`}
          >
            Available only
          </button>

          <label className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort products"
              className="h-9 cursor-pointer border-b hairline bg-transparent pr-1 text-[0.72rem] uppercase tracking-[0.16em] text-ink focus:border-[var(--color-ink)] focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Imagery-first grid */}
      {filtered.length > 0 ? (
        <div className="grid-product mt-8 sm:mt-10">
          {filtered.map((p) => (
            <ProductCard
              key={p.slug}
              href={`/products/${p.slug}`}
              title={p.name}
              price={p.price}
              meta={p.category}
              media={
                <Image
                  src={p.image}
                  alt={p.alt}
                  width={900}
                  height={1125}
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="eyebrow">No pieces found</p>
          <p className="body-muted max-w-sm text-sm">
            Nothing matches {category !== "All" ? `“${category}”` : "these filters"}
            {query.trim() ? ` for “${query.trim()}”` : ""}. Try a different search or category.
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setQuery("");
                setAvailableOnly(false);
              }}
              className="btn btn-secondary mt-2"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
