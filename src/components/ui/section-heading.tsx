type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  className?: string;
};

/** Editorial heading block: eyebrow label + serif title + muted copy. */
export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="h-section">{title}</h2>
      {copy ? <p className="body-muted text-base">{copy}</p> : null}
    </div>
  );
}
