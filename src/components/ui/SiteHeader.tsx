"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { cartItemsAtom } from "@/stores/customizationStore";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/step1-form?fresh=1", activeHref: "/step1-form", label: "Custom túi" },
  { href: "/materials", label: "Chất liệu" },
  { href: "/colors", label: "Màu sắc" },
  { href: "/guide", label: "Hướng dẫn" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const cartItems = useAtomValue(cartItemsAtom);
  const cartCount = cartItems.length;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7ded6]/80 bg-[#fdfaf7]/95 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Mở menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full text-[#2b1a12] transition hover:bg-[#f0e8de] lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-1.5">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#2b1a12]">
            Lenth
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.35em] text-[#9a6b36] sm:inline-block">
            Custom Bag
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === (item.activeHref ?? item.href) || (item.activeHref && pathname.startsWith(item.activeHref));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#432719] text-white shadow-sm"
                    : "text-[#4a392f] hover:bg-[#f0e8de]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Cart icon with badge */}
        <Link
          href="/cart"
          aria-label={`Giỏ hàng${cartCount > 0 ? ` (${cartCount} mẫu)` : ""}`}
          className="relative grid size-10 place-items-center rounded-full text-[#2b1a12] transition hover:bg-[#f0e8de]"
        >
          <ShoppingBag size={22} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-[#c6a43f] text-[10px] font-bold text-white shadow-sm">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-[#e7ded6] bg-[#fdfaf7] transition-all duration-300 lg:hidden",
          open ? "max-h-[400px]" : "max-h-0 border-transparent",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {navItems.map((item) => {
            const active = pathname === (item.activeHref ?? item.href) || (item.activeHref && pathname.startsWith(item.activeHref));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "bg-[#432719] text-white"
                    : "text-[#4a392f] hover:bg-[#f0e8de]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 border-t border-[#e7ded6] pt-3">
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-4 py-3 text-sm font-medium text-[#7a675b] transition-colors hover:bg-[#f0e8de]",
                pathname === "/about" && "bg-[#f0e8de]",
              )}
            >
              Về Lenth
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
