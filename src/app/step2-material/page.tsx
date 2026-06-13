"use client";

import Image from "next/image";
import { useAtom } from "jotai";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import materials from "@/data/materials.json";
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

const materialTextures: Record<string, string> = {
  "da-that": "bg-[#efe3d5] [background-image:radial-gradient(circle_at_20%_30%,rgba(255,255,255,.75),transparent_26%),radial-gradient(#cdb49f_1.2px,transparent_1.3px),linear-gradient(135deg,rgba(101,61,34,.18),transparent_55%)] [background-size:100%_100%,9px_9px,100%_100%]",
  "da-pebble": "bg-[#c6a487] [background-image:radial-gradient(circle_at_32%_28%,rgba(255,255,255,.35),transparent_24%),radial-gradient(#8f6c54_1.7px,transparent_1.9px),radial-gradient(#ead2bd_1px,transparent_1.2px)] [background-size:100%_100%,7px_7px,11px_11px]",
  "da-saffiano": "bg-[#14110f] [background-image:linear-gradient(45deg,rgba(255,255,255,.18)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.14)_50%,rgba(255,255,255,.14)_62%,transparent_62%),linear-gradient(-45deg,rgba(255,255,255,.08)_12%,transparent_12%,transparent_50%,rgba(255,255,255,.1)_50%,rgba(255,255,255,.1)_62%,transparent_62%)] [background-size:12px_12px]",
  "da-lon": "bg-[#8a5938] [background-image:radial-gradient(circle_at_25%_25%,rgba(255,255,255,.18),transparent_28%),repeating-linear-gradient(92deg,rgba(255,255,255,.08)_0_1px,transparent_1px_6px),linear-gradient(140deg,rgba(48,26,12,.35),transparent_60%)] [background-size:100%_100%,7px_7px,100%_100%]",
  "da-pu": "bg-[#d3a385] [background-image:radial-gradient(circle_at_30%_25%,rgba(255,255,255,.35),transparent_24%),radial-gradient(#a87d66_1.2px,transparent_1.4px),linear-gradient(135deg,rgba(110,65,42,.2),transparent_60%)] [background-size:100%_100%,8px_8px,100%_100%]",
  canvas: "bg-[#e5d4bd] [background-image:repeating-linear-gradient(0deg,rgba(92,69,45,.18)_0_1px,transparent_1px_7px),repeating-linear-gradient(90deg,rgba(92,69,45,.16)_0_1px,transparent_1px_7px),radial-gradient(circle_at_30%_25%,rgba(255,255,255,.32),transparent_32%)]",
  nylon: "bg-[#e8d5bf] [background-image:linear-gradient(115deg,rgba(255,255,255,.45),transparent_34%,rgba(78,56,38,.18)_64%,transparent),repeating-linear-gradient(72deg,rgba(116,84,55,.2)_0_1px,transparent_1px_8px)]",
  "vai-bo": "bg-[#d1b48f] [background-image:repeating-linear-gradient(0deg,rgba(88,68,45,.22)_0_2px,transparent_2px_8px),repeating-linear-gradient(90deg,rgba(255,255,255,.18)_0_1px,transparent_1px_7px),radial-gradient(#92775c_1px,transparent_1.3px)] [background-size:100%_100%,100%_100%,6px_6px]",
};

export default function Step2MaterialPage() {
  const navigation = useStepNavigation();
  const [material, setMaterial] = useAtom(materialAtom);
  const [form] = useAtom(formTypeAtom);
  const [color] = useAtom(colorAtom);
  const [, setDesignData] = useAtom(designDataAtom);

  const selectMaterial = (key: string) => {
    setMaterial(key);
    setDesignData(EMPTY_DESIGN_DATA);
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Chọn chất liệu túi
          </h1>
          <p className="mt-3 text-[#4a392f]">
            Lựa chọn chất liệu phù hợp với phong cách của bạn
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(materials).map(([key, item]) => {
            const selected = material === key;
            const estimatedPrice = calculateBagPrice(form, key, color);
            const multiplierLabel =
              item.priceMultiplier === 1
                ? "Giá chuẩn"
                : item.priceMultiplier > 1
                  ? `+${Math.round((item.priceMultiplier - 1) * 100)}%`
                  : `-${Math.round((1 - item.priceMultiplier) * 100)}%`;

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
                    Đang chọn
                  </span>
                )}
                <div className="relative h-40 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 380px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={cn(
                        "absolute inset-0 transition duration-500 group-hover:scale-105",
                        materialTextures[key],
                      )}
                    />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,.42),transparent_28%),linear-gradient(180deg,transparent,rgba(67,39,25,.18))]" />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-white/60" />
                </div>
                <div className="p-4">
                  <div className="font-serif text-xl font-semibold">{item.name}</div>
                  <div className="mt-2 text-sm text-[#4a392f]">{item.description}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <span className="rounded-full bg-[#f7f1eb] px-3 py-2 font-semibold text-[#7d4f2d]">
                      {multiplierLabel}
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
              Tiếp theo
              <ArrowRight size={22} />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
