import colors from "@/data/colors.json";
import forms from "@/data/forms.json";
import materials from "@/data/materials.json";

export type FormKey = keyof typeof forms;
export type MaterialKey = keyof typeof materials;
export type ColorKey = keyof typeof colors;

/** Full color data from colors.json */
export type ColorData = (typeof colors)[ColorKey];

/** Material data from materials.json */
export type MaterialData = (typeof materials)[MaterialKey] & { parent?: string };

/** Product in forms.json */
export type ProductItem = {
  name: string;
  shortName: string;
  icon: string;
  basePrice: number;
  description: string;
  imageUrl: string;
  homeImageUrl: string;
  subOptions: ProductSubOption[];
};

/** A sub-variant (material variant) */
export type ProductSubOption = {
  id: string;
  name: string;
  materialKey: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  colors: ProductColorOption[];
};

/** A color option inside a subOption — references color ID + its own product image */
export type ProductColorOption = {
  id: string;
  priceAdjust: number;
  imageUrl: string;
};

// ---------- Helpers ----------

export function getProduct(form: string): ProductItem {
  const data = forms[form as FormKey];
  if (!data) return forms.shoulder as ProductItem;
  return data as ProductItem;
}

export function getProductEntries(): Array<[FormKey, ProductItem]> {
  return Object.entries(forms).map(([k, v]) => [k as FormKey, v as ProductItem]);
}

export function getSubOptions(form: string): ProductSubOption[] {
  return (getProduct(form).subOptions ?? []) as ProductSubOption[];
}

export function getDefaultSubOption(form: string): ProductSubOption {
  const subs = getSubOptions(form);
  return subs[0] ?? (forms.shoulder as ProductItem).subOptions[0] as ProductSubOption;
}

export function getSubOption(form: string, material: string): ProductSubOption {
  const options = getSubOptions(form);
  return (
    options.find((o) => o.id === material) ??
    options.find((o) => o.materialKey === material) ??
    getDefaultSubOption(form)
  );
}

// Color helpers
export function getColorOptions(form: string, material: string): ProductColorOption[] {
  return getSubOption(form, material).colors ?? [];
}

export function getDefaultColorOption(form: string, material: string): ProductColorOption {
  return getColorOptions(form, material)[0] ?? { id: "black", priceAdjust: 0, imageUrl: "" };
}

export function getColorOption(form: string, material: string, color: string): ProductColorOption {
  const opts = getColorOptions(form, material);
  return opts.find((o) => o.id === color) ?? getDefaultColorOption(form, material);
}

/** Resolve color name/hex from colors.json */
export function resolveColorData(id: string): ColorData | undefined {
  return colors[id as ColorKey];
}

/** Get display name for a color by ID */
export function getColorName(id: string): string {
  return resolveColorData(id)?.name ?? id;
}

/** Get hex for a color by ID */
export function getColorHex(id: string): string {
  return resolveColorData(id)?.hex ?? "#888";
}

export function getDefaultSelectionForForm(form: string) {
  const sub = getDefaultSubOption(form);
  const col = getDefaultColorOption(form, sub.id);
  return { material: sub.id, color: col.id };
}

// Validation
export function isSubOptionValidForForm(form: string, material: string): boolean {
  return getSubOptions(form).some((o) => o.id === material);
}

export function isColorValidForSelection(form: string, material: string, color: string): boolean {
  return getColorOptions(form, material).some((o) => o.id === color);
}

// Material helpers
export function getMaterialTextureKey(form: string, material: string): string {
  return getSubOption(form, material).materialKey;
}

export function getMaterialLabel(key: string): string {
  return materials[key as MaterialKey]?.name ?? key;
}

export function getMaterialDescription(key: string): string {
  return materials[key as MaterialKey]?.description ?? "";
}

export function getMaterialParent(key: string): string | null {
  return (materials[key as MaterialKey] as MaterialData)?.parent ?? null;
}

export function getMaterialData(key: string): MaterialData | undefined {
  return materials[key as MaterialKey] as MaterialData | undefined;
}

export function getAllMaterials(): Array<[MaterialKey, MaterialData]> {
  return Object.entries(materials).map(([k, v]) => [k as MaterialKey, v as MaterialData]);
}

export function getAllColors(): Array<[ColorKey, ColorData]> {
  return Object.entries(colors) as Array<[ColorKey, ColorData]>;
}

// Global lookup across all forms
export function findSubOptionById(material: string): ProductSubOption | null {
  for (const product of Object.values(forms)) {
    const item = product as ProductItem;
    const match = item.subOptions.find((o) => o.id === material);
    if (match) return match;
  }
  return null;
}

export function findColorOptionById(color: string): ProductColorOption | null {
  for (const product of Object.values(forms)) {
    const item = product as ProductItem;
    for (const sub of item.subOptions) {
      const match = sub.colors.find((c) => c.id === color);
      if (match) return match;
    }
  }
  return null;
}