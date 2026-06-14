"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImageMode } from "@/hooks/useProductImage";
import { useProductImage } from "@/hooks/useProductImage";
import { cn, getDisplayName } from "@/lib/utils";

type ProductImageProps = {
  form: string;
  material: string;
  color: string;
  className?: string;
  priority?: boolean;
  /** detail = ảnh theo màu, material = ảnh chất liệu/sub, form = ảnh đại diện form */
  mode?: ProductImageMode;
};

export function ProductImage({
  form,
  material,
  color,
  className,
  priority,
  mode = "detail",
}: ProductImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const { src, handleError } = useProductImage(form, material, color, mode);
  const isLoading = loadedSrc !== src;

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-md bg-[#eee9e3]",
        className,
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#eee9e3] via-[#faf7f4] to-[#e5dcd2]" />
      )}
      <Image
        key={src}
        src={src}
        alt={`${getDisplayName("form", form)} ${getDisplayName("material", material)} ${getDisplayName("color", color)}`}
        fill
        sizes="(max-width: 768px) 90vw, 500px"
        className={cn(
          "object-contain p-6 transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        priority={priority}
        unoptimized={src.startsWith("https://")}
        onLoad={() => setLoadedSrc(src)}
        onError={() => {
          setLoadedSrc(null);
          handleError();
        }}
      />
    </div>
  );
}
