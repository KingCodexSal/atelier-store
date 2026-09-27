import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// --- Categories (one row per former `meta` value) ---
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// --- Products (replaces src/data/products.ts sample array) ---
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    // Exact money: minor units (cents). Display via formatPrice().
    priceCents: integer("price_cents").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull().default(""),
    // Simple stock: on-hand units. No warehouses / variants in v1.
    stock: integer("stock").notNull().default(0),
    details: text("details").array().notNull().default(sql`'{}'::text[]`),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("products_stock_nonnegative", sql`${t.stock} >= 0`),
    check("products_price_nonnegative", sql`${t.priceCents} >= 0`),
    index("products_category_idx").on(t.categoryId),
  ],
);

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type ProductRow = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
