import { PLACEHOLDER_IMAGE_URL } from "@/lib/constants";
import colors from "@/data/colors.json";
import forms from "@/data/forms.json";
import materials from "@/data/materials.json";

type FormKey = keyof typeof forms;
type MaterialKey = keyof typeof materials;
type ColorKey = keyof typeof colors;

function hashCode(value: string): number {
  return value.split("").reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);
}

export function getLocalImageUrl(form: string, material: string, color: string): string {
  return `/images/products/${form}/${material}/${color}.jpg`;
}

function getDataImageUrl(form: string, material: string, color: string): string | null {
  const formImage = forms[form as FormKey]?.imageUrl;
  const materialImage = materials[material as MaterialKey]?.imageUrl;
  const colorImage = colors[color as ColorKey]?.imageUrl;

  return formImage || materialImage || colorImage || null;
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
