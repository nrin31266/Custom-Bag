"use client";

import Image from "next/image";
import { useAtom, useAtomValue } from "jotai";
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from "lucide-react";
import giftboxConfig from "@/data/giftbox.json";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { createCartItem } from "@/lib/cartUtils";
import { calculateTotal, cn, formatPrice } from "@/lib/utils";
import {
  cartItemsAtom,
  colorAtom,
  designDataAtom,
  formTypeAtom,
  giftBoxAtom,
  materialAtom,
} from "@/stores/customizationStore";

export default function Step6GiftBoxPage() {
  const navigation = useStepNavigation();
  const [giftBox, setGiftBox] = useAtom(giftBoxAtom);
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const designData = useAtomValue(designDataAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const totalWithCurrentBox = calculateTotal(form, material, color, giftBox, designData);
  const currentInCart = cartItems.some(
    (item) =>
      item.form === form &&
      item.material === material &&
      item.color === color &&
      item.giftBox === giftBox &&
      item.designData.updatedAt === designData.updatedAt,
  );

  const addToCart = () => {
    setCartItems((items) => [
      createCartItem({ form, material, color, giftBox, designData }),
      ...items,
    ]);
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Gói quà tặng
          </h1>
          <p className="mt-3 text-[#4a392f]">
            Thêm một chút tinh tế cho món quà của bạn
          </p>
        </div>

        <div className="space-y-4">
          {giftboxConfig.options.map((option) => {
            const selected = giftBox === option.key;
            const totalWithOption = calculateTotal(form, material, color, option.key, designData);
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setGiftBox(option.key)}
                className={cn(
                  "grid w-full overflow-hidden rounded-xl border bg-[#fffdfb] text-left transition sm:grid-cols-[1.2fr_1fr]",
                  selected
                    ? "border-[#432719] shadow-[0_10px_28px_rgba(67,39,25,0.14),0_0_0_3px_rgba(198,164,63,0.2)]"
                    : "border-[#eadfd6] hover:border-[#c6a43f] hover:shadow-md",
                )}
              >
                {/* Left: big image with title overlay */}
                <div className="relative h-60 sm:h-80 bg-[#eee9e3]">
                  <Image
                    src={option.image}
                    alt={option.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 600px"
                    className="object-cover"
                    unoptimized
                  />
                  {/* Gradient overlay + title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b1a12]/70 via-[#2b1a12]/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">{option.title}</h2>
                    <p className="mt-1 text-sm text-white/80 drop-shadow-sm">{option.description}</p>
                  </div>
                  {/* Radio badge */}
                  <span
                    className={cn(
                      "absolute right-4 top-4 grid size-8 place-items-center rounded-full border-2 bg-white/90 backdrop-blur transition",
                      selected ? "border-[#432719] text-[#432719]" : "border-[#d8c9bc] text-transparent",
                    )}
                  >
                    {selected && <Check size={16} />}
                  </span>
                </div>

                {/* Right: contents & price */}
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="text-sm font-bold uppercase text-[#9a6b36]">Bao gồm</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {option.contents.map((item) => (
                        <span key={item} className="rounded-full bg-[#432719]/5 px-3.5 py-1.5 text-sm font-medium text-[#432719]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-[#eadfd6] pt-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-2xl font-bold text-[#2b1a12]">{formatPrice(totalWithOption)}</span>
                      {option.key !== "none" && (
                        <span className="rounded-full bg-[#432719] px-4 py-1.5 text-sm font-bold text-white">
                          +{formatPrice(giftboxConfig.fee)}
                        </span>
                      )}
                    </div>
                    {option.key !== "none" ? (
                      <p className="mt-2 text-sm font-medium text-[#9a6b36]">
                        Cộng thêm {formatPrice(giftboxConfig.fee)} phí gói quà
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-[#9a8a7d]">Không thêm chi phí</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button variant="secondary" onClick={navigation.goBack}>
            <ArrowLeft size={20} />
            Quay lại
          </Button>
          <Button
            variant={currentInCart ? "secondary" : "primary"}
            onClick={addToCart}
            disabled={currentInCart}
          >
            {currentInCart ? <Check size={20} /> : <ShoppingBag size={20} />}
            {currentInCart ? "Đã thêm giỏ" : "Thêm vào giỏ"}
          </Button>
          <Button onClick={navigation.goNext}>
            Tiếp theo
            <ArrowRight size={20} />
          </Button>
        </div>
      </section>
    </main>
  );
}