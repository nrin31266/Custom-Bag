"use client";

import Image from "next/image";
import type { ChangeEvent, ReactNode } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColorRecord, MaterialRecord } from "../_types";

export function ScopeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-bold uppercase",
        active
          ? "border-[#432719] bg-[#432719] text-white"
          : "border-[#cdbfaf] bg-white text-[#432719]",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  step,
  compact,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  compact?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-[#7a675b]">{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1 w-full rounded-md border border-[#d8c9bc] bg-white px-3 outline-none focus:border-[#432719]",
          compact ? "min-h-10 text-sm" : "min-h-12",
        )}
      />
    </label>
  );
}

export function UploadInput({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-[#7a675b]">{label}</span>
      <span className="mt-1 flex min-h-12 items-center gap-3 rounded-md border border-dashed border-[#bfae9f] bg-white px-3">
        <ImagePlus size={18} className="text-[#7d4f2d]" />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onChange}
          className="w-full text-sm"
        />
      </span>
      {file && <span className="mt-1 block truncate text-xs text-[#7a675b]">Sẽ upload: {file.name}</span>}
    </label>
  );
}

export function FileButton({
  label,
  disabled,
  onChange,
}: {
  label: string;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
}) {
  return (
    <label
      className={cn(
        "relative inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-dashed border-[#bfae9f] bg-white px-3 text-sm font-bold text-[#432719]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <ImagePlus size={16} />
      {label}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={disabled}
      />
    </label>
  );
}

export function MaterialPreview({ id, material }: { id: string; material?: MaterialRecord }) {
  return (
    <div className="mt-2 grid grid-cols-[42px_1fr] items-center gap-2 rounded-md border border-[#eadfd6] bg-[#fffdfb] p-2">
      <MiniImage src={material?.imageUrl ?? ""} alt={material?.name ?? id} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{material?.name ?? "Không tìm thấy chất liệu"}</div>
        <div className="truncate text-xs text-[#7a675b]">
          {id || "no-id"}
          {material ? ` · ${material.name}` : ""}
        </div>
      </div>
    </div>
  );
}

export function ColorPreview({
  id,
  color,
  imageUrl,
}: {
  id: string;
  color?: ColorRecord;
  imageUrl: string;
}) {
  return (
    <div className="mt-2 grid grid-cols-[42px_1fr] items-center gap-2 rounded-md border border-[#eadfd6] bg-white p-2">
      <MiniImage src={imageUrl} alt={color?.name ?? id} fallbackColor={color?.hex} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{color?.name ?? "Không tìm thấy màu"}</div>
        <div className="truncate text-xs text-[#7a675b]">
          {id || "no-id"}
          {color ? ` · ${color.hex}` : ""}
        </div>
      </div>
    </div>
  );
}

export function MiniImage({
  src,
  alt,
  fallbackColor,
}: {
  src: string;
  alt: string;
  fallbackColor?: string;
}) {
  return (
    <span
      className="relative block size-10 overflow-hidden rounded-md border border-[#d8c9bc] bg-[#eee9e3]"
      style={{ backgroundColor: fallbackColor }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized={src.startsWith("https://")}
        />
      )}
    </span>
  );
}

export function ProductAssetPreview({
  label,
  src,
  alt,
}: {
  label: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="block">
      <span className="text-xs font-bold uppercase text-[#7a675b]">{label}</span>
      <div className="mt-1 grid min-h-16 grid-cols-[64px_1fr] items-center gap-3 rounded-md border border-[#eadfd6] bg-[#fffdfb] p-2">
        <span className="relative block size-14 overflow-hidden rounded-md border border-[#d8c9bc] bg-[#eee9e3]">
          {src ? (
            <Image
              key={src}
              src={src}
              alt={alt}
              fill
              sizes="56px"
              className="object-cover"
              unoptimized={src.startsWith("https://")}
            />
          ) : (
            <span className="grid h-full place-items-center text-[10px] font-semibold uppercase text-[#7a675b]">
              No img
            </span>
          )}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#432719]">Ảnh sản phẩm</div>
          <div className="truncate text-xs text-[#7a675b]">{src || "Chưa có ảnh"}</div>
        </div>
      </div>
    </div>
  );
}

export function PreviewPanel({
  imageSrc,
  alt,
  fallbackColor,
  jsonPath,
  imageFolder,
  status,
}: {
  imageSrc: string;
  alt: string;
  fallbackColor?: string;
  jsonPath: string;
  imageFolder: string;
  status: string;
}) {
  return (
    <aside className="border-t border-[#eadfd6] p-5 xl:border-l xl:border-t-0">
      <div className="relative aspect-square overflow-hidden rounded-md border border-[#d8c9bc] bg-[#eee9e3]">
        {imageSrc ? (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={alt}
            fill
            sizes="360px"
            className="object-cover"
            unoptimized={imageSrc.startsWith("https://")}
          />
        ) : (
          <div
            className="grid h-full place-items-center text-sm font-semibold text-[#7a675b]"
            style={{ backgroundColor: fallbackColor }}
          >
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="mt-4 rounded-md border border-[#eadfd6] bg-white p-4 text-sm text-[#4a392f]">
        <div className="flex justify-between gap-4">
          <span>File JSON</span>
          <strong>{jsonPath}</strong>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <span>Thư mục ảnh</span>
          <strong>{imageFolder}</strong>
        </div>
        <p className="mt-3 text-[#7a675b]">{status}</p>
      </div>
    </aside>
  );
}
