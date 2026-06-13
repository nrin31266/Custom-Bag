"use client";

import Link from "next/link";
import { Check, Menu, ShoppingBag } from "lucide-react";
import { STEP_LABELS, STEP_ORDER } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <header className="border-b border-[#e7ded6] bg-[linear-gradient(135deg,#fffdfb_0%,#fbf8f5_52%,#f1e2d4_100%)] shadow-[0_12px_32px_rgba(67,39,25,0.08)]">
      <div className="relative flex h-20 items-center justify-center px-5 sm:h-24">
        <Link
          href="/"
          aria-label="Mở menu"
          className="absolute left-4 grid size-10 place-items-center text-[#2b1a12]"
        >
          <Menu size={28} strokeWidth={1.5} />
        </Link>
        <Link href="/" className="text-center font-serif leading-none">
          <div className="text-4xl tracking-normal sm:text-5xl">Lenth</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.45em] sm:text-xs">
            Custom Bag
          </div>
        </Link>
        <Link
          href="/cart"
          aria-label="Giỏ hàng"
          className="absolute right-4 grid size-10 place-items-center text-[#2b1a12]"
        >
          <ShoppingBag size={27} strokeWidth={1.5} />
        </Link>
      </div>

      <nav className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
        <ol className="grid grid-cols-7 gap-1">
          {STEP_ORDER.map((step, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <li key={step} className="relative flex flex-col items-center gap-2">
                {index > 0 && (
                  <span
                    className={cn(
                      "absolute right-1/2 top-4 h-px w-full bg-[#e4dbd3]",
                      stepNumber <= currentStep && "bg-[#432719]",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 grid size-8 place-items-center rounded-full border border-[#e4dbd3] bg-[#fbf8f5] text-sm text-[#3b2a20] shadow-sm transition duration-300",
                    (isActive || isComplete) &&
                      "border-[#432719] bg-[#432719] text-white shadow-[0_8px_22px_rgba(67,39,25,0.26)]",
                  )}
                >
                  {isComplete ? <Check size={18} /> : stepNumber}
                </span>
                <span
                  className={cn(
                    "hidden max-w-28 text-center text-sm text-[#3b2a20] sm:block",
                    isActive && "font-semibold",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
