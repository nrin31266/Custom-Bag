import { atomWithStorage } from "jotai/utils";

export type DesignText = {
  text: string;
  font: string;
  fontLabel?: string;
  color: string;
  position: { x: number; y: number };
};

export type DesignPricing = {
  textCount: number;
  iconCount: number;
  characterCount: number;
  textFee: number;
  iconFee: number;
  total: number;
};

export type DesignData = {
  texts: DesignText[];
  icons: string[];
  pricing: DesignPricing;
  canvasJSON: unknown;
  previewDataUrl: string | null;
  updatedAt: string | null;
};

export type CustomerInfo = {
  fullName: string;
  address: string;
  province: string;
  provinceCode: string;
  district?: string;
  ward: string;
  wardCode: string;
  phone: string;
  email: string;
  note: string;
};

export type CartItem = {
  id: string;
  form: string;
  material: string;
  color: string;
  giftBox: string;
  designData: DesignData;
  bagPrice: number;
  materialDelta: number;
  colorAdjust: number;
  total: number;
  createdAt: string;
};

export type PurchasedOrder = {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  paymentMethod: string;
  total: number;
  status: "pending" | "saved";
  createdAt: string;
};

export type CanceledOrder = Omit<PurchasedOrder, "status"> & {
  status: "canceled";
  canceledAt: string;
  cancelReason: string;
};

export type LastOrder = {
  id: string;
  total: number;
  status: "pending" | "saved";
  createdAt: string;
} | null;

export const EMPTY_DESIGN_DATA: DesignData = {
  texts: [],
  icons: [],
  pricing: {
    textCount: 0,
    iconCount: 0,
    characterCount: 0,
    textFee: 0,
    iconFee: 0,
    total: 0,
  },
  canvasJSON: null,
  previewDataUrl: null,
  updatedAt: null,
};

export const formTypeAtom = atomWithStorage("lenth_form", "");
export const materialAtom = atomWithStorage("lenth_material", "");
export const colorAtom = atomWithStorage("lenth_color", "");
export const designDataAtom = atomWithStorage<DesignData>(
  "lenth_design",
  EMPTY_DESIGN_DATA,
);
export const giftBoxAtom = atomWithStorage("lenth_giftbox", "none");
export const shippingProvinceCodeAtom = atomWithStorage("lenth_shipping_province", "");
export const shippingFeeAtom = atomWithStorage("lenth_shipping_fee", 0);
export const customerInfoAtom = atomWithStorage<CustomerInfo>("lenth_customer", {
  fullName: "",
  address: "",
  province: "",
  provinceCode: "",
  district: "",
  ward: "",
  wardCode: "",
  phone: "",
  email: "",
  note: "",
});
export const paymentMethodAtom = atomWithStorage("lenth_payment", "cod");
export const lastOrderAtom = atomWithStorage<LastOrder>("lenth_last_order", null);
export const cartItemsAtom = atomWithStorage<CartItem[]>("lenth_cart_items", []);
export const purchasedOrdersAtom = atomWithStorage<PurchasedOrder[]>(
  "lenth_purchased_orders",
  [],
);
export const canceledOrdersAtom = atomWithStorage<CanceledOrder[]>(
  "lenth_canceled_orders",
  [],
);

/** ID of the cart item currently being edited, or null for fresh custom */
export const editingCartItemIdAtom = atomWithStorage<string | null>(
  "lenth_editing_cart_item",
  null,
);
