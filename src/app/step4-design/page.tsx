"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import {
  cartItemsAtom,
  colorAtom,
  designDataAtom,
  editingCartItemIdAtom,
  EMPTY_DESIGN_DATA,
  formTypeAtom,
  giftBoxAtom,
  materialAtom,
} from "@/stores/customizationStore";

function Step4DesignInner() {
  const navigation = useStepNavigation();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isFresh = searchParams.get("fresh") === "1";

  const [, setEditingId] = useAtom(editingCartItemIdAtom);
  const setForm = useSetAtom(formTypeAtom);
  const setMaterial = useSetAtom(materialAtom);
  const setColor = useSetAtom(colorAtom);
  const setGiftBox = useSetAtom(giftBoxAtom);
  const setDesignData = useSetAtom(designDataAtom);
  const cartItems = useAtomValue(cartItemsAtom);

  // Handle ?fresh=1: reset to clean slate for new custom
  useEffect(() => {
    if (isFresh) {
      setEditingId(null);
      setForm("");
      setMaterial("");
      setColor("");
      setGiftBox("none");
      setDesignData(EMPTY_DESIGN_DATA);
    }
  }, [isFresh, setEditingId, setForm, setMaterial, setColor, setGiftBox, setDesignData]);

  // Handle ?edit=ID: load item from cart (keep in cart, step6 will replace)
  useEffect(() => {
    if (editId) {
      const item = cartItems.find((i) => i.id === editId);
      if (item) {
        setEditingId(editId);
        setForm(item.form);
        setMaterial(item.material);
        setColor(item.color);
        setGiftBox(item.giftBox);
        setDesignData(item.designData);
        // Keep item in cart — step6 will update it with createCartItem(id: editingId)
      }
    } else {
      // No edit param — clear any stale editingId from a previous session
      setEditingId(null);
    }
  }, [editId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="custom-flow-screen mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <CanvasEditor />
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
    </section>
  );
}

export default function Step4DesignPage() {
  const navigation = useStepNavigation();

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <Suspense fallback={
        <section className="custom-flow-screen mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
          <div className="flex h-[calc(100vh-130px)] items-center justify-center">
            <div className="animate-pulse text-lg text-[#7d4f2d]">Đang tải trình thiết kế...</div>
          </div>
        </section>
      }>
        <Step4DesignInner />
      </Suspense>
    </main>
  );
}