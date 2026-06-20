import { calculateBagPrice, calculateTotal, createLocalId, getPriceBreakdown } from "@/lib/utils";
import type { CartItem, DesignData } from "@/stores/customizationStore";

type CreateCartItemInput = {
  form: string;
  material: string;
  color: string;
  giftBox: string;
  designData: DesignData;
  /** Preserve this ID (e.g. when editing), otherwise auto-generate */
  id?: string;
};

export function createCartItem({
  form,
  material,
  color,
  giftBox,
  designData,
  id,
}: CreateCartItemInput): CartItem {
  const bagPrice = calculateBagPrice(form, material, color);
  const breakdown = getPriceBreakdown(form, material, color, giftBox, designData);

  return {
    id: id ?? createLocalId("cart"),
    form,
    material,
    color,
    giftBox,
    designData,
    bagPrice,
    materialDelta: breakdown.materialDelta,
    colorAdjust: breakdown.colorAdjust,
    total: calculateTotal(form, material, color, giftBox, designData),
    createdAt: new Date().toISOString(),
  };
}

export function getCartItemsTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.total, 0);
}

/** Strip heavy fields (canvasJSON, previewDataUrl) before localStorage serialization */
export function stripHeavyDesignData(item: CartItem): CartItem {
  return {
    ...item,
    designData: {
      ...item.designData,
      canvasJSON: null,
    },
  };
}
