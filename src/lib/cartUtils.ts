import { calculateBagPrice, calculateTotal, createLocalId } from "@/lib/utils";
import type { CartItem, DesignData } from "@/stores/customizationStore";

type CreateCartItemInput = {
  form: string;
  material: string;
  color: string;
  giftBox: boolean;
  designData: DesignData;
};

export function createCartItem({
  form,
  material,
  color,
  giftBox,
  designData,
}: CreateCartItemInput): CartItem {
  const bagPrice = calculateBagPrice(form, material, color);

  return {
    id: createLocalId("cart"),
    form,
    material,
    color,
    giftBox,
    designData,
    bagPrice,
    total: calculateTotal(form, material, color, giftBox, designData),
    createdAt: new Date().toISOString(),
  };
}

export function getCartItemsTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.total, 0);
}
