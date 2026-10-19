import { clsx } from "clsx";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx("field cursor-pointer pr-8", className)} {...rest}>
      {children}
    </select>
  );
}
