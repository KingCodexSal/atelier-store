import Link from "next/link";
import { Container } from "@/components/ui/container";

const primaryLinks = [
  { label: "New In", href: "/products" },
  { label: "Women", href: "/products" },
  { label: "Men", href: "/products" },
];
const secondaryLinks = [
  { label: "Accessories", href: "/products" },
  { label: "Editorial", href: "/#collections" },
];

/** Shared storefront header — announcement + sticky nav, matches homepage. */
export function SiteHeader() {
  return (
    <>
      <p className="bg-ink px-4 py-2 text-center text-[0.7rem] font-medium uppercase tracking-[0.22em] text-canvas">
        Complimentary shipping on orders over $500
      </p>
      <header className="sticky top-0 z-40 border-b hairline bg-canvas/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <nav className="hidden flex-1 items-center gap-6 lg:flex" aria-label="Primary">
            {primaryLinks.map((link) => (
              <Link key={link.label} href={link.href} className="link-underline text-[0.75rem] font-medium uppercase tracking-[0.18em]">
                {link.label}
              </Link>
            ))}
          </nav>

          <details className="relative lg:hidden">
            <summary className="btn btn-ghost cursor-pointer list-none !px-2">Menu</summary>
            <nav className="absolute left-0 top-full mt-2 flex w-48 flex-col gap-1 border hairline bg-surface p-3 shadow-lg" aria-label="Mobile">
              {[...primaryLinks, ...secondaryLinks].map((link) => (
                <Link key={link.label} href={link.href} className="px-2 py-2 text-sm hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>

          <Link href="/" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Atelier
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Secondary">
              {secondaryLinks.map((link) => (
                <Link key={link.label} href={link.href} className="link-underline text-[0.75rem] font-medium uppercase tracking-[0.18em]">
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href="/products" className="btn btn-ghost !px-2 text-[0.75rem]">Search</Link>
            <Link href="/products" className="btn btn-ghost !px-2 text-[0.75rem]">Bag (0)</Link>
          </div>
        </Container>
      </header>
    </>
  );
}
