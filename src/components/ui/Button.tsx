"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-3 rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-normal transition duration-300 disabled:pointer-events-none disabled:opacity-50 sm:text-base",
        variant === "primary" &&
          "bg-[#432719] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-lg active:translate-y-0",
        variant === "secondary" &&
          "border border-[#432719]/60 bg-white text-[#432719] hover:-translate-y-0.5 hover:bg-[#f5eee7] hover:shadow-md active:translate-y-0",
        variant === "ghost" &&
          "bg-transparent text-[#432719] hover:bg-[#f5eee7]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
