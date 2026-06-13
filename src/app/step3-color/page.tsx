"use client";

import { useAtom } from "jotai";
import { ArrowLeft, ArrowRight } from "lucide-react";
import colors from "@/data/colors.json";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { calculateBagPrice, cn, formatPrice } from "@/lib/utils";
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

  const selectColor = (key: string) => {
    setColor(key);
    setDesignData(EMPTY_DESIGN_DATA);
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Chọn màu sắc
          </h1>
          <p className="mt-3 text-[#4a392f]">Chọn màu sắc bạn yêu thích</p>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
              {Object.entries(colors).map(([key, item]) => {
            const selected = color === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectColor(key)}
                className={cn(
                  "flex flex-col items-center gap-4 rounded-xl border border-transparent p-4 transition duration-300 hover:-translate-y-1 hover:bg-[#fffdfb] hover:shadow-lg",
                  selected &&
                    "border-[#432719] bg-[#fffdfb] shadow-[0_14px_34px_rgba(67,39,25,0.16)]",
                )}
              >
                <span
                  className={cn(
                    "grid size-32 place-items-center rounded-full border border-[#d8c9bc] shadow-[inset_0_18px_28px_rgba(255,255,255,.38),inset_0_-18px_26px_rgba(67,39,25,.18),0_16px_28px_rgba(67,39,25,.14)] transition sm:size-36",
                    selected &&
                      "ring-4 ring-[#c6a43f] ring-offset-4 ring-offset-[#fbf8f5]",
                  )}
                  style={{
                    backgroundColor: item.hex,
                    backgroundImage:
                      item.imageUrl
                        ? `radial-gradient(circle at 30% 22%, rgba(255,255,255,.62), transparent 28%), radial-gradient(circle at 70% 78%, rgba(0,0,0,.2), transparent 34%), url(${item.imageUrl})`
                        : "radial-gradient(circle at 30% 22%, rgba(255,255,255,.62), transparent 28%), radial-gradient(circle at 70% 78%, rgba(0,0,0,.2), transparent 34%), repeating-linear-gradient(45deg, rgba(255,255,255,.2) 0 1px, transparent 1px 7px), radial-gradient(rgba(0,0,0,0.16) 1px, transparent 1px)",
                    backgroundSize: item.imageUrl ? "100% 100%, 100% 100%, cover" : "100% 100%, 100% 100%, 8px 8px, 7px 7px",
                    backgroundPosition: "center",
                  }}
                />
                <span className="font-serif text-xl">{item.name}</span>
                <span className="rounded-full bg-[#f7f1eb] px-3 py-2 text-sm font-semibold text-[#432719]">
                  {item.priceAdjust > 0 ? `+${formatPrice(item.priceAdjust)}` : "Không phụ thu"}
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
              Tiếp theo
              <ArrowRight size={22} />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
