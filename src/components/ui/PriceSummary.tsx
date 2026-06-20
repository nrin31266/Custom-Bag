"use client";

import { ProductImage } from "@/components/ui/ProductImage";
import { cn, formatPrice, getDisplayName, getPriceBreakdown } from "@/lib/utils";
import type { DesignData } from "@/stores/customizationStore";
import { getColorName, getSubOption } from "@/lib/productCatalog";

type PriceSummaryProps = {
  form: string;
  material: string;
  color: string;
  giftBox?: string;
  previewDataUrl?: string | null;
  designData?: DesignData;
  className?: string;
};

export function PriceSummary({
  form,
  material,
  color,
  giftBox = "none",
  previewDataUrl,
  designData,
  className,
}: PriceSummaryProps) {
  const breakdown = getPriceBreakdown(form, material, color, giftBox, designData);
  const subOption = getSubOption(form, material);
  const rows = [
    { label: "Giá form gốc", value: breakdown.basePrice },
    { label: "Điều chỉnh chất liệu", value: breakdown.materialDelta, signed: true },
    { label: "Phụ thu màu", value: breakdown.colorAdjust, signed: true },
    { label: "Giá túi sau lựa chọn", value: breakdown.bagPrice },
    { label: "Thêu chữ & icon", value: breakdown.customizationFee.total, signed: true },
    { label: "Box quà", value: breakdown.giftBoxFee, signed: true },
    { label: "Phí vận chuyển", value: breakdown.shippingFee },
  ];

  return (
    <aside
      className={cn(
        "sticky top-6 h-fit rounded-lg border border-[#eadfd6] bg-[#fffdfb]/95 p-4 shadow-[0_18px_50px_rgba(67,39,25,0.14)] backdrop-blur",
        className,
      )}
    >
      {previewDataUrl ? (
        <div
          aria-label="Ảnh custom đang chọn"
          className="mb-4 aspect-square rounded-lg border border-[#eadfd6] bg-[#eee9e3] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${previewDataUrl})` }}
        />
      ) : (
        <ProductImage form={form} material={material} color={color} className="mb-4" />
      )}
      <div className="rounded-lg bg-[#f7f1eb] p-4">
        <p className="text-xs font-bold uppercase text-[#9a6b36]">Đang chọn</p>
        <h2 className="mt-1 font-serif text-2xl font-bold">
          {getDisplayName("form", form)}
        </h2>
        <p className="mt-2 text-sm text-[#5c473a]">
          {subOption.name} - {getColorName(color)}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-[#eadfd6] bg-white/70 p-4">
        <p className="mb-3 text-xs font-bold uppercase text-[#9a6b36]">
          Chi tiết giá
        </p>
        <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[#5c473a]">{row.label}</span>
            <span
              className={cn(
                "font-semibold",
                row.signed && row.value > 0 && "text-[#9a6b36]",
                row.signed && row.value < 0 && "text-[#287457]",
              )}
            >
              {row.signed && row.value > 0 ? "+" : ""}
              {formatPrice(row.value)}
            </span>
          </div>
        ))}
        </div>
      </div>

      <div className="mt-4 border-t border-[#eadfd6] pt-4">
        <div className="flex items-end justify-between gap-4">
        <span className="font-bold uppercase">Tổng hiện tại</span>
          <span className="font-serif text-3xl font-bold text-[#432719]">
            {formatPrice(breakdown.total)}
          </span>
        </div>
        <p className="mt-2 text-xs text-[#7a675b]">
          Giá cập nhật theo từng lựa chọn. Phí vận chuyển sẽ tính khi chọn tỉnh/thành tại bước thanh toán.
        </p>
      </div>
    </aside>
  );
}
