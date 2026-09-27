import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StockBadge } from "@/components/ui/stock-badge";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/db/queries";
import { stockState } from "@/lib/stock";

export async function generateStaticParams() {
  const slugs = await getProductSlugs().catch(() => [] as string[]);
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id).catch(() => undefined);
  if (!product) return { title: "Product not found — Atelier" };
  return {
    title: `${product.name} — Atelier`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Throws (500) on DB outage so it isn't masked as a 404; unknown slugs → notFound().
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const state = stockState(product.stock);
  const related = await getRelatedProducts(product.slug, 4);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas text-ink">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Container className="pt-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted">
            <Link href="/" className="link-underline">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/products" className="link-underline">Shop</Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-ink">{product.category}</span>
          </nav>
        </Container>

        <Section size="sm">
          <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Large imagery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border hairline bg-surface">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-[2px] border hairline bg-surface">
                    <Image
                      src={product.image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 1024px) 33vw, 15vw"
                      className="object-cover opacity-90"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="flex flex-col items-start gap-5">
              <p className="eyebrow">{product.category}</p>
              <h1 className="h-section !text-4xl sm:!text-5xl">{product.name}</h1>
              <p className="font-display text-2xl">{product.price}</p>

              <StockBadge stock={product.stock} />

              <p className="body-muted max-w-lg text-base">{product.description}</p>

              <ul className="flex w-full flex-col divide-y divide-[var(--color-line)] border-y hairline text-sm">
                {product.details.map((d) => (
                  <li key={d} className="flex items-center justify-between py-3">
                    <span>{d}</span>
                    <span aria-hidden className="text-muted">—</span>
                  </li>
                ))}
              </ul>

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={state === "out"}
                  className="btn btn-primary flex-1"
                  aria-disabled={state === "out"}
                >
                  {state === "out" ? "Notify me" : "Add to bag"}
                </button>
                <Link href="/products" className="btn btn-secondary flex-1">
                  Continue shopping
                </Link>
              </div>

              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                {state === "out"
                  ? "Currently unavailable in this size"
                  : `Ships in 48h — ${product.stock} in studio stock`}
              </p>
            </div>
          </Container>
        </Section>

        {/* Related */}
        <Section className="border-t hairline bg-surface">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex max-w-2xl flex-col gap-4">
                <p className="eyebrow">Complete the look</p>
                <h2 className="h-section">You may also consider</h2>
              </div>
              <Link href="/products" className="link-underline shrink-0 text-[0.75rem] font-medium uppercase tracking-[0.18em]">
                Back to shop
              </Link>
            </div>

            <div className="grid-product mt-10">
              {related.map((p) => (
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
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
