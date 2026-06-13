"use client";

import { useMemo, useState } from "react";
import { getProductImageFallbacks } from "@/lib/imageUtils";

export function useProductImage(form: string, material: string, color: string) {
  const fallbacks = useMemo(
    () => getProductImageFallbacks(form, material, color),
    [form, material, color],
  );
  const fallbackKey = `${form}-${material}-${color}`;
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
