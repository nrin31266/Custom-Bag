"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { calculateBagPrice, cn, formatPrice } from "@/lib/utils";
import {
  getColorOption,
  getDefaultColorOption,
  getMaterialDescription,
  getMaterialLabel,
  getProduct,
  getSubOptions,
  isSubOptionValidForForm,
} from "@/lib/productCatalog";
import {
  colorAtom,
  designDataAtom,
  EMPTY_DESIGN_DATA,
  formTypeAtom,
  materialAtom,
} from "@/stores/customizationStore";

const materialTextures: Record<string, string> = {
  "da-that": "bg-[#d4c3ad] [background-image:radial-gradient(circle_at_20%_30%,rgba(255,255,255,.24),transparent_32%),radial-gradient(#b0967d_1px,transparent_1.3px),linear-gradient(135deg,rgba(101,61,34,.1),transparent_60%)] [background-size:100%_100%,7px_7px,100%_100%]",
  "da-pebble": "bg-[#bc9a7a] [background-image:radial-gradient(circle_at_32%_28%,rgba(255,255,255,.18),transparent_30%),radial-gradient(#8a6a51_1.4px,transparent_1.8px),radial-gradient(#dcc7b0_0.8px,transparent_1.1px)] [background-size:100%_100%,6px_6px,10px_10px]",
  "da-saffiano": "bg-[#2c2622] [background-image:linear-gradient(45deg,rgba(255,255,255,.06)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.05)_50%,rgba(255,255,255,.05)_62%,transparent_62%),linear-gradient(-45deg,rgba(255,255,255,.04)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.04)_50%,rgba(255,255,255,.04)_62%,transparent_62%)] [background-size:10px_10px]",
  "da-lon": "bg-[#7d5235] [background-image:radial-gradient(circle_at_25%_25%,rgba(255,255,255,.08),transparent_34%),repeating-linear-gradient(92deg,rgba(255,255,255,.04)_0_1px,transparent_1px_5px),linear-gradient(140deg,rgba(48,26,12,.22),transparent_65%)] [background-size:100%_100%,5px_5px,100%_100%]",
  "da-pu": "bg-[#c99c7b] [background-image:radial-gradient(circle_at_30%_25%,rgba(255,255,255,.16),transparent_30%),radial-gradient(#a1765c_0.9px,transparent_1.2px),linear-gradient(135deg,rgba(110,65,42,.12),transparent_65%)] [background-size:100%_100%,7px_7px,100%_100%]",
  canvas: "bg-[#d9c8ae] [background-image:repeating-linear-gradient(0deg,rgba(92,69,45,.1)_0_1px,transparent_1px_5px),repeating-linear-gradient(90deg,rgba(92,69,45,.08)_0_1px,transparent_1px_5px),radial-gradient(circle_at_30%_25%,rgba(255,255,255,.14),transparent_38%)]",
  nylon: "bg-[#ddd0bc] [background-image:linear-gradient(115deg,rgba(255,255,255,.22),transparent_38%,rgba(78,56,38,.1)_66%,transparent),repeating-linear-gradient(72deg,rgba(116,84,55,.12)_0_1px,transparent_1px_6px)]",
  "vai-bo": "bg-[#c9ad88] [background-image:repeating-linear-gradient(0deg,rgba(88,68,45,.14)_0_2px,transparent_2px_6px),repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0_0.5px,transparent_0.5px_5px),radial-gradient(#91755b_0.8px,transparent_1.1px)] [background-size:100%_100%,100%_100%,5px_5px]",
};

export default function Step2MaterialPage() {
  const navigation = useStepNavigation();
  const [material, setMaterial] = useAtom(materialAtom);
  const [form] = useAtom(formTypeAtom);
  const [color, setColor] = useAtom(colorAtom);
  const [, setDesignData] = useAtom(designDataAtom);
  const product = getProduct(form);
  const subOptions = getSubOptions(form);

  useEffect(() => {
    if (isSubOptionValidForForm(form, material)) return;
    const fallback = subOptions[0];
    if (!fallback) return;
    setMaterial(fallback.id);
    setColor(fallback.colors[0]?.id ?? "");
    setDesignData(EMPTY_DESIGN_DATA);
  }, [form, material, setColor, setDesignData, setMaterial, subOptions]);

  const selectMaterial = (key: string) => {
    const defaultColor = getDefaultColorOption(form, key);
    setMaterial(key);
    setColor(defaultColor.id);
    setDesignData(EMPTY_DESIGN_DATA);
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Chọn chất liệu cho túi
          </h1>
          <p className="mt-3 text-[#4a392f]">
            {product.name} có nhiều phiên bản chất liệu — mỗi loại cho cảm giác và độ bền khác nhau, bạn cứ chọn cái ưng nhất
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[480px_1fr]">
          {/* Left: large product preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductImage
              form={form}
              material={material}
              color={color}
              className="aspect-square w-full rounded-2xl border border-[#e7ded6] shadow-[0_20px_55px_rgba(67,39,25,0.14)]"
              priority
            />
          </div>

          {/* Right: material selection cards */}
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {subOptions.map((item) => {
                const key = item.id;
                const selected = material === key;
                const previewColor = selected
                  ? getColorOption(form, key, color)
                  : item.colors[0];
                const estimatedPrice = calculateBagPrice(form, key, previewColor.id);
                const priceDelta = item.basePrice - product.basePrice;
                const materialLabel = getMaterialLabel(item.materialKey);
                const materialDescription =
                  getMaterialDescription(item.materialKey) || item.description;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectMaterial(key)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border bg-[#fffdfb] text-center transition duration-300 hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-xl",
                      selected
                        ? "scale-[1.02] border-[#432719] shadow-[0_16px_40px_rgba(67,39,25,0.2),0_0_0_4px_rgba(198,164,63,0.28)]"
                        : "border-[#eadfd6]",
                    )}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#432719] px-3 py-1 text-xs font-bold uppercase text-white shadow-lg">
                        <Check size={14} />
                        Đã chọn
                      </span>
                    )}
                    <div className="relative h-40 overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-0 transition duration-500 group-hover:scale-105",
                          materialTextures[item.materialKey],
                        )}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,.42),transparent_28%),linear-gradient(180deg,transparent,rgba(67,39,25,.18))]" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-white/60" />
                    </div>
                    <div className="p-4">
                      <div className="font-serif text-xl font-semibold">{item.name}</div>
                      <div className="mt-1 text-xs font-bold uppercase text-[#9a6b36]">
                        {materialLabel}
                      </div>
                      <div className="mt-2 min-h-10 text-sm text-[#4a392f]">
                        {item.description}
                      </div>
                      <div className="mt-2 text-xs text-[#7a675b]">
                        {materialDescription} &middot; {item.colors.length} màu để chọn
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <span className="rounded-full bg-[#f7f1eb] px-3 py-2 font-semibold text-[#7d4f2d]">
                          {priceDelta > 0
                            ? `+${formatPrice(priceDelta)}`
                            : priceDelta < 0
                              ? `-${formatPrice(Math.abs(priceDelta))}`
                              : "Giá chuẩn"}
                        </span>
                        <span className="rounded-full bg-[#432719] px-3 py-2 font-bold text-white">
                          {formatPrice(estimatedPrice)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button variant="secondary" onClick={navigation.goBack}>
                <ArrowLeft size={22} />
                Quay lại
              </Button>
              <Button onClick={navigation.goNext}>
                Chọn màu sắc
                <ArrowRight size={22} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}