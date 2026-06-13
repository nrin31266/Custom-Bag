import { PLACEHOLDER_IMAGE_URL } from "@/lib/constants";
import {
  getColorOption,
  getMaterialData,
  getProduct,
  getSubOption,
  resolveColorData,
} from "@/lib/productCatalog";

function hashCode(value: string): number {
  return value.split("").reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);
}

export function getLocalImageUrl(form: string, material: string, color: string): string {
  return `/images/products/${form}/${material}/${color}.jpg`;
}

/**
 * Image fallback chain:
 *   1. Color product image (forms.json → subOption.colors[].imageUrl)
 *   2. SubOption image (forms.json → subOption.imageUrl)
 *   3. Material image (materials.json → material.imageUrl)
 *   4. Parent material image (materials.json → parent.imageUrl)
 *   5. Form image (forms.json → product.imageUrl)
 *   6. Color swatch image (colors.json → color.imageUrl) — last resort
 */
export function getDataImageUrl(form: string, materialKey: string, color: string): string | null {
  const product = getProduct(form);
  const subOption = getSubOption(form, materialKey);
  const colorOpt = getColorOption(form, materialKey, color);

  // 1. Color product image — đại diện cho màu của loại da đó
  if (colorOpt.imageUrl) return colorOpt.imageUrl;

  // 2. SubOption image — ảnh đại diện chất liệu con
  if (subOption.imageUrl) return subOption.imageUrl;

  // 3. Material image from materials.json
  const matData = getMaterialData(materialKey);
  if (matData?.imageUrl) return matData.imageUrl;

  // 4. Parent material image
  if (matData?.parent) {
    const parentData = getMaterialData(matData.parent);
    if (parentData?.imageUrl) return parentData.imageUrl;
  }

  // 5. Form image — ảnh form gốc ngoài cùng
  if (product.imageUrl) return product.imageUrl;

  // 6. Color swatch from colors.json
  const colorData = resolveColorData(colorOpt.id);
  if (colorData?.imageUrl) return colorData.imageUrl;

  return null;
}

export function getTempImageUrl(form: string, material: string, color: string): string {
  const seed = Math.abs(hashCode(`${form}-${material}-${color}`));
  const imageId = 10 + (seed % 90);
  return `https://picsum.photos/id/${imageId}/500/500`;
}

export function getProductImageUrl(form: string, material: string, color: string): string {
  return getLocalImageUrl(form, material, color);
}

export function getProductImageFallbacks(
  form: string,
  material: string,
  color: string,
): string[] {
  return [
    getDataImageUrl(form, material, color),
    getProductImageUrl(form, material, color),
    getTempImageUrl(form, material, color),
    PLACEHOLDER_IMAGE_URL,
  ].filter((src): src is string => Boolean(src));
}

/**
 * Get best preview image for a material selection (step 2 card)
 */
export function getMaterialPreviewImageUrl(form: string, materialKey: string): string | null {
  const product = getProduct(form);
  const subOption = getSubOption(form, materialKey);

  if (subOption.imageUrl) return subOption.imageUrl;

  const matData = getMaterialData(materialKey);
  if (matData?.imageUrl) return matData.imageUrl;

  if (matData?.parent) {
    const parentData = getMaterialData(matData.parent);
    if (parentData?.imageUrl) return parentData.imageUrl;
  }

  if (product.imageUrl) return product.imageUrl;
  return null;
}