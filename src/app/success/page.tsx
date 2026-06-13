"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  Home,
  PackageCheck,
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
} from "@/stores/customizationStore";
import { formatPrice, getDisplayName } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "local-demo";
  const mode = searchParams.get("mode");
  const lastOrder = useAtomValue(lastOrderAtom);
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const designData = useAtomValue(designDataAtom);

  const downloadReceipt = () => {
    const anchor = document.createElement("a");
    const blob = new Blob(
      [
            JSON.stringify(
          {
            orderId,
            mode,
            savedMode: "local",
            lastOrder,
            form,
            material,
            color,
            designData,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `lenth-order-${orderId}.json`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  return (
    <main>
      <SiteHeader />
      <section className="hero-sheen min-h-[calc(100vh-80px)] overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="animate-fade-up rounded-lg border border-[#eadfd6] bg-[#fffdfb]/90 p-6 shadow-xl backdrop-blur">
            <div className="mb-5 grid size-16 place-items-center rounded-full bg-[#432719] text-white">
              <PackageCheck size={34} />
            </div>
            <p className="text-sm font-bold uppercase text-[#9a6b36]">
              Đặt hàng thành công
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
              Cảm ơn bạn đã custom cùng Lenth.
            </h1>
            <p className="mt-4 leading-7 text-[#5c473a]">
              Mã đơn của bạn là <strong>{orderId}</strong>.{" "}
              Đơn đã được lưu trên thiết bị này, bạn có thể xem lại trong tab Đã mua.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-[#f7f1eb] p-4">
                <BadgeCheck className="mb-3 text-[#9a6b36]" />
                <div className="text-sm text-[#5c473a]">Trạng thái</div>
                <div className="font-bold">Đã lưu</div>
              </div>
              <div className="rounded-md bg-[#f7f1eb] p-4">
                <Sparkles className="mb-3 text-[#9a6b36]" />
                <div className="text-sm text-[#5c473a]">Tổng tiền</div>
                <div className="font-bold">
                  {lastOrder ? formatPrice(lastOrder.total) : "Đang cập nhật"}
                </div>
              </div>
              <div className="rounded-md bg-[#f7f1eb] p-4">
                <PackageCheck className="mb-3 text-[#9a6b36]" />
                <div className="text-sm text-[#5c473a]">Sản phẩm</div>
                <div className="font-bold">{getDisplayName("form", form)}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={downloadReceipt}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#432719]/60 bg-white px-6 py-3 font-semibold uppercase text-[#432719] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5eee7]"
              >
                <Download size={20} />
                Tải đơn JSON
              </button>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#432719] px-6 py-3 font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-lg"
              >
                <Home size={20} />
                Về trang chủ
              </Link>
              <Link
                href="/step1-form?fresh=1"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#c6a43f] px-6 py-3 font-semibold uppercase text-[#28180f] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Custom tiếp
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="animate-float relative mx-auto w-full max-w-xl self-center">
            <div className="absolute inset-8 rounded-full bg-[#c6a43f]/20 blur-3xl" />
            {designData.previewDataUrl ? (
              <div
                className="relative aspect-square rounded-lg border border-[#eadfd6] bg-[#eee9e3] bg-contain bg-center bg-no-repeat shadow-2xl"
                style={{ backgroundImage: `url(${designData.previewDataUrl})` }}
              />
            ) : (
              <ProductImage
                form={form}
                material={material}
                color={color}
                className="relative shadow-2xl"
                priority
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main>
          <SiteHeader />
          <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <p className="animate-pulse text-lg font-semibold text-[#5c473a]">
              Đang mở thông tin đơn hàng...
            </p>
          </section>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
