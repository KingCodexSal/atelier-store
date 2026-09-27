import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

/** Minimal luxury button — uppercase label, hairline border, 44px target. */
export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={`btn ${variantClasses[variant]} ${className}`} {...props} />
  );
}
