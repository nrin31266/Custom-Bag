"use client";

import Image from "next/image";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getAllMaterials, getMaterialParent } from "@/lib/productCatalog";
import type { MaterialData } from "@/lib/productCatalog";
import Link from "next/link";

const materialTextures: Record<string, string> = {
  "da-that":
    "bg-[#d4c3ad] [background-image:radial-gradient(circle_at_20%_30%,rgba(255,255,255,.24),transparent_32%),radial-gradient(#b0967d_1px,transparent_1.3px),linear-gradient(135deg,rgba(101,61,34,.1),transparent_60%)] [background-size:100%_100%,7px_7px,100%_100%]",
  "da-pebble":
    "bg-[#bc9a7a] [background-image:radial-gradient(circle_at_32%_28%,rgba(255,255,255,.18),transparent_30%),radial-gradient(#8a6a51_1.4px,transparent_1.8px),radial-gradient(#dcc7b0_0.8px,transparent_1.1px)] [background-size:100%_100%,6px_6px,10px_10px]",
  "da-saffiano":
    "bg-[#2c2622] [background-image:linear-gradient(45deg,rgba(255,255,255,.06)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.05)_50%,rgba(255,255,255,.05)_62%,transparent_62%),linear-gradient(-45deg,rgba(255,255,255,.04)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.04)_50%,rgba(255,255,255,.04)_62%,transparent_62%)] [background-size:10px_10px]",
  "da-lon":
    "bg-[#7d5235] [background-image:radial-gradient(circle_at_25%_25%,rgba(255,255,255,.08),transparent_34%),repeating-linear-gradient(92deg,rgba(255,255,255,.04)_0_1px,transparent_1px_5px),linear-gradient(140deg,rgba(48,26,12,.22),transparent_65%)] [background-size:100%_100%,5px_5px,100%_100%]",
  "da-pu":
    "bg-[#c99c7b] [background-image:radial-gradient(circle_at_30%_25%,rgba(255,255,255,.16),transparent_30%),radial-gradient(#a1765c_0.9px,transparent_1.2px),linear-gradient(135deg,rgba(110,65,42,.12),transparent_65%)] [background-size:100%_100%,7px_7px,100%_100%]",
  canvas:
    "bg-[#d9c8ae] [background-image:repeating-linear-gradient(0deg,rgba(92,69,45,.1)_0_1px,transparent_1px_5px),repeating-linear-gradient(90deg,rgba(92,69,45,.08)_0_1px,transparent_1px_5px),radial-gradient(circle_at_30%_25%,rgba(255,255,255,.14),transparent_38%)]",
  nylon:
    "bg-[#ddd0bc] [background-image:linear-gradient(115deg,rgba(255,255,255,.22),transparent_38%,rgba(78,56,38,.1)_66%,transparent),repeating-linear-gradient(72deg,rgba(116,84,55,.12)_0_1px,transparent_1px_6px)]",
  "vai-bo":
    "bg-[#c9ad88] [background-image:repeating-linear-gradient(0deg,rgba(88,68,45,.14)_0_2px,transparent_2px_6px),repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0_0.5px,transparent_0.5px_5px),radial-gradient(#91755b_0.8px,transparent_1.1px)] [background-size:100%_100%,100%_100%,5px_5px]",
};

export default function MaterialsPage() {
  const allMaterials = getAllMaterials();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#fbf8f5]">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6b36]">
              Chất liệu
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#2b1a12] sm:text-5xl">
              Bộ sưu tập chất liệu
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#6d5b50]">
              Mỗi chất liệu được chọn lọc kĩ càng, mang đến vẻ đẹp và độ bền riêng.
              Lenth cung cấp đa dạng chất liệu từ da thật cao cấp đến các dòng vải hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allMaterials.map(([key, mat]) => {
              const parentKey = getMaterialParent(key);
              const parentName = parentKey
                ? allMaterials.find(([k]) => k === parentKey)?.[1]?.name
                : null;
              const texture = materialTextures[key];

              return (
                <div
                  key={key}
                  className="group overflow-hidden rounded-2xl border border-[#e7ded6] bg-white transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(67,39,25,0.08)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    {mat.imageUrl ? (
                      <Image
                        src={mat.imageUrl}
                        alt={mat.name}
                        fill
                        sizes="(max-width: 768px) 90vw, 380px"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`h-full w-full transition duration-700 group-hover:scale-105 ${texture}`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b1a12]/20 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5">
                      <span className="inline-block rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase text-[#7d4f2d] backdrop-blur-sm">
                        {key}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="font-serif text-2xl font-bold text-[#2b1a12]">
                      {mat.name}
                    </h2>
                    {parentName && (
                      <p className="mt-1 text-sm text-[#9a6b36]">
                        Thuộc dòng: {parentName}
                      </p>
                    )}
                    <p className="mt-3 leading-relaxed text-[#6d5b50]">
                      {mat.description}
                    </p>
                    <div className="mt-5 border-t border-[#f3e9de] pt-4">
                      <Link
                        href={`/step1-form?fresh=1&filterMaterial=${key}`}
                        className="text-sm font-semibold text-[#7d4f2d] underline underline-offset-4 transition hover:text-[#9a6b36]"
                      >
                        Xem túi chất liệu này
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-[#9a8a7d]">
              Chất liệu ảnh hưởng đến giá, cảm giác và độ bền của túi.
            </p>
            <Link
              href="/step1-form?fresh=1"
              className="mt-4 inline-block rounded-full bg-[#432719] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#5a3624]"
            >
              Bắt đầu thiết kế túi
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}