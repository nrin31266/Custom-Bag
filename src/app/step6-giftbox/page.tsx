"use client";

import Image from "next/image";
import { useAtom, useAtomValue } from "jotai";
import { ArrowLeft, ArrowRight, Check, Gift, ShoppingBag } from "lucide-react";
import prices from "@/data/prices.json";
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

const options = [
  {
    value: false,
    title: "Không thêm box quà",
    description: "Tiết kiệm chi phí",
    badge: "Miễn phí",
    image: "https://picsum.photos/id/42/700/420",
  },
  {
    value: true,
    title: "Thêm box quà",
    description: "Hộp quà cao cấp, túi vải và thiệp",
    badge: `+${formatPrice(prices.giftBoxFee)}`,
    image: "https://picsum.photos/id/48/700/420",
  },
];

export default function Step6GiftBoxPage() {
  const navigation = useStepNavigation();
  const [giftBox, setGiftBox] = useAtom(giftBoxAtom);
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const designData = useAtomValue(designDataAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const totalWithCurrentBox = calculateTotal(
    form,
    material,
    color,
    giftBox,
    designData,
  );
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
      <section className="custom-flow-screen mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Thêm box quà
          </h1>
          <p className="mt-3 text-[#4a392f]">
            Chọn hộp quà để món quà của bạn thêm trọn vẹn và ý nghĩa
          </p>
        </div>

        <div>
          <div className="grid gap-6 xl:grid-cols-2">
              {options.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => setGiftBox(option.value)}
                  className={cn(
                    "overflow-hidden rounded-xl border bg-[#fffdfb] text-left transition duration-300 hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-xl",
                    giftBox === option.value
                      ? "scale-[1.01] border-[#432719] shadow-[0_16px_40px_rgba(67,39,25,0.2),0_0_0_4px_rgba(198,164,63,0.25)]"
                      : "border-[#eadfd6]",
                  )}
                >
                  <div className="relative h-64 bg-[#eee9e3]">
                    <Image
                      src={option.image}
                      alt={option.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 560px"
                      className="object-cover"
                      unoptimized
                    />
                    <span
                      className={cn(
                        "absolute left-5 top-5 grid size-8 place-items-center rounded-full border border-[#d8c9bc] bg-[#fffdfb]",
                        giftBox === option.value &&
                          "border-[#432719] bg-[#432719] text-white",
                      )}
                    >
                      {giftBox === option.value && <Check size={18} />}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-4 p-5">
                    <div>
                      <h2 className="text-xl font-bold">{option.title}</h2>
                      <p className="mt-2 text-[#4a392f]">{option.description}</p>
                      <p className="mt-3 text-sm font-semibold text-[#7d4f2d]">
                        Tổng nếu chọn:{" "}
                        {formatPrice(
                          calculateTotal(
                            form,
                            material,
                            color,
                            option.value,
                            designData,
                          ),
                        )}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f4eee8] px-4 py-2 font-semibold">
                      {option.badge}
                    </span>
                  </div>
                </button>
              ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="flex gap-4 rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 text-[#4a392f]">
              <Gift className="mt-1 shrink-0" />
              <p>
                <strong>Box quà bao gồm:</strong> hộp cứng, túi vải Lenth và thiệp.
                Nếu chọn box, đơn cộng thêm {formatPrice(prices.giftBoxFee)}.
              </p>
            </div>
            <div className="rounded-lg border border-[#c6a43f]/50 bg-[#fffdfb] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold uppercase text-[#9a6b36]">Tổng</span>
                <span className="font-serif text-2xl font-bold">
                  {formatPrice(totalWithCurrentBox)}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#5c473a]">
                {giftBox ? "Có box quà." : "Không thêm box quà."}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Button variant="secondary" onClick={navigation.goBack}>
              <ArrowLeft size={22} />
              Quay lại
            </Button>
            <Button
              variant={currentInCart ? "secondary" : "primary"}
              onClick={addToCart}
              disabled={currentInCart}
            >
              {currentInCart ? <Check size={22} /> : <ShoppingBag size={22} />}
              {currentInCart ? "Đã thêm giỏ" : "Thêm vào giỏ"}
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
