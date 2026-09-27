import "./env";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const categoryNames = [
  "Outerwear",
  "Handbags",
  "Evening",
  "Menswear",
  "Essentials",
  "Footwear",
  "Accessories",
  "Timepieces",
];

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

type SeedProduct = {
  slug: string;
  name: string;
  priceCents: number;
  category: string;
  imageId: string;
  alt: string;
  stock: number;
  description: string;
  details: string[];
};

// Prices converted from the old "$1,290" strings to minor units.
const seedProducts: SeedProduct[] = [
  {
    slug: "coat-01",
    name: "Sculpted Wool Overcoat",
    priceCents: 129000,
    category: "Outerwear",
    imageId: "photo-1539109136881-3be0616acf4b",
    alt: "Model wearing a tailored camel overcoat",
    stock: 8,
    description:
      "A sculpted overcoat cut from double-faced wool with a clean shoulder and hidden closure. Designed to layer over tailoring without bulk.",
    details: ["Double-faced Italian wool", "Hidden button closure", "Made in small batches"],
  },
  {
    slug: "bag-01",
    name: "Structured Leather Tote",
    priceCents: 89000,
    category: "Handbags",
    imageId: "photo-1548036328-c9fa89d128fa",
    alt: "Structured leather handbag on neutral background",
    stock: 2,
    description:
      "A structured tote in grained leather with reinforced handles and a suede-lined interior. Carries the day without losing its shape.",
    details: ["Grained calf leather", "Suede interior pocket", "Lifetime hardware repairs"],
  },
  {
    slug: "dress-01",
    name: "Draped Silk Dress",
    priceCents: 76000,
    category: "Evening",
    imageId: "photo-1509631179647-0177331693ae",
    alt: "Model in a flowing silk dress",
    stock: 5,
    description:
      "A bias-cut silk dress that drapes rather than clings. Adjustable straps and a clean back line keep it effortless after dark.",
    details: ["100% mulberry silk", "Bias cut", "Adjustable straps"],
  },
  {
    slug: "jacket-01",
    name: "Tailored Field Jacket",
    priceCents: 64000,
    category: "Menswear",
    imageId: "photo-1591047139829-d91aecb6caea",
    alt: "Model wearing a tailored utility jacket",
    stock: 0,
    description:
      "A field jacket with a tailored block — water-resistant cotton twill, matte hardware, room for a knit underneath.",
    details: ["Water-resistant twill", "Matte metal hardware", "Four-pocket layout"],
  },
  {
    slug: "knit-01",
    name: "Fine-Gauge Knit",
    priceCents: 32000,
    category: "Essentials",
    imageId: "photo-1434389677669-e08b4cac3105",
    alt: "Folded knitwear in neutral tones",
    stock: 14,
    description:
      "A fine-gauge crew in extra-long staple cotton. Garment-washed for softness, ribbed where it counts.",
    details: ["Extra-long staple cotton", "Garment washed", "Ribbed collar and cuffs"],
  },
  {
    slug: "shoe-01",
    name: "Polished Leather Loafer",
    priceCents: 54000,
    category: "Footwear",
    imageId: "photo-1533867617858-e7b97e060509",
    alt: "Polished leather shoes on a clean backdrop",
    stock: 3,
    description:
      "A polished loafer on a leather sole with a cushioned insole. Cut close, then burnished by hand.",
    details: ["Calf leather upper", "Leather sole", "Hand burnished"],
  },
  {
    slug: "scarf-01",
    name: "Woven Cashmere Scarf",
    priceCents: 28000,
    category: "Accessories",
    imageId: "photo-1601924994987-69e26d50dc26",
    alt: "Cashmere scarf draped over a chair",
    stock: 11,
    description:
      "A generously sized scarf woven from two-ply cashmere. Soft structure that wraps twice without bulk.",
    details: ["100% cashmere", "Two-ply weave", "Hand-finished fringe"],
  },
  {
    slug: "watch-01",
    name: "Slim Gold Watch",
    priceCents: 115000,
    category: "Timepieces",
    imageId: "photo-1523170335258-f5ed11844a49",
    alt: "Minimal gold wristwatch close-up",
    stock: 1,
    description:
      "A slim 34mm case in brushed gold with a clean champagne dial. Quiet on the wrist, precise underneath.",
    details: ["34mm brushed case", "Sapphire crystal", "Italian leather strap"],
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local first.");
  }

  await db
    .insert(categories)
    .values(categoryNames.map((name) => ({ name, slug: slugify(name) })))
    .onConflictDoNothing({ target: categories.slug });

  const existing = await db.select({ id: categories.id, name: categories.name }).from(categories);
  const byName = new Map(existing.map((c) => [c.name, c.id]));

  for (const p of seedProducts) {
    const categoryId = byName.get(p.category);
    if (!categoryId) throw new Error(`Missing category: ${p.category}`);
    await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        currency: "USD",
        categoryId,
        imageUrl: img(p.imageId),
        imageAlt: p.alt,
        stock: p.stock,
        details: p.details,
        isActive: true,
      })
      .onConflictDoNothing({ target: products.slug });
  }

  console.log(`Seeded ${categoryNames.length} categories, ${seedProducts.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
