"use client";

import type { ChangeEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { slugify } from "../_helpers";
import type { CatalogData, FormDraft, ProductColorOption, ProductSubOption } from "../_types";
import {
  ColorPreview,
  FileButton,
  MaterialPreview,
  PreviewPanel,
  ProductAssetPreview,
  TextInput,
} from "./SharedControls";

export function FormsEditor({
  data,
  draft,
  busy,
  status,
  selectedUsage,
  updateDraft,
  onNameChange,
  onDelete,
  onAddSub,
  onUpdateSub,
  onRemoveSub,
  onAddColor,
  onUpdateColor,
  onRemoveColor,
  onUpload,
}: {
  data: CatalogData | null;
  draft: FormDraft;
  busy: boolean;
  status: string;
  selectedUsage: string;
  updateDraft: (key: keyof FormDraft, value: string | number | ProductSubOption[]) => void;
  onNameChange: (value: string) => void;
  onDelete: () => void;
  onAddSub: () => void;
  onUpdateSub: (index: number, patch: Partial<ProductSubOption>) => void;
  onRemoveSub: (index: number) => void;
  onAddColor: (subIndex: number) => void;
  onUpdateColor: (subIndex: number, colorIndex: number, patch: Partial<ProductColorOption>) => void;
  onRemoveColor: (subIndex: number, colorIndex: number) => void;
  onUpload: (
    target: "form" | "sub" | "color",
    subId?: string,
    colorId?: string,
  ) => (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  return (
    <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="max-h-[calc(100vh-132px)] overflow-auto p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TextInput label="Mã form" value={draft.id} onChange={(value) => updateDraft("id", slugify(value))} />
          <TextInput label="Tên form" value={draft.name} onChange={onNameChange} />
          <TextInput label="Tên ngắn" value={draft.shortName} onChange={(value) => updateDraft("shortName", value)} />
          <TextInput label="Icon lucide" value={draft.icon} onChange={(value) => updateDraft("icon", value)} />
          <TextInput label="Base price" type="number" value={String(draft.basePrice)} onChange={(value) => updateDraft("basePrice", Number(value))} />
          <TextInput label="Ảnh form" value={draft.imageUrl} onChange={(value) => updateDraft("imageUrl", value)} />
          <label className="block">
            <span className="text-xs font-bold uppercase text-[#7a675b]">Upload ảnh form</span>
            <span className="mt-1 grid gap-2">
              <FileButton label="Form" disabled={busy || !draft.originalId} onChange={onUpload("form")} />
            </span>
          </label>
          <label className="block md:col-span-2 xl:col-span-4">
            <span className="text-xs font-bold uppercase text-[#7a675b]">Mô tả</span>
            <textarea
              value={draft.description}
              onChange={(event) => updateDraft("description", event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-[#d8c9bc] bg-white px-3 py-3 outline-none focus:border-[#432719]"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#eadfd6] pt-5">
          <Button type="submit" disabled={busy}>
            <Save size={18} />
            Lưu form
          </Button>
          <Button type="button" variant="secondary" onClick={onAddSub} disabled={busy}>
            <Plus size={18} />
            Thêm chất liệu con
          </Button>
          <Button type="button" variant="secondary" onClick={onDelete} disabled={busy || !draft.originalId}>
            <Trash2 size={18} />
            Xóa form
          </Button>
          <p className="text-sm text-[#6d5b50]">
            Sub/màu: <strong>{selectedUsage}</strong>
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {draft.subOptions.map((sub, subIndex) => {
            const selectedMaterial = data?.materials[sub.materialKey];
            return (
              <div key={`${sub.id}-${subIndex}`} className="border border-[#dacdc0] bg-white p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-serif text-xl font-bold">{sub.name || sub.id || `Sub ${subIndex + 1}`}</h3>
                  <div className="flex items-center gap-2">
                    <FileButton label="Upload sub" disabled={busy || !draft.originalId} onChange={onUpload("sub", sub.id)} />
                    <button
                      type="button"
                      onClick={() => onRemoveSub(subIndex)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b85042] px-3 text-sm font-bold text-[#8d2f24]"
                    >
                      <Trash2 size={16} />
                      Xóa sub
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <TextInput label="Sub id" value={sub.id} onChange={(value) => onUpdateSub(subIndex, { id: slugify(value) })} />
                  <TextInput label="Tên sub" value={sub.name} onChange={(value) => onUpdateSub(subIndex, { name: value })} />
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-[#7a675b]">Material key</span>
                    <select
                      value={sub.materialKey}
                      onChange={(event) => onUpdateSub(subIndex, { materialKey: event.target.value })}
                      className="mt-1 min-h-12 w-full rounded-md border border-[#d8c9bc] bg-white px-3 outline-none focus:border-[#432719]"
                    >
                      {data &&
                        Object.entries(data.materials).map(([id, item]) => (
                          <option key={id} value={id}>
                            {item.name} ({id})
                          </option>
                        ))}
                    </select>
                    <MaterialPreview id={sub.materialKey} material={selectedMaterial} />
                  </label>
                  <TextInput label="Base price" type="number" value={String(sub.basePrice)} onChange={(value) => onUpdateSub(subIndex, { basePrice: Number(value) })} />
                  <TextInput label="Ảnh sub" value={sub.imageUrl} onChange={(value) => onUpdateSub(subIndex, { imageUrl: value })} />
                  <ProductAssetPreview label="Preview ảnh sub" src={sub.imageUrl} alt={sub.name || sub.id} />
                  <TextInput label="Mô tả sub" value={sub.description} onChange={(value) => onUpdateSub(subIndex, { description: value })} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase text-[#7a675b]">Màu trong sub</p>
                  <button
                    type="button"
                    onClick={() => onAddColor(subIndex)}
                    className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[#432719]/50 px-3 text-sm font-bold text-[#432719]"
                  >
                    <Plus size={16} />
                    Thêm màu
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {sub.colors.map((color, colorIndex) => {
                    const selectedColor = data?.colors[color.id];
                    return (
                      <div key={`${color.id}-${colorIndex}`} className="grid gap-2 rounded-md bg-[#f7f1eb] p-3 md:grid-cols-[minmax(0,1.2fr)_120px_minmax(0,1.2fr)_minmax(0,1.3fr)_auto_auto]">
                        <label className="block">
                          <span className="text-xs font-bold uppercase text-[#7a675b]">Color id</span>
                          <select
                            value={color.id}
                            onChange={(event) => onUpdateColor(subIndex, colorIndex, { id: event.target.value })}
                            className="mt-1 min-h-10 w-full rounded-md border border-[#d8c9bc] bg-white px-2 outline-none focus:border-[#432719]"
                          >
                            {data &&
                              Object.entries(data.colors).map(([id, item]) => (
                                <option key={id} value={id}>
                                  {item.name} ({id})
                                </option>
                              ))}
                          </select>
                          <ColorPreview id={color.id} color={selectedColor} imageUrl={selectedColor?.imageUrl ?? ""} />
                        </label>
                        <TextInput label="Adjust" type="number" value={String(color.priceAdjust)} onChange={(value) => onUpdateColor(subIndex, colorIndex, { priceAdjust: Number(value) })} compact />
                        <TextInput label="Ảnh màu" value={color.imageUrl} onChange={(value) => onUpdateColor(subIndex, colorIndex, { imageUrl: value })} compact />
                        <ProductAssetPreview label="Preview sản phẩm" src={color.imageUrl} alt={`${sub.name || sub.id} ${color.id}`} />
                        <FileButton label="Upload" disabled={busy || !draft.originalId} onChange={onUpload("color", sub.id, color.id)} />
                        <button
                          type="button"
                          onClick={() => onRemoveColor(subIndex, colorIndex)}
                          className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b85042] px-3 text-[#8d2f24]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PreviewPanel
        imageSrc={draft.imageUrl}
        alt={draft.name || "Form preview"}
        jsonPath="src/data/forms.json"
        imageFolder={`public/images/forms/${draft.id || "<form-id>"}`}
        status={status}
      />
    </div>
  );
}
