"use client";

import { useAtom } from "jotai";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import forms from "@/data/forms.json";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { calculateBagPrice, cn, formatPrice } from "@/lib/utils";
import {
  colorAtom,
  designDataAtom,
  EMPTY_DESIGN_DATA,
  formTypeAtom,
  giftBoxAtom,
  materialAtom,
} from "@/stores/customizationStore";

export default function Step1FormPage() {
  const navigation = useStepNavigation();
  const [formType, setFormType] = useAtom(formTypeAtom);
  const [material, setMaterial] = useAtom(materialAtom);
  const [color, setColor] = useAtom(colorAtom);
  const [, setDesignData] = useAtom(designDataAtom);
  const [, setGiftBox] = useAtom(giftBoxAtom);
  const freshHandled = useRef(false);

  useEffect(() => {
    if (freshHandled.current) return;
    freshHandled.current = true;

    const params = new URLSearchParams(window.location.search);
    if (params.get("fresh") !== "1") return;

    setFormType("shoulder");
    setMaterial("da-pebble");
    setColor("trang-be");
    setGiftBox(false);
    setDesignData(EMPTY_DESIGN_DATA);
    window.history.replaceState(null, "", "/step1-form");
  }, [setColor, setDesignData, setFormType, setGiftBox, setMaterial]);

  const selectForm = (key: string) => {
    setFormType(key);
    setDesignData(EMPTY_DESIGN_DATA);
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Chọn form túi
          </h1>
          <p className="mt-3 text-[#4a392f]">
            Chọn kiểu dáng túi mà bạn yêu thích
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(forms).map(([key, form]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectForm(key)}
                  className={cn(
                    "rounded-lg border bg-[#fffdfb] p-3 text-center transition hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-xl",
                    formType === key
                      ? "scale-[1.02] border-[#432719] shadow-[0_14px_38px_rgba(67,39,25,0.18),0_0_0_3px_rgba(198,164,63,0.25)]"
                      : "border-[#eadfd6]",
                  )}
                >
                  <ProductImage
                    form={key}
                    material={material}
                    color={color}
                    className="mb-3"
                    priority={key === "shoulder"}
                  />
                  <div className="font-serif text-xl">{form.name}</div>
                  <div className="mt-1 text-sm text-[#7a675b]">
                    Từ {formatPrice(form.basePrice)}
                  </div>
                  <div className="mt-2 rounded-full bg-[#f7f1eb] px-3 py-2 text-sm font-bold text-[#432719]">
                    Theo lựa chọn hiện tại:{" "}
                    {formatPrice(calculateBagPrice(key, material, color))}
                  </div>
                </button>
              ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-xl justify-end">
            <Button onClick={navigation.goNext} className="w-full">
              Tiếp theo
              <ArrowRight size={22} />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
