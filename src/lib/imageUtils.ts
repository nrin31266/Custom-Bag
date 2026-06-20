import { PLACEHOLDER_IMAGE_URL } from "@/lib/constants";
import {
  getColorOption,
  getMaterialData,
  getProduct,
  getSubOption,
  resolveColorData,
} from "@/lib/productCatalog";

export function getLocalImageUrl(form: string, material: string, color: string): string {
  // Try per-material-color image first
  return `/images/products/${form}/${material}/${color}.jpg`;
}

/**
 * Image fallback chain (no random image — only real data URLs):
 *   1. Color product image (forms.json → subOption.colors[].imageUrl)
 *   2. SubOption image (forms.json → subOption.imageUrl)
 *   3. Form image (forms.json → product.imageUrl)
 *   4. Material image (materials.json → material.imageUrl)
 *   5. Parent material image (materials.json → parent.imageUrl)
 *   6. Color swatch image (colors.json → color.imageUrl)
 *
 * Returns null if no image is found anywhere in the chain.
 * Callers should fallback to PLACEHOLDER_IMAGE_URL ("No Image") on null.
 */
export function getDataImageUrl(form: string, materialKey: string, color: string): string | null {
  const product = getProduct(form);
  const subOption = getSubOption(form, materialKey);
  const colorOpt = getColorOption(form, materialKey, color);
  const matData = getMaterialData(subOption.materialKey) ?? getMaterialData(materialKey);

  // 1. Color product image — đại diện cho màu của loại da đó (cụ thể nhất)
  if (colorOpt.imageUrl) return colorOpt.imageUrl;

  // 2. SubOption image — ảnh đại diện chất liệu con (cụ thể hơn form)
  if (subOption.imageUrl) return subOption.imageUrl;

  // 3. Form image — ảnh đại diện form (cha cao nhất, fallback khi sub không có ảnh)
  if (product.imageUrl) return product.imageUrl;

  // 4. Material image from materials.json
  if (matData?.imageUrl) return matData.imageUrl;

  // 5. Parent material image
  if (matData?.parent) {
    const parentData = getMaterialData(matData.parent);
    if (parentData?.imageUrl) return parentData.imageUrl;
  }

  // 6. Color swatch from colors.json
  const colorData = resolveColorData(colorOpt.id);
  if (colorData?.imageUrl) return colorData.imageUrl;

  return null;
}

export function getProductImageUrl(form: string, material: string, color: string): string {
  return getLocalImageUrl(form, material, color);
}

/**
 * Build fallback list for <img> onError cycling.
 * Only real URLs are included — no random picsum.
 * Falls through to PLACEHOLDER_IMAGE_URL ("Không có ảnh đại diện sản phẩm").
 */
export function getProductImageFallbacks(
  form: string,
  material: string,
  color: string,
): string[] {
  return [
    getDataImageUrl(form, material, color),
    getProductImageUrl(form, material, color),
    PLACEHOLDER_IMAGE_URL,
  ].filter((src): src is string => Boolean(src));
}

/**
 * Build fallback list for material selection previews.
 * This deliberately skips color-level images so step 2 does not preview the
 * previous/default color as if it were the selected material image.
 *
 * Chain: subOption.imageUrl → material.imageUrl → parent material.imageUrl → form.imageUrl → PLACEHOLDER
 */
export function getMaterialImageFallbacks(form: string, material: string): string[] {
  return [
    getMaterialPreviewImageUrl(form, material),
    PLACEHOLDER_IMAGE_URL,
  ].filter((src): src is string => Boolean(src));
}

/**
 * Get fallback URLs for form card preview (step1, homepage).
 * Unlike getProductImageFallbacks which prioritizes subOption images,
 * this puts form.imageUrl first — suitable for form selection pages
 * where we want to show the form's representative image.
 *
 * Chain: form.imageUrl → first subOption.imageUrl → PLACEHOLDER
 */
export function getFormCardImageFallbacks(form: string): string[] {
  const product = getProduct(form);
  const subOptions = product.subOptions ?? [];
  const firstSubImage = subOptions[0]?.imageUrl ?? null;
  return [
    product.imageUrl,
    firstSubImage,
    PLACEHOLDER_IMAGE_URL,
  ].filter((src): src is string => Boolean(src));
}

export function getMaterialPreviewImageUrl(form: string, materialKey: string): string | null {
  const product = getProduct(form);
  const subOption = getSubOption(form, materialKey);

  if (subOption.imageUrl) return subOption.imageUrl;

  const matData = getMaterialData(subOption.materialKey) ?? getMaterialData(materialKey);
  if (matData?.imageUrl) return matData.imageUrl;

  if (matData?.parent) {
    const parentData = getMaterialData(matData.parent);
    if (parentData?.imageUrl) return parentData.imageUrl;
  }

  if (product.imageUrl) return product.imageUrl;
  return null;
}
