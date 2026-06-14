import type {
  CatalogData,
  ColorRecord,
  Draft,
  FormDraft,
  MaterialRecord,
  ProductFormRecord,
  Scope,
} from "./_types";

export const emptyDraft: Draft = {
  id: "",
  originalId: "",
  name: "",
  imageUrl: "",
  priceMultiplier: "1",
  description: "",
  parent: "",
  hex: "#111111",
};

export const emptyFormDraft: FormDraft = {
  id: "",
  originalId: "",
  name: "",
  shortName: "",
  icon: "ShoppingBag",
  basePrice: 0,
  description: "",
  imageUrl: "",
  homeImageUrl: "",
  subOptions: [],
};

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function draftFromRecord(
  scope: Exclude<Scope, "forms">,
  id: string,
  record: MaterialRecord | ColorRecord,
): Draft {
  if (scope === "materials") {
    const material = record as MaterialRecord;
    return {
      id,
      originalId: id,
      name: material.name,
      imageUrl: material.imageUrl ?? "",
      priceMultiplier: String(material.priceMultiplier ?? 1),
      description: material.description ?? "",
      parent: material.parent ?? "",
      hex: "#111111",
    };
  }

  const color = record as ColorRecord;
  return {
    ...emptyDraft,
    id,
    originalId: id,
    name: color.name,
    imageUrl: color.imageUrl ?? "",
    hex: color.hex ?? "#111111",
  };
}

export function formDraftFromRecord(id: string, form: ProductFormRecord): FormDraft {
  return {
    id,
    originalId: id,
    name: form.name,
    shortName: form.shortName,
    icon: form.icon,
    basePrice: form.basePrice,
    description: form.description,
    imageUrl: form.imageUrl ?? "",
    homeImageUrl: form.homeImageUrl ?? "",
    subOptions: form.subOptions.map((sub) => ({
      ...sub,
      colors: sub.colors.map((color) => ({ ...color })),
    })),
  };
}

export function getInitialDraft(scope: Exclude<Scope, "forms">, data: CatalogData | null): Draft {
  const entries = data ? Object.entries(data[scope]) : [];
  const first = entries[0];
  return first ? draftFromRecord(scope, first[0], first[1]) : emptyDraft;
}

export function getInitialFormDraft(data: CatalogData | null): FormDraft {
  const first = data ? Object.entries(data.forms)[0] : null;
  return first ? formDraftFromRecord(first[0], first[1]) : emptyFormDraft;
}

export function getImageUrl(record: MaterialRecord | ColorRecord | ProductFormRecord) {
  return record.imageUrl ?? "";
}

export function getUsageLabel(scope: Scope, id: string, data: CatalogData | null) {
  if (!data) return "0";
  if (scope === "forms") {
    const usage = data.usage.forms[id];
    return usage ? `${usage.subOptions}/${usage.colors}` : "0/0";
  }
  return String(data.usage[scope][id] ?? 0);
}
