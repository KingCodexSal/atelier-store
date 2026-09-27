import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Centered responsive page container (max 80rem, fluid gutters). */
export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container-atelier ${className}`}>{children}</div>;
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "sm";
};

/** Vertical section rhythm (48px mobile → 112px desktop). */
export function Section({ children, className = "", size = "default" }: SectionProps) {
  const sizeClass = size === "sm" ? "section-sm" : "section";
  return <section className={`${sizeClass} ${className}`}>{children}</section>;
}
