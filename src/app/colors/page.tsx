"use client";

import Image from "next/image";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getAllColors } from "@/lib/productCatalog";
import Link from "next/link";

export default function ColorsPage() {
  const allColors = getAllColors();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#fbf8f5]">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6b36]">
              Màu sắc
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#2b1a12] sm:text-5xl">
              Bảng màu Lenth
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#6d5b50]">
              Từ những gam màu trung tính thanh lịch đến những sắc thái nổi bật,
              mỗi màu đều được phối riêng cho từng dòng túi.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {allColors.map(([key, color]) => (
              <div
                key={key}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="relative size-20 overflow-hidden rounded-2xl border border-[#e7ded6] shadow-[inset_0_6px_12px_rgba(255,255,255,.22),inset_0_-8px_12px_rgba(0,0,0,.06),0_4px_12px_rgba(67,39,25,.04)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(67,39,25,.08)] sm:size-24"
                  style={{
                    backgroundColor: color.hex,
                  }}
                >
                  {color.imageUrl ? (
                    <Image
                      src={color.imageUrl}
                      alt={color.name}
                      fill
                      sizes="(max-width: 768px) 30vw, 120px"
                      className="rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full rounded-2xl"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 35% 28%, rgba(255,255,255,.3), transparent 30%), radial-gradient(circle at 65% 72%, rgba(0,0,0,.08), transparent 34%), repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 1px, transparent 1px 5px), radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
                        backgroundSize:
                          "100% 100%, 100% 100%, 5px 5px, 5px 5px",
                      }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <span className="block text-xs font-semibold text-[#2b1a12]">
                    {color.name}
                  </span>
                  <span className="mt-0.5 block text-[10px] uppercase text-[#9a8a7d]">
                    {color.hex}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#e7ded6] bg-white p-8 text-center">
            <p className="text-sm leading-relaxed text-[#6d5b50]">
              Mỗi chất liệu sẽ có bảng màu riêng. Màu sắc trên website có thể
              khác nhẹ so với sản phẩm thực tế do điều kiện ánh sáng và màn hình.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/step1-form?fresh=1"
              className="inline-block rounded-full bg-[#432719] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#5a3624]"
            >
              Bắt đầu thiết kế túi
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}