import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { formatPrice } from "@/lib/money";

/** Flat product shape the storefront renders (joins category name + formatted price). */
export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  priceCents: number;
  currency: string;
  price: string;
  category: string;
  image: string;
  alt: string;
  stock: number;
};

function toStoreProduct(
  row: typeof products.$inferSelect,
  categoryName: string,
): StoreProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    details: row.details,
    priceCents: row.priceCents,
    currency: row.currency,
    price: formatPrice(row.priceCents, row.currency),
    category: categoryName,
    image: row.imageUrl,
    alt: row.imageAlt,
    stock: row.stock,
  };
}

/**
 * Unwrap Drizzle's "Failed query: ..." wrapper so the root cause
 * (e.g. missing DATABASE_URL, missing table) is visible in the message.
 */
async function runQuery<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const cause = (err as { cause?: unknown })?.cause;
    const detail =
      cause instanceof Error ? cause.message : err instanceof Error ? err.message : String(err);
    throw new Error(`[db] ${label} failed: ${detail}`, { cause: err });
  }
}

export function getProducts(): Promise<StoreProduct[]> {
  return runQuery("getProducts", async () => {
    const rows = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true))
      .orderBy(asc(products.createdAt));
    return rows.map(({ product, category }) => toStoreProduct(product, category.name));
  });
}

export function getProductBySlug(slug: string): Promise<StoreProduct | undefined> {
  return runQuery("getProductBySlug", async () => {
    const rows = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);
    const row = rows[0];
    return row ? toStoreProduct(row.product, row.category.name) : undefined;
  });
}

export function getProductSlugs(): Promise<string[]> {
  return runQuery("getProductSlugs", async () => {
    const rows = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.isActive, true));
    return rows.map((r) => r.slug);
  });
}

/** Same-category first, then fill with others — mirrors old getRelatedProducts. */
export function getRelatedProducts(slug: string, count = 4): Promise<StoreProduct[]> {
  return runQuery("getRelatedProducts", async () => {
    const current = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);
    const head = current[0];
    if (!head) {
      const fallback = await getProducts();
      return fallback.slice(0, count);
    }

    const same = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.categoryId, head.product.categoryId),
          eq(products.isActive, true),
          ne(products.slug, slug),
        ),
      )
      .limit(count);

    if (same.length >= count) {
      return same.map(({ product, category }) => toStoreProduct(product, category.name));
    }

    const others = await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), ne(products.slug, slug)))
      .limit(count * 2);

    const seen = new Set(same.map((r) => r.product.slug));
    const merged = [
      ...same,
      ...others.filter((r) => r.product.categoryId !== head.product.categoryId && !seen.has(r.product.slug)),
      ...others.filter((r) => !seen.has(r.product.slug)),
    ];
    return merged.slice(0, count).map(({ product, category }) => toStoreProduct(product, category.name));
  });
}

export function getCategories(): Promise<{ name: string; slug: string }[]> {
  return runQuery("getCategories", async () => {
    return db.select({ name: categories.name, slug: categories.slug }).from(categories).orderBy(asc(categories.name));
  });
}
