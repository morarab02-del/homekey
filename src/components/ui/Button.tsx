import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "wa";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  wa: "btn-wa",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "btn-md",
  lg: "btn-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx("btn", variantClass[variant], sizeClass[size], block && "w-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  external?: boolean;
  children: ReactNode;
  "aria-label"?: string;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  block = false,
  className,
  external = false,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={clsx("btn", variantClass[variant], sizeClass[size], block && "w-full", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
