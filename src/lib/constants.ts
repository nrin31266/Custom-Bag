export const ROUTES = {
  STEP1: "/step1-form",
  STEP2: "/step2-material",
  STEP3: "/step3-color",
  STEP4: "/step4-design",
  STEP5: "/step5-preview",
  STEP6: "/step6-giftbox",
  STEP7: "/step7-checkout",
} as const;

export const STEP_ORDER = [
  "form",
  "material",
  "color",
  "design",
  "preview",
  "giftbox",
  "checkout",
] as const;

export const STEP_LABELS = {
  form: "Form túi",
  material: "Chất liệu",
  color: "Màu sắc",
  design: "Thiết kế & trang trí",
  preview: "Xem thành phẩm",
  giftbox: "Box quà",
  checkout: "Thanh toán",
} as const;

export const STEP_ROUTES = [
  ROUTES.STEP1,
  ROUTES.STEP2,
  ROUTES.STEP3,
  ROUTES.STEP4,
  ROUTES.STEP5,
  ROUTES.STEP6,
  ROUTES.STEP7,
] as const;

export const PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CANVAS_DEFAULT_CONFIG = {
  width: 900,
  height: 600,
  backgroundColor: "#e8e5e1",
  defaultText: {
    fontFamily: "Arial",
    fontSize: 30,
    fill: "#5b3b1f",
    stroke: "#5b3b1f",
    strokeWidth: 1,
    fontStyle: "italic",
    shadow: "rgba(0,0,0,0.2) 2px 2px 3px",
  },
} as const;

export const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";
