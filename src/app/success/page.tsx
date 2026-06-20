"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Home,
  PackageCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { SiteHeader } from "@/components/ui/SiteHeader";
import {
  colorAtom,
  designDataAtom,
  formTypeAtom,
  lastOrderAtom,
  materialAtom,
  purchasedOrdersAtom,
} from "@/stores/customizationStore";
import { formatPrice, getDisplayName } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "local-demo";
  const lastOrder = useAtomValue(lastOrderAtom);
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const designData = useAtomValue(designDataAtom);
  const purchasedOrders = useAtomValue(purchasedOrdersAtom);

  // Find the order that matches the URL orderId
  const matchedOrder = purchasedOrders.find((o) => o.id === orderId);
  const orderItems = matchedOrder?.items ?? [];
  const isMultiItem = orderItems.length > 1;
  const totalAmount = lastOrder?.total ?? matchedOrder?.total ?? 0;
  const firstItem = orderItems[0];

  return (
    <main>
      <SiteHeader />
      <section className="hero-sheen-success relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-[#eadfd6]">
        <div className="sparkle-dot" />
        <div className="sparkle-dot" />
        <div className="sparkle-dot" />
        <div className="sparkle-dot" />
        <div className="sparkle-dot" />
        <div className="sparkle-dot" />
        <div className="sparkle-dot" />

        {isMultiItem ? (
          /* ─── Multi-item layout ─── */
          <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-8">
            <div className="mb-10 text-center animate-slide-in-left">
              <div className="mx-auto mb-5 grid size-20 place-items-center rounded-2xl bg-[#432719] text-white shadow-xl shadow-[#c6a43f]/30">
                <PackageCheck size={42} />
              </div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#9a6b36]">
                Đặt hàng thành công
              </p>
              <h1 className="mt-3 font-serif text-5xl font-bold leading-tight sm:text-6xl">
                Cảm ơn bạn đã
                <br />
                <span className="bg-gradient-to-r from-[#432719] via-[#7d4f2d] to-[#c6a43f] bg-clip-text text-transparent">chọn Lenth.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#5c473a]">
                Đơn hàng <strong className="text-[#432719]">{orderId}</strong> với <strong>{orderItems.length} mẫu túi</strong> đã được ghi nhận.
                Bạn có thể xem lại trong mục <strong>Đã mua</strong> ở giỏ hàng.
              </p>

              {/* Summary stats */}
              <div className="animate-enter-stagger mt-8 grid gap-4 sm:grid-cols-3">
                <div className="card-shine rounded-xl border border-[#eadfd6] bg-white p-5">
                  <BadgeCheck className="mb-3 text-[#9a6b36]" size={24} />
                  <div className="text-sm text-[#5c473a]">Trạng thái</div>
                  <div className="mt-1 text-lg font-bold text-[#2b1a12]">Đã tiếp nhận</div>
                </div>
                <div className="card-shine rounded-xl border border-[#eadfd6] bg-white p-5">
                  <Sparkles className="mb-3 text-[#9a6b36]" size={24} />
                  <div className="text-sm text-[#5c473a]">Tổng tiền</div>
                  <div className="mt-1 text-lg font-bold text-[#2b1a12]">
                    {formatPrice(totalAmount)}
                  </div>
                </div>
                <div className="card-shine rounded-xl border border-[#eadfd6] bg-white p-5">
                  <ShoppingBag className="mb-3 text-[#9a6b36]" size={24} />
                  <div className="text-sm text-[#5c473a]">Số mẫu</div>
                  <div className="mt-1 text-lg font-bold text-[#2b1a12]">{orderItems.length} mẫu</div>
                </div>
              </div>
            </div>

            {/* All items grid */}
            <div className="animate-enter-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {orderItems.map((item) => (
                <div key={item.id} className="card-shine rounded-2xl border border-[#eadfd6] bg-white p-4 transition hover:shadow-lg">
                      {item.designData.previewDataUrl ? (
                    <div
                      className="aspect-square w-full rounded-xl border border-[#e7ded6] bg-[#eee9e3] bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${item.designData.previewDataUrl})` }}
                    />
                  ) : (
                    <ProductImage form={item.form} material={item.material} color={item.color} className="aspect-square w-full rounded-xl" />
                  )}
                  <div className="mt-3">
                    <div className="font-serif text-lg font-bold">{getDisplayName("form", item.form)}</div>
                    <p className="mt-1 text-sm text-[#5c473a]">
                      {getDisplayName("material", item.material)} &middot; {getDisplayName("color", item.color)}
                    </p>
                    {item.designData.texts.length > 0 && (
                      <p className="mt-1 text-xs text-[#9a8a7d]">
                        Thêu: {item.designData.texts.map((t) => t.text).join(", ")}
                      </p>
                    )}
                    <div className="mt-2 font-bold text-[#432719]">{formatPrice(item.total)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/cart" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#432719]/40 bg-white px-8 py-3.5 font-semibold uppercase text-[#432719] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5eee7] hover:shadow-md">
                <ShoppingBag size={20} /> Xem giỏ hàng
              </Link>
              <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#432719] px-8 py-3.5 font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-xl">
                <Home size={20} /> Về trang chủ
              </Link>
              <Link href="/step1-form?fresh=1" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#c6a43f] px-8 py-3.5 font-semibold uppercase text-[#28180f] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                Làm thêm một chiếc nữa <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── Single-item layout ─── */
          <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="animate-slide-in-left order-2 lg:order-1">
              <div className="mb-5 grid size-20 place-items-center rounded-2xl bg-[#432719] text-white shadow-xl shadow-[#c6a43f]/30">
                <PackageCheck size={42} />
              </div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#9a6b36]">
                Đặt hàng thành công
              </p>
              <h1 className="mt-3 font-serif text-5xl font-bold leading-tight sm:text-6xl">
                Cảm ơn bạn đã
                <br />
                <span className="bg-gradient-to-r from-[#432719] via-[#7d4f2d] to-[#c6a43f] bg-clip-text text-transparent">chọn Lenth.</span>
              </h1>
              <p className="mt-5 max-w-xl leading-7 text-[#5c473a]">
                Đơn hàng <strong className="text-[#432719]">{orderId}</strong> của bạn đã được ghi nhận.
                Bạn có thể xem lại đơn bất cứ lúc nào trong mục <strong>Đã mua</strong> ở giỏ hàng.
              </p>

              <div className="animate-enter-stagger mt-8 grid gap-4 sm:grid-cols-3">
                <div className="card-shine rounded-xl border border-[#eadfd6] bg-white p-5">
                  <BadgeCheck className="mb-3 text-[#9a6b36]" size={24} />
                  <div className="text-sm text-[#5c473a]">Trạng thái</div>
                  <div className="mt-1 text-lg font-bold text-[#2b1a12]">Đã tiếp nhận</div>
                </div>
                <div className="card-shine rounded-xl border border-[#eadfd6] bg-white p-5">
                  <Sparkles className="mb-3 text-[#9a6b36]" size={24} />
                  <div className="text-sm text-[#5c473a]">Tổng tiền</div>
                  <div className="mt-1 text-lg font-bold text-[#2b1a12]">
                    {formatPrice(totalAmount)}
                  </div>
                </div>
                <div className="card-shine rounded-xl border border-[#eadfd6] bg-white p-5">
                  <ShoppingBag className="mb-3 text-[#9a6b36]" size={24} />
                  <div className="text-sm text-[#5c473a]">Kiểu túi</div>
                  <div className="mt-1 text-lg font-bold text-[#2b1a12]">{getDisplayName("form", firstItem?.form ?? form)}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/cart" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#432719]/40 bg-white px-8 py-3.5 font-semibold uppercase text-[#432719] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5eee7] hover:shadow-md">
                  <ShoppingBag size={20} /> Xem giỏ hàng
                </Link>
                <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#432719] px-8 py-3.5 font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-xl">
                  <Home size={20} /> Về trang chủ
                </Link>
                <Link href="/step1-form?fresh=1" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#c6a43f] px-8 py-3.5 font-semibold uppercase text-[#28180f] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  Làm thêm một chiếc nữa <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            <div className="animate-slide-in-right order-1 lg:order-2 relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-full bg-[#c6a43f]/15 blur-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse-glow size-32 rounded-full border-2 border-[#c6a43f]/30" />
              </div>
              <div className="absolute left-1/3 top-1/4"><div className="animate-sparkle size-2 rounded-full bg-[#c6a43f]" /></div>
              <div className="absolute right-1/3 bottom-1/4" style={{ animationDelay: "1s" }}><div className="animate-sparkle size-1.5 rounded-full bg-[#c6a43f]" style={{ animationDelay: "1s" }} /></div>
              {firstItem?.designData.previewDataUrl ? (
                <div
                  className="relative aspect-square w-full rounded-2xl border border-[#eadfd6] bg-[#eee9e3] bg-cover bg-center bg-no-repeat shadow-2xl"
                  style={{ backgroundImage: `url(${firstItem.designData.previewDataUrl})` }}
                />
              ) : (
                <ProductImage form={firstItem?.form ?? form} material={firstItem?.material ?? material} color={firstItem?.color ?? color} className="relative drop-shadow-2xl rounded-2xl" priority />
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main>
        <SiteHeader />
        <section className="mx-auto max-w-[1600px] px-6 py-24 text-center sm:px-8">
          <p className="animate-pulse text-lg font-semibold text-[#5c473a]">Đang mở thông tin đơn hàng...</p>
        </section>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}