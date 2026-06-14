export type Scope = "materials" | "colors" | "forms";

export type MaterialRecord = {
  name: string;
  priceMultiplier: number;
  description: string;
  imageUrl: string;
  parent?: string;
};

export type ColorRecord = {
  name: string;
  hex: string;
  imageUrl: string;
};

export type ProductColorOption = {
  id: string;
  priceAdjust: number;
  imageUrl: string;
};

export type ProductSubOption = {
  id: string;
  name: string;
  materialKey: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  colors: ProductColorOption[];
};

export type ProductFormRecord = {
  name: string;
  shortName: string;
  icon: string;
  basePrice: number;
  description: string;
  imageUrl: string;
  homeImageUrl: string;
  subOptions: ProductSubOption[];
};

export type CatalogData = {
  materials: Record<string, MaterialRecord>;
  colors: Record<string, ColorRecord>;
  forms: Record<string, ProductFormRecord>;
  usage: {
    materials: Record<string, number>;
    colors: Record<string, number>;
    forms: Record<string, { subOptions: number; colors: number }>;
  };
};

export type Draft = {
  id: string;
  originalId: string;
  name: string;
  imageUrl: string;
  priceMultiplier: string;
  description: string;
  parent: string;
  hex: string;
};

export type FormDraft = ProductFormRecord & {
  id: string;
  originalId: string;
};
