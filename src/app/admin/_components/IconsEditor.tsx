"use client";

import type { ChangeEvent } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

type IconEntry = { src: string; label: string };

export function IconsEditor({
  icons,
  busy,
  status,
  onUpload,
  onDelete,
}: {
  icons: IconEntry[];
  busy: boolean;
  status: string;
  onUpload: (label: string, file: File) => Promise<void>;
  onDelete: (src: string) => Promise<void>;
}) {
  const [label, setLabel] = useState("");
  const fileInputRef = useState<HTMLInputElement | null>(null)[1];

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !label.trim()) return;
    await onUpload(label.trim(), file);
    setLabel("");
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-[#e7ded6] bg-white p-5">
        <label className="block flex-1 min-w-[200px]">
          <span className="text-xs font-bold uppercase text-[#7a675b]">Tên icon</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ví dụ: Ngôi sao"
            className="mt-1 h-11 w-full rounded-md border border-[#d8c9bc] bg-white px-3 outline-none focus:border-[#432719]"
          />
        </label>
        <label className="block min-w-[200px]">
          <span className="text-xs font-bold uppercase text-[#7a675b]">File icon (svg/png)</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              disabled={busy}
              className="w-full text-sm file:mr-3 file:rounded-md file:border file:border-[#d8c9bc] file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#432719] hover:file:bg-[#f7f1eb]"
            />
          </div>
        </label>
        <p className="self-end text-sm text-[#6d5b50] min-w-[120px]">
          {status}
        </p>
      </div>

      {icons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#c6a43f] bg-[#fffdfb] p-12 text-center">
          <p className="text-lg font-semibold text-[#6d5b50]">Chưa có icon nào</p>
          <p className="mt-2 text-sm text-[#9a8a7d]">Nhập tên và chọn file icon để tải lên</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {icons.map((icon) => (
            <div
              key={icon.src}
              className="group flex items-center gap-4 rounded-xl border border-[#e7ded6] bg-white p-4 transition hover:border-[#c6a43f] hover:shadow-md"
            >
              <span
                className="block size-12 shrink-0 bg-contain bg-center bg-no-repeat rounded-lg border border-[#f0e7df]"
                style={{ backgroundImage: `url(${icon.src})` }}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{icon.label}</span>
              <button
                type="button"
                onClick={() => onDelete(icon.src)}
                disabled={busy}
                className="shrink-0 rounded-lg p-2 text-[#8d2f24] opacity-0 transition group-hover:opacity-100 hover:bg-[#fce8e6]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
