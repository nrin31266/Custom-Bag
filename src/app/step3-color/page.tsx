"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { calculateBagPrice, cn, formatPrice } from "@/lib/utils";
import {
  getColorOptions,
  getProduct,
  getSubOption,
  isColorValidForSelection,
  resolveColorData,
  getAllColors,
} from "@/lib/productCatalog";
import {
  colorAtom,
  designDataAtom,
  EMPTY_DESIGN_DATA,
  formTypeAtom,
  materialAtom,
} from "@/stores/customizationStore";

export default function Step3ColorPage() {
  const navigation = useStepNavigation();
  const [color, setColor] = useAtom(colorAtom);
  const [form] = useAtom(formTypeAtom);
  const [material] = useAtom(materialAtom);
  const [, setDesignData] = useAtom(designDataAtom);
  const product = getProduct(form);
  const subOption = getSubOption(form, material);
  const colorOptions = getColorOptions(form, material);
  
  // Lấy tất cả màu để có imageUrl
  const allColors = getAllColors();
  const colorsMap = Object.fromEntries(allColors);

  useEffect(() => {
    if (isColorValidForSelection(form, material, color)) return;
    const fallback = colorOptions[0];
    if (!fallback) return;

    setColor(fallback.id);
    setDesignData(EMPTY_DESIGN_DATA);
  }, [color, colorOptions, form, material, setColor, setDesignData]);

  const selectColor = (key: string) => {
    setColor(key);
    setDesignData(EMPTY_DESIGN_DATA);
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Chọn màu cho túi
          </h1>
          <p className="mt-3 text-[#4a392f]">
            Bảng màu cho phiên bản chất liệu đã chọn — chạm vào màu bạn thích để xem trước
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

          {/* Right: color selection grid */}
          <div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {colorOptions.map((item) => {
                const key = item.id;
                const selected = color === key;
                const colorData = resolveColorData(key);
                const fullColorData = colorsMap[key];
                const displayName = colorData?.name ?? key;
                const displayHex = colorData?.hex ?? "#888";
                const colorImageUrl = fullColorData?.imageUrl;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectColor(key)}
                    className={cn(
                      "flex flex-col items-center gap-4 rounded-xl border bg-[#fffdfb] p-4 transition hover:-translate-y-1 hover:shadow-lg",
                      selected
                        ? "border-[#432719] ring-2 ring-[#432719]/20"
                        : "border-[#eadfd6]",
                    )}
                  >
                    <span
                      className={cn(
                        "relative size-32 overflow-hidden rounded-xl shadow-[inset_0_6px_12px_rgba(255,255,255,.15),inset_0_-8px_12px_rgba(0,0,0,.04),0_4px_12px_rgba(67,39,25,.04)] transition sm:size-36",
                        selected && "ring-2 ring-[#c6a43f]",
                      )}
                      style={{
                        backgroundColor: colorImageUrl ? undefined : displayHex,
                      }}
                    >
                      {colorImageUrl ? (
                        <Image
                          src={colorImageUrl}
                          alt={displayName}
                          fill
                          sizes="(max-width: 768px) 140px, 160px"
                          className="object-cover"
                        />
                      ) : (
                        <span
                          className="absolute inset-0 rounded-xl"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 35% 28%, rgba(255,255,255,.3), transparent 30%), radial-gradient(circle at 65% 72%, rgba(0,0,0,.08), transparent 34%), repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 1px, transparent 1px 5px), radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
                            backgroundSize: "100% 100%, 100% 100%, 5px 5px, 5px 5px",
                          }}
                        />
                      )}
                    </span>
                    <span className="font-serif text-xl">{displayName}</span>
                    <span className="rounded-full bg-[#f7f1eb] px-3 py-2 text-sm font-semibold text-[#432719]">
                      {item.priceAdjust > 0 ? `+${formatPrice(item.priceAdjust)}` : "Giá gốc"}
                    </span>
                    <span className="text-sm font-bold text-[#7d4f2d]">
                      Túi: {formatPrice(calculateBagPrice(form, material, key))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button variant="secondary" onClick={navigation.goBack}>
                <ArrowLeft size={22} />
                Quay lại
              </Button>
              <Button onClick={navigation.goNext}>
                Trang trí thêm
                <ArrowRight size={22} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}