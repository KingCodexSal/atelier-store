import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductListing } from "@/components/product-listing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProducts } from "@/db/queries";

// Live Postgres data — render on demand so builds pass without DATABASE_URL.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all — Atelier",
  description: "Browse Atelier new arrivals — sculpted outerwear, silk dresses and considered accessories.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas text-ink">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Section size="sm">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted"
            >
              <Link href="/" className="link-underline">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-ink">
                Shop
              </span>
            </nav>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Shop — Autumn Winter 2026"
                title="New arrivals"
                copy="Eight sample pieces across outerwear, evening and accessories. Filter quietly by category — the imagery does the talking."
              />
              <p className="body-muted max-w-xs shrink-0 text-sm lg:text-right">
                Photographed in natural light.
                <br />
                Priced honestly, made in small batches.
              </p>
            </div>

            <div className="mt-10">
              <ProductListing products={products} />
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
