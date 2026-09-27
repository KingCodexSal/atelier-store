import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { collections, editorialImage, heroImage } from "@/data/editorial";
import { getProducts } from "@/db/queries";

// Live Postgres data (Neon HTTP) — render on demand, not at build time,
// so `next build` passes without DATABASE_URL and stock stays fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas text-ink">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-ink text-canvas">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Editorial fashion look in warm light"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
          </div>
          <Container className="relative flex min-h-[78vh] flex-col justify-end pb-14 pt-24 sm:min-h-[86vh] sm:pb-20">
            <p className="eyebrow !text-canvas/70">Autumn — Winter 2026</p>
            <h1 className="h-display mt-4 max-w-3xl">Quiet luxury, cut for everyday ritual</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-canvas/80 sm:text-lg">
              Sculpted outerwear, silk dresses and considered accessories — photographed
              editorially, designed to be worn on repeat.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn btn-primary !border-canvas !bg-canvas !text-ink">
                Shop new arrivals
              </Link>
              <a href="#collections" className="btn btn-secondary !border-canvas/40 !text-canvas hover:!border-canvas">
                Explore collections
              </a>
            </div>
          </Container>
        </section>

        {/* Collections */}
        <Section>
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Featured collections"
                title="Three ways to dress with intent"
                copy="A tight edit across womenswear, menswear and accessories — built from the same neutral palette and fabric language."
              />
              <Link href="/products" className="link-underline shrink-0 text-[0.75rem] font-medium uppercase tracking-[0.18em]">
                View all
              </Link>
            </div>

            <div id="collections" className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {collections.map((c) => (
                <Link key={c.title} href="/products" className="card-product group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-canvas">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="font-display text-xl">{c.title}</h3>
                      <p className="body-muted mt-1 text-sm">{c.copy}</p>
                    </div>
                    <span aria-hidden className="text-xl leading-none">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        {/* Products */}
        <Section className="border-t hairline bg-surface">
          <Container>
            <div id="shop" className="flex scroll-mt-24 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="New arrivals"
                title="Product-first essentials"
                copy="Eight pieces across outerwear, leather goods and evening."
              />
              <div className="flex gap-3">
                <Link href="/products" className="btn btn-secondary">Filters</Link>
                <Link href="/products" className="btn btn-primary">Shop all</Link>
              </div>
            </div>

            <div className="grid-product mt-10">
              {products.map((p) => (
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

        {/* Editorial split */}
        <Section>
          <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border hairline sm:aspect-[5/5]">
              <Image
                src={editorialImage}
                alt="Atelier rail of neutral garments"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-5">
              <p className="eyebrow">The Atelier method</p>
              <h2 className="h-section">Fewer pieces, better cloth, honest construction</h2>
              <p className="body-muted max-w-lg text-base">
                Every sample silhouette is prototyped in-house and photographed in natural
                light before it earns a place in the collection. No seasonal noise — just
                proportion, texture and wearability.
              </p>
              <ul className="flex w-full flex-col divide-y divide-[var(--color-line)] border-y hairline text-sm">
                {["Natural fibres first", "Repairable seams and hardware", "Made in small batches"].map((li) => (
                  <li key={li} className="flex items-center justify-between py-3">
                    <span>{li}</span>
                    <span aria-hidden className="text-muted">—</span>
                  </li>
                ))}
              </ul>
              <a href="#collections" className="btn btn-primary">Read our story</a>
            </div>
          </Container>
        </Section>

        {/* Values */}
        <Section size="sm" className="border-t hairline">
          <Container className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-8">
            {[
              ["Shipping", "Complimentary over $500, worldwide"],
              ["Returns", "30 days, no questions asked"],
              ["Care", "Lifetime repairs on leather goods"],
            ].map(([title, copy]) => (
              <div key={title} className="flex flex-col gap-2 px-4">
                <p className="eyebrow">{title}</p>
                <p className="text-sm text-ink/80">{copy}</p>
              </div>
            ))}
          </Container>
        </Section>

        {/* Newsletter */}
        <Section className="border-t hairline bg-surface">
          <Container className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <SectionHeading
              align="center"
              eyebrow="Newsletter"
              title="First looks, private previews"
              copy="One email a month. New arrivals and editorial stories — nothing else."
            />
            <form className="flex w-full flex-col gap-3 sm:flex-row" action="#">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" type="email" required placeholder="you@example.com" className="input flex-1" />
              <button type="submit" className="btn btn-primary shrink-0">Subscribe</button>
            </form>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
