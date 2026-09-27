import Link from "next/link";
import { Container } from "@/components/ui/container";

/** Shared storefront footer — matches homepage columns + legal bar. */
export function SiteFooter() {
  return (
    <footer className="border-t hairline bg-canvas">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-2xl">Atelier</p>
          <p className="body-muted mt-3 max-w-xs text-sm">Minimal luxury commerce starter built on the Atelier design system.</p>
        </div>
        {[
          ["Shop", ["New In", "Women", "Men", "Accessories"]],
          ["Company", ["Story", "Craft", "Stores", "Careers"]],
          ["Support", ["Shipping", "Returns", "Care guide", "Contact"]],
        ].map(([heading, links]) => (
          <div key={heading as string}>
            <p className="eyebrow">{heading}</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {(links as string[]).map((l) => (
                <li key={l}><Link href="/products" className="link-underline">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t hairline">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© 2026 Atelier Store. Sample content only.</p>
          <p>Imagery via Unsplash — for layout demonstration.</p>
        </Container>
      </div>
    </footer>
  );
}
