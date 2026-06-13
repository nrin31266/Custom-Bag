import colors from "@/data/colors.json";
import forms from "@/data/forms.json";
import materials from "@/data/materials.json";
import prices from "@/data/prices.json";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  DesignData,
  DesignPricing,
  DesignText,
} from "@/stores/customizationStore";

type FormKey = keyof typeof forms;
type MaterialKey = keyof typeof materials;
type ColorKey = keyof typeof colors;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return `${Math.round(price).toLocaleString("vi-VN")}đ`;
};

export const calculateTotal = (
  form: string,
  material: string,
  color: string,
  hasGiftBox: boolean,
  designData?: DesignData,
): number => {
  const formItem = forms[form as FormKey] ?? forms.shoulder;
  const materialItem = materials[material as MaterialKey] ?? materials["da-pebble"];
  const colorItem = colors[color as ColorKey] ?? colors["trang-be"];
  const giftBoxFee = hasGiftBox ? prices.giftBoxFee : 0;

  return (
    formItem.basePrice * materialItem.priceMultiplier +
    colorItem.priceAdjust +
    calculateCustomizationFee(designData).total +
    giftBoxFee +
    prices.shippingFee
  );
};

export const calculateBagPrice = (
  form: string,
  material: string,
  color: string,
): number => {
  const formItem = forms[form as FormKey] ?? forms.shoulder;
  const materialItem = materials[material as MaterialKey] ?? materials["da-pebble"];
  const colorItem = colors[color as ColorKey] ?? colors["trang-be"];

  return formItem.basePrice * materialItem.priceMultiplier + colorItem.priceAdjust;
};

export const getPriceBreakdown = (
  form: string,
  material: string,
  color: string,
  hasGiftBox: boolean,
  designData?: DesignData,
) => {
  const formItem = forms[form as FormKey] ?? forms.shoulder;
  const materialItem = materials[material as MaterialKey] ?? materials["da-pebble"];
  const colorItem = colors[color as ColorKey] ?? colors["trang-be"];
  const materialAdjustedPrice = formItem.basePrice * materialItem.priceMultiplier;
  const materialDelta = materialAdjustedPrice - formItem.basePrice;
  const bagPrice = materialAdjustedPrice + colorItem.priceAdjust;
  const giftBoxFee = hasGiftBox ? prices.giftBoxFee : 0;
  const customizationFee = calculateCustomizationFee(designData);

  return {
    basePrice: formItem.basePrice,
    materialDelta,
    colorAdjust: colorItem.priceAdjust,
    bagPrice,
    customizationFee,
    giftBoxFee,
    shippingFee: prices.shippingFee,
    total: bagPrice + customizationFee.total + giftBoxFee + prices.shippingFee,
  };
};

export const countEmbroideryCharacters = (value: string): number => {
  return value.replace(/\s/g, "").length;
};

export const calculateCustomizationFee = (
  designData?: Pick<DesignData, "texts" | "icons"> | {
    texts?: DesignText[];
    icons?: string[];
  },
): DesignPricing => {
  const texts = designData?.texts ?? [];
  const icons = designData?.icons ?? [];
  const characterCount = texts.reduce(
    (sum, item) => sum + countEmbroideryCharacters(item.text),
    0,
  );
  const textFee =
    texts.length * prices.embroideryTextBase +
    characterCount * prices.embroideryCharacterFee;
  const iconFee = icons.length * prices.embroideryIconBase;

  return {
    textCount: texts.length,
    iconCount: icons.length,
    characterCount,
    textFee,
    iconFee,
    total: textFee + iconFee,
  };
};

export const createLocalId = (prefix = "local"): string => {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix}-${random}`;
};

export const getDisplayName = (
  type: "form" | "material" | "color",
  key: string,
): string => {
  if (type === "form") return forms[key as FormKey]?.name ?? key;
  if (type === "material") return materials[key as MaterialKey]?.name ?? key;
  return colors[key as ColorKey]?.name ?? key;
};
