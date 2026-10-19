import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx("field", className)} {...rest} />;
}
