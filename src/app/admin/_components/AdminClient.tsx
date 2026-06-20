"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Home, ImageIcon, Loader2, Package, Palette, Plus, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  draftFromRecord,
  emptyDraft,
  emptyFormDraft,
  formDraftFromRecord,
  getImageUrl,
  getInitialDraft,
  getInitialFormDraft,
  getUsageLabel,
  slugify,
} from "../_helpers";
import type {
  CatalogData,
  ColorRecord,
  Draft,
  FormDraft,
  MaterialRecord,
  ProductColorOption,
  ProductFormRecord,
  ProductSubOption,
  Scope,
} from "../_types";
import { FormsEditor } from "./FormsEditor";
import { IconsEditor } from "./IconsEditor";
import { ScopeButton } from "./SharedControls";
import { SimpleEditor } from "./SimpleEditor";

export function AdminClient() {
  const router = useRouter();
  const rawParams = useSearchParams();
  const urlScope = (rawParams.get("tab") ?? "") as Scope;
  const initialScope: Scope = ["materials", "colors", "forms", "icons"].includes(urlScope) ? urlScope : "materials";
  const [scope, setScope] = useState<Scope>(initialScope);
  const [data, setData] = useState<CatalogData | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [formDraft, setFormDraft] = useState<FormDraft>(emptyFormDraft);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Đang tải dữ liệu...");
  const [busy, setBusy] = useState(true);
  const [icons, setIcons] = useState<Array<{ src: string; label: string }>>([]);

  const entries = useMemo(() => {
    if (!data || scope === "icons") return [];
    const catalogScope = scope as "materials" | "colors" | "forms";
    const needle = query.trim().toLowerCase();
    return Object.entries(data[catalogScope]).filter(([id, record]) => {
      if (!needle) return true;
      return `${id} ${record.name}`.toLowerCase().includes(needle);
    });
  }, [data, query, scope]);

  const filteredIcons = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return icons;
    return icons.filter((icon) => icon.label.toLowerCase().includes(needle));
  }, [icons, query]);

  const activeId = scope === "forms" ? formDraft.originalId || formDraft.id : scope === "icons" ? "" : draft.originalId || draft.id;
  const selectedUsage = scope === "icons" ? "" : getUsageLabel(scope as "materials" | "colors" | "forms", activeId, data);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/catalog", { cache: "no-store" })
      .then(async (response) => {
        const nextData = (await response.json()) as CatalogData | { error?: string };
        if (!response.ok) {
          throw new Error("error" in nextData ? nextData.error : "Không tải được dữ liệu.");
        }
        return nextData as CatalogData;
      })
      .then((nextData) => {
        if (!mounted) return;
        setData(nextData);
        setDraft(getInitialDraft("materials", nextData));
        setFormDraft(getInitialFormDraft(nextData));
        setStatus("Sẵn sàng chỉnh sửa.");
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setStatus(error instanceof Error ? error.message : "Không tải được dữ liệu.");
      })
      .finally(() => {
        if (!mounted) return;
        setBusy(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch icons on initial load if scope is icons
  useEffect(() => {
    if (initialScope === "icons") {
      fetchIcons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIcons = async () => {
    try {
      const response = await fetch("/api/admin/icons", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json() as { icons: Array<{ src: string; label: string }> };
        setIcons(data.icons);
      }
    } catch { /* ignore */ }
  };

  const switchScope = (nextScope: Scope) => {
    setScope(nextScope);
    router.replace(`/admin?tab=${nextScope}`, { scroll: false });
    setQuery("");
    setFile(null);
    setStatus("Sẵn sàng chỉnh sửa.");
    if (nextScope === "icons") {
      fetchIcons();
    } else if (nextScope === "forms") {
      setFormDraft(getInitialFormDraft(data));
    } else {
      setDraft(getInitialDraft(nextScope === "materials" || nextScope === "colors" ? nextScope : "materials", data));
    }
  };

  const selectItem = (id: string, record: MaterialRecord | ColorRecord | ProductFormRecord) => {
    if (scope === "forms") {
      setFormDraft(formDraftFromRecord(id, record as ProductFormRecord));
    } else {
      setDraft(draftFromRecord(scope, id, record as MaterialRecord | ColorRecord));
    }
    setFile(null);
    setStatus(`Đang sửa ${id}.`);
  };

  const startNew = () => {
    if (scope === "forms") {
      setFormDraft(emptyFormDraft);
      setStatus("Tạo form mới.");
    } else {
      setDraft(emptyDraft);
      setStatus(scope === "materials" ? "Tạo chất liệu mới." : "Tạo màu mới.");
    }
    setFile(null);
  };

  const updateDraft = (key: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateFormDraft = (key: keyof FormDraft, value: string | number | ProductSubOption[]) => {
    setFormDraft((current) => ({ ...current, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    setDraft((current) => ({
      ...current,
      name: value,
      id: current.originalId ? current.id : slugify(value),
    }));
  };

  const handleFormNameChange = (value: string) => {
    setFormDraft((current) => ({
      ...current,
      name: value,
      id: current.originalId ? current.id : slugify(value),
      shortName: current.shortName || value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleFormFileChange =
    (target: "form" | "sub" | "color", subId = "", colorId = "") =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0];
      event.target.value = "";
      if (!selected) return;
      await uploadFormImage(target, selected, subId, colorId);
    };

  const saveDraft = async (event: FormEvent) => {
    event.preventDefault();
    if (scope === "forms") {
      await saveFormDraft();
      return;
    }

    const id = slugify(draft.id);
    if (!id) {
      setStatus("Mã không được trống.");
      return;
    }

    const entry =
      scope === "materials"
        ? {
            name: draft.name.trim(),
            description: draft.description.trim(),
            imageUrl: draft.imageUrl.trim(),
          }
        : {
            name: draft.name.trim(),
            hex: draft.hex.trim(),
            imageUrl: draft.imageUrl.trim(),
          };

    setBusy(true);
    try {
      let response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          scope,
          id,
          originalId: draft.originalId || id,
          entry,
        }),
      });
      let nextData = (await response.json()) as CatalogData | { error?: string };
      if (!response.ok) throw new Error("error" in nextData ? nextData.error : "Không lưu được dữ liệu.");

      if (file) {
        const uploadData = new FormData();
        uploadData.set("scope", scope);
        uploadData.set("id", id);
        uploadData.set("file", file);
        response = await fetch("/api/admin/catalog", {
          method: "POST",
          body: uploadData,
        });
        nextData = (await response.json()) as CatalogData | { error?: string };
        if (!response.ok) throw new Error("error" in nextData ? nextData.error : "Không upload được ảnh.");
      }

      setData(nextData as CatalogData);
      const saved = (nextData as CatalogData)[scope as "materials" | "colors" | "forms"][id] as MaterialRecord | ColorRecord;
      setDraft(draftFromRecord(scope, id, saved));
      setFile(null);
      setStatus(`Đã lưu ${id}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không lưu được dữ liệu.");
    } finally {
      setBusy(false);
    }
  };

  const saveFormDraft = async () => {
    setBusy(true);
    try {
      const { id, nextData } = await persistFormDraft(formDraft);
      setData(nextData);
      setFormDraft(formDraftFromRecord(id, nextData.forms[id]));
      setStatus(`Đã lưu form ${id}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không lưu được form.");
    } finally {
      setBusy(false);
    }
  };

  const buildFormEntry = (currentDraft: FormDraft): ProductFormRecord => ({
    name: currentDraft.name.trim(),
    shortName: currentDraft.shortName.trim(),
    icon: currentDraft.icon.trim() || "ShoppingBag",
    basePrice: Number(currentDraft.basePrice),
    description: currentDraft.description.trim(),
    imageUrl: currentDraft.imageUrl.trim(),
    subOptions: currentDraft.subOptions.map((sub) => ({
      ...sub,
      id: slugify(sub.id),
      basePrice: Number(sub.basePrice),
      imageUrl: sub.imageUrl.trim(),
      colors: sub.colors.map((color) => ({
        id: slugify(color.id),
        priceAdjust: Number(color.priceAdjust),
        imageUrl: color.imageUrl.trim(),
      })),
    })),
  });

  const persistFormDraft = async (currentDraft: FormDraft) => {
    const id = slugify(currentDraft.id);
    if (!id) throw new Error("Mã form không được trống.");

    const response = await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "upsert",
        scope: "forms",
        id,
        originalId: currentDraft.originalId || id,
        entry: buildFormEntry(currentDraft),
      }),
    });
    const nextData = (await response.json()) as CatalogData | { error?: string };
    if (!response.ok) throw new Error("error" in nextData ? nextData.error : "Không lưu được form.");
    return { id, nextData: nextData as CatalogData };
  };

  const uploadFormImage = async (
    target: "form" | "sub" | "color",
    selectedFile: File,
    subId = "",
    colorId = "",
  ) => {
    if (!formDraft.originalId) {
      setStatus("Lưu form trước rồi mới upload ảnh.");
      return;
    }

    setBusy(true);
    try {
      const { id } = await persistFormDraft(formDraft);
      const uploadData = new FormData();
      uploadData.set("scope", "forms");
      uploadData.set("id", id);
      uploadData.set("target", target);
      uploadData.set("subId", slugify(subId));
      uploadData.set("colorId", slugify(colorId));
      uploadData.set("file", selectedFile);
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        body: uploadData,
      });
      const nextData = (await response.json()) as CatalogData | { error?: string };
      if (!response.ok) throw new Error("error" in nextData ? nextData.error : "Không upload được ảnh.");
      setData(nextData as CatalogData);
      setFormDraft(formDraftFromRecord(id, (nextData as CatalogData).forms[id]));
      setStatus(`Đã lưu form và upload ảnh ${getUploadTargetLabel(target)}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không upload được ảnh.");
    } finally {
      setBusy(false);
    }
  };

  const getUploadTargetLabel = (target: "form" | "sub" | "color") => {
    if (target === "sub") return "chất liệu con";
    if (target === "color") return "màu";
    return "form";
  };

  const deleteDraft = async () => {
    const id = scope === "forms" ? formDraft.originalId || formDraft.id : draft.originalId || draft.id;
    if (!id) return;
    if (!window.confirm(`Xóa ${id}? Một số item có thể không được xóa nếu đang được app dùng. Hãy kiểm tra thông báo lỗi.`)) return;

    setBusy(true);
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "delete", scope, id, originalId: id }),
      });
      const nextData = (await response.json()) as CatalogData | { error?: string };
      if (!response.ok) throw new Error("error" in nextData ? nextData.error : "Không xóa được dữ liệu.");
      setData(nextData as CatalogData);
      if (scope === "forms") {
        setFormDraft(getInitialFormDraft(nextData as CatalogData));
      } else if (scope !== "icons") {
        setDraft(getInitialDraft(scope, nextData as CatalogData));
      }
      setFile(null);
      setStatus(`Đã xóa ${id}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không xóa được dữ liệu.");
    } finally {
      setBusy(false);
    }
  };

  const handleIconUpload = async (label: string, file: File) => {
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set("action", "add");
      formData.set("label", label);
      formData.set("file", file);
      const response = await fetch("/api/admin/icons", { method: "POST", body: formData });
      const data = await response.json() as { icons: Array<{ src: string; label: string }>; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không upload được icon.");
      setIcons(data.icons);
      setStatus(`Đã thêm icon "${label}".`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không upload được icon.");
    } finally {
      setBusy(false);
    }
  };

  const handleIconDelete = async (src: string) => {
    if (!window.confirm(`Xóa icon ${src}?`)) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set("action", "delete");
      formData.set("src", src);
      const response = await fetch("/api/admin/icons", { method: "POST", body: formData });
      const data = await response.json() as { icons: Array<{ src: string; label: string }>; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không xóa được icon.");
      setIcons(data.icons);
      setStatus(`Đã xóa icon.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không xóa được icon.");
    } finally {
      setBusy(false);
    }
  };

  const addSubOption = () => {
    const materialId = Object.keys(data?.materials ?? {})[0] ?? "";
    const colorId = Object.keys(data?.colors ?? {})[0] ?? "";
    setFormDraft((current) => {
      const base = current.id || "form";
      const nextIndex = current.subOptions.length + 1;
      return {
        ...current,
        subOptions: [
          ...current.subOptions,
          {
            id: slugify(`${base}-sub-${nextIndex}`),
            name: `Chất liệu ${nextIndex}`,
            materialKey: materialId,
            description: "",
            basePrice: Number(current.basePrice) || 0,
            imageUrl: "",
            colors: colorId ? [{ id: colorId, priceAdjust: 0, imageUrl: "" }] : [],
          },
        ],
      };
    });
  };

  const updateSubOption = (index: number, patch: Partial<ProductSubOption>) => {
    setFormDraft((current) => ({
      ...current,
      subOptions: current.subOptions.map((sub, subIndex) =>
        subIndex === index ? { ...sub, ...patch } : sub,
      ),
    }));
  };

  const removeSubOption = (index: number) => {
    setFormDraft((current) => ({
      ...current,
      subOptions: current.subOptions.filter((_, subIndex) => subIndex !== index),
    }));
  };

  const addColorToSub = (subIndex: number) => {
    const allColorIds = Object.keys(data?.colors ?? {});
    setFormDraft((current) => ({
      ...current,
      subOptions: current.subOptions.map((sub, index) => {
        if (index !== subIndex) return sub;
        const nextColor = allColorIds.find((id) => !sub.colors.some((color) => color.id === id)) ?? allColorIds[0] ?? "";
        if (!nextColor) return sub;
        return {
          ...sub,
          colors: [...sub.colors, { id: nextColor, priceAdjust: 0, imageUrl: "" }],
        };
      }),
    }));
  };

  const updateSubColor = (subIndex: number, colorIndex: number, patch: Partial<ProductColorOption>) => {
    setFormDraft((current) => ({
      ...current,
      subOptions: current.subOptions.map((sub, index) => {
        if (index !== subIndex) return sub;
        return {
          ...sub,
          colors: sub.colors.map((color, currentColorIndex) =>
            currentColorIndex === colorIndex ? { ...color, ...patch } : color,
          ),
        };
      }),
    }));
  };

  const removeSubColor = (subIndex: number, colorIndex: number) => {
    setFormDraft((current) => ({
      ...current,
      subOptions: current.subOptions.map((sub, index) => {
        if (index !== subIndex) return sub;
        return {
          ...sub,
          colors: sub.colors.filter((_, currentColorIndex) => currentColorIndex !== colorIndex),
        };
      }),
    }));
  };

  const listTitle = scope === "icons" ? "Icons" : scope === "materials" ? "Chất liệu" : scope === "colors" ? "Màu sắc" : "Forms";
  const imageSrc = scope === "forms" ? formDraft.imageUrl : draft.imageUrl;

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#28180f]">
      <section className="flex min-h-screen flex-col px-6 py-5">
        <header className="mb-5 flex flex-col gap-4 border-b border-[#dacdc0] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-[#9a6b36]">Local admin</p>
            <h1 className="mt-1 font-serif text-3xl font-bold uppercase">Quản lý catalog</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
           
            <ScopeButton active={scope === "materials"} onClick={() => switchScope("materials")} icon={<Package size={18} />}>
              Chất liệu
            </ScopeButton>
            <ScopeButton active={scope === "colors"} onClick={() => switchScope("colors")} icon={<Palette size={18} />}>
              Màu sắc
            </ScopeButton>
            <ScopeButton active={scope === "forms"} onClick={() => switchScope("forms")} icon={<ShoppingBag size={18} />}>
              Forms
            </ScopeButton>
            <ScopeButton active={scope === "icons"} onClick={() => switchScope("icons")} icon={<ImageIcon size={18} />}>
              Icons
            </ScopeButton>
            {scope !== "icons" && (
              <Button variant="secondary" onClick={startNew}>
                <Plus size={18} />
                Tạo mới
              </Button>
            )}
          </div>
        </header>

        {scope === "icons" ? (
          <IconsEditor
            icons={filteredIcons}
            busy={busy}
            status={status}
            onUpload={handleIconUpload}
            onDelete={handleIconDelete}
          />
        ) : (
          <div className="grid flex-1 gap-5 lg:grid-cols-[390px_1fr]">
            <aside className="min-h-0 border border-[#dacdc0] bg-white">
              <div className="border-b border-[#eadfd6] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-xl font-bold">{listTitle}</h2>
                  {busy && <Loader2 className="animate-spin text-[#7d4f2d]" size={20} />}
                </div>
                <label className="mt-3 flex min-h-11 items-center gap-2 rounded-md border border-[#dacdc0] bg-[#fffdfb] px-3">
                  <Search size={18} className="text-[#8a786c]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm theo mã hoặc tên"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </label>
              </div>
              <div className="max-h-[calc(100vh-190px)] overflow-auto">
                {entries.map(([id, record]) => {
                  const active = activeId === id;
                  const imageUrl = getImageUrl(record);
                  const swatch = scope === "colors" ? (record as ColorRecord).hex : undefined;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectItem(id, record)}
                      className={cn(
                        "grid w-full grid-cols-[58px_1fr_auto] items-center gap-3 border-b border-[#f0e7df] px-4 py-3 text-left transition hover:bg-[#fbf8f5]",
                        active && "bg-[#f7f1eb]",
                      )}
                    >
                      <span
                        className="relative block size-14 overflow-hidden rounded-md border border-[#dacdc0] bg-[#f7f1eb]"
                        style={{ backgroundColor: swatch }}
                      >
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={record.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized={imageUrl.startsWith("https://")}
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{record.name}</span>
                        <span className="block truncate text-xs text-[#7a675b]">{id}</span>
                      </span>
                      <span className="rounded-full bg-[#efe6dd] px-2 py-1 text-xs font-bold text-[#7d4f2d]">
                        {getUsageLabel(scope, id, data)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <form onSubmit={saveDraft} className="min-h-0 border border-[#dacdc0] bg-[#fffdfb]">
              {scope === "forms" ? (
                <FormsEditor
                  data={data}
                  draft={formDraft}
                  busy={busy}
                  status={status}
                  selectedUsage={selectedUsage}
                  updateDraft={updateFormDraft}
                  onNameChange={handleFormNameChange}
                  onDelete={deleteDraft}
                  onAddSub={addSubOption}
                  onUpdateSub={updateSubOption}
                  onRemoveSub={removeSubOption}
                  onAddColor={addColorToSub}
                  onUpdateColor={updateSubColor}
                  onRemoveColor={removeSubColor}
                  onUpload={handleFormFileChange}
                />
              ) : (
                <SimpleEditor
                  scope={scope}
                  data={data}
                  draft={draft}
                  file={file}
                  busy={busy}
                  imageSrc={imageSrc}
                  status={status}
                  selectedUsage={selectedUsage}
                  updateDraft={updateDraft}
                  onNameChange={handleNameChange}
                  onFileChange={handleFileChange}
                  onDelete={deleteDraft}
                />
              )}
            </form>
          </div>
        )}
      </section>
    </main>
  );
}