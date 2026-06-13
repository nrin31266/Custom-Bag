"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { ArrowRight, Gift, Image as ImageIcon, Pencil, ShoppingBag } from "lucide-react";
import colors from "@/data/colors.json";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import {
  countEmbroideryCharacters,
  formatPrice,
  getDisplayName,
  getPriceBreakdown,
} from "@/lib/utils";
import {
  colorAtom,
  designDataAtom,
  formTypeAtom,
  materialAtom,
} from "@/stores/customizationStore";

export default function Step5PreviewPage() {
  const navigation = useStepNavigation();
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const designData = useAtomValue(designDataAtom);
  const colorHex = colors[color as keyof typeof colors]?.hex ?? "#f5f5dc";
  const breakdown = getPriceBreakdown(form, material, color, false, designData);

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Xem lại thành phẩm
          </h1>
          <p className="mt-3 text-[#4a392f]">Kiểm tra lại thiết kế của bạn</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            {designData.previewDataUrl ? (
              <div
                aria-label="Ảnh custom đã lưu"
                className="min-h-[520px] rounded-lg border border-[#eadfd6] bg-[#eee9e3] bg-contain bg-center bg-no-repeat shadow-[0_20px_55px_rgba(67,39,25,0.14)] lg:min-h-[680px]"
                style={{ backgroundImage: `url(${designData.previewDataUrl})` }}
              />
            ) : (
              <ProductImage
                form={form}
                material={material}
                color={color}
                className="min-h-[520px] shadow-[0_20px_55px_rgba(67,39,25,0.14)] lg:min-h-[680px]"
                priority
              />
            )}
            <p className="mt-3 text-center text-sm text-[#4a392f]">
              {designData.updatedAt
                ? `Thiết kế đã lưu lúc ${new Date(designData.updatedAt).toLocaleString("vi-VN")}.`
                : "Hình ảnh chỉ mang tính chất minh họa, màu sắc thực tế có thể chênh lệch nhẹ."}
            </p>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-[#9a6b36]">
                Cấu hình túi
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold">
                {getDisplayName("form", form)}
              </h2>
              <div className="mt-4 space-y-3 text-sm text-[#4a392f]">
                <div className="flex justify-between gap-4">
                  <span>Chất liệu</span>
                  <strong>{getDisplayName("material", material)}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Màu sắc</span>
                  <strong className="flex items-center gap-2">
                    <span
                      className="inline-block size-5 rounded-full border border-[#d8c9bc]"
                      style={{ backgroundColor: colorHex }}
                    />
                    {getDisplayName("color", color)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-[#9a6b36]">
                Chữ thêu
              </p>
              <div className="mt-3 space-y-2">
                {designData.texts.length === 0 ? (
                  <p className="text-sm text-[#6d5b50]">Chưa thêm chữ thêu.</p>
                ) : (
                  designData.texts.map((item, index) => (
                    <div
                      key={`${item.text}-${index}`}
                      className="rounded-md bg-[#f7f1eb] p-3 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <strong style={{ fontFamily: item.font }}>
                          {item.text || `Chữ ${index + 1}`}
                        </strong>
                        <span className="rounded-full bg-white px-2 py-1 text-xs">
                          {countEmbroideryCharacters(item.text)} ký tự
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#6d5b50]">
                        <span>{item.fontLabel ?? item.font}</span>
                        <span
                          className="inline-block size-4 rounded-full border border-[#d8c9bc]"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-[#9a6b36]">
                Icon đã chọn
              </p>
              {designData.icons.length === 0 ? (
                <p className="mt-3 text-sm text-[#6d5b50]">Chưa thêm icon.</p>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {designData.icons.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="grid aspect-square place-items-center rounded-md bg-[#f7f1eb] p-2"
                    >
                      <span
                        className="block size-10 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${src})` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-[#9a6b36]">
                Chi phí hiện tại
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span>Giá túi</span>
                  <strong>{formatPrice(breakdown.bagPrice)}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Chữ & icon</span>
                  <strong>+{formatPrice(breakdown.customizationFee.total)}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Phí vận chuyển</span>
                  <strong>{formatPrice(breakdown.shippingFee)}</strong>
                </div>
                <div className="flex justify-between border-t border-[#eadfd6] pt-4 text-lg font-bold">
                  <span>Tổng</span>
                  <span>{formatPrice(breakdown.total)}</span>
                </div>
              </div>
              <p className="mt-3 flex gap-2 rounded-md bg-[#f7f1eb] p-3 text-xs text-[#6d5b50]">
                <ImageIcon size={16} className="shrink-0" />
                Box quà sẽ chọn ở bước tiếp theo.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Button variant="secondary" onClick={() => navigation.goToStep(4)}>
            <Pencil size={22} />
            Thiết kế lại
          </Button>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/cart"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#432719]/60 bg-white px-6 py-3 text-sm font-semibold uppercase text-[#432719] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5eee7] hover:shadow-md sm:text-base"
            >
              <ShoppingBag size={22} />
              Giỏ hàng
            </Link>
            <Button onClick={navigation.goNext}>
              <Gift size={22} />
              Chọn box quà
              <ArrowRight size={22} />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
