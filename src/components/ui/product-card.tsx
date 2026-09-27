import Link from "next/link";
import type { ReactNode } from "react";

type ProductCardProps = {
  media: ReactNode;
  title: string;
  price?: string;
  meta?: string;
  className?: string;
  href?: string;
};

/**
 * Responsive product cell — neutral surface, 4/5 media, serif title,
 * small sans price. Pass real <Image> as `media` later.
 * When `href` is provided the whole card renders as a link.
 */
export function ProductCard({ media, title, price, meta, className = "", href }: ProductCardProps) {
  const inner = (
    <>
      <div className="card-product-media">{media}</div>
      <div className="flex flex-col gap-1 p-4 sm:p-5">
        <h3 className="font-display text-lg leading-snug">{title}</h3>
        {meta ? <p className="eyebrow !text-[0.65rem]">{meta}</p> : null}
        {price ? <p className="text-sm tracking-wide">{price}</p> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`card-product block ${className}`} aria-label={title}>
        {inner}
      </Link>
    );
  }

  return <article className={`card-product ${className}`}>{inner}</article>;
}
