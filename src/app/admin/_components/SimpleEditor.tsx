"use client";

import type { ChangeEvent } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { slugify } from "../_helpers";
import type { CatalogData, Draft, Scope } from "../_types";
import { PreviewPanel, TextInput, UploadInput } from "./SharedControls";

type SimpleScope = Exclude<Scope, "forms">;

export function SimpleEditor({
  scope,
  data,
  draft,
  file,
  busy,
  imageSrc,
  status,
  selectedUsage,
  updateDraft,
  onNameChange,
  onFileChange,
  onDelete,
}: {
  scope: SimpleScope;
  data: CatalogData | null;
  draft: Draft;
  file: File | null;
  busy: boolean;
  imageSrc: string;
  status: string;
  selectedUsage: string;
  updateDraft: (key: keyof Draft, value: string) => void;
  onNameChange: (value: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Mã" value={draft.id} onChange={(value) => updateDraft("id", slugify(value))} />
          <TextInput label="Tên" value={draft.name} onChange={onNameChange} />
        </div>

        {scope === "materials" ? (
          <div className="mt-4">
            <label className="block">
              <span className="text-xs font-bold uppercase text-[#7a675b]">Mô tả</span>
              <textarea
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={5}
                className="mt-1 w-full rounded-md border border-[#d8c9bc] bg-white px-3 py-3 outline-none focus:border-[#432719]"
              />
            </label>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
            <label className="block">
              <span className="text-xs font-bold uppercase text-[#7a675b]">Mã màu</span>
              <input
                type="color"
                value={draft.hex}
                onChange={(event) => updateDraft("hex", event.target.value)}
                className="mt-1 h-12 w-full rounded-md border border-[#d8c9bc] bg-white p-1"
              />
            </label>
            <TextInput label="Hex" value={draft.hex} onChange={(value) => updateDraft("hex", value)} />
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextInput label="Đường dẫn ảnh" value={draft.imageUrl} onChange={(value) => updateDraft("imageUrl", value)} />
          <UploadInput label="Upload ảnh" file={file} onChange={onFileChange} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>
            <Save size={18} />
            Lưu
          </Button>
          <Button type="button" variant="secondary" onClick={onDelete} disabled={busy || !draft.originalId}>
            <Trash2 size={18} />
            Xóa
          </Button>
          <p className="text-sm text-[#6d5b50]">
            Đang được forms dùng: <strong>{selectedUsage}</strong>
          </p>
        </div>
      </div>

      <PreviewPanel
        imageSrc={imageSrc}
        alt={draft.name || "Preview"}
        fallbackColor={scope === "colors" ? draft.hex : undefined}
        jsonPath={scope === "materials" ? "src/data/materials.json" : "src/data/colors.json"}
        imageFolder={scope === "materials" ? "public/images/materials" : "public/images/colors"}
        status={status}
      />
    </div>
  );
}