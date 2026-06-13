"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/step1-form?fresh=1", activeHref: "/step1-form", label: "Custom túi" },
  { href: "/materials", label: "Chất liệu" },
  { href: "/colors", label: "Màu sắc" },
  { href: "/guide", label: "Cách hoạt động" },
  { href: "/about", label: "Về Lenth" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7ded6]/90 bg-[#fbf8f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          aria-label="Mở menu"
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full text-[#2b1a12] transition hover:bg-[#f3e9de] lg:hidden"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>

        <Link href="/" className="font-serif leading-none">
          <span className="block text-4xl tracking-normal">Lenth</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.42em]">
            Custom Bag
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-[#4a392f] transition hover:bg-[#f3e9de]",
                pathname === (item.activeHref ?? item.href) && "bg-[#432719] text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          aria-label="Giỏ hàng"
          className="grid size-11 place-items-center rounded-full text-[#2b1a12] transition hover:bg-[#f3e9de]"
        >
          <ShoppingBag size={25} strokeWidth={1.7} />
        </Link>
      </div>

      <div
        className={cn(
          "grid border-t border-[#e7ded6] transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav className="overflow-hidden px-4">
          <div className="flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 text-sm font-semibold text-[#4a392f] transition hover:bg-[#f3e9de]",
                  pathname === (item.activeHref ?? item.href) && "bg-[#432719] text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
