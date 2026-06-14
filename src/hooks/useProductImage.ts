"use client";

import { useMemo, useState } from "react";
import {
  getFormCardImageFallbacks,
  getMaterialImageFallbacks,
  getProductImageFallbacks,
} from "@/lib/imageUtils";

export type ProductImageMode = "detail" | "form" | "material";

export function useProductImage(
  form: string,
  material: string,
  color: string,
  mode: ProductImageMode = "detail",
) {
  const fallbacks = useMemo(() => {
    if (mode === "form") return getFormCardImageFallbacks(form);
    if (mode === "material") return getMaterialImageFallbacks(form, material);
    return getProductImageFallbacks(form, material, color);
  }, [form, material, color, mode]);
  const fallbackKey =
    mode === "form"
      ? `form-${form}`
      : mode === "material"
        ? `material-${form}-${material}`
        : `${form}-${material}-${color}`;
  const [fallbackState, setFallbackState] = useState({
    key: fallbackKey,
    index: 0,
  });
  const fallbackIndex =
    fallbackState.key === fallbackKey ? fallbackState.index : 0;

  const handleError = () => {
    setFallbackState((current) => ({
      key: fallbackKey,
      index: Math.min(
        current.key === fallbackKey ? current.index + 1 : 1,
        fallbacks.length - 1,
      ),
    }));
  };

  return {
    src: fallbacks[fallbackIndex] ?? fallbacks[fallbacks.length - 1],
    isPlaceholder: fallbackIndex === fallbacks.length - 1,
    handleError,
  };
}
