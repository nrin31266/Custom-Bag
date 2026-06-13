"use client";

import { useAtom } from "jotai";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { calculateBagPrice, cn, formatPrice } from "@/lib/utils";
import {
  getAllMaterials,
  getDefaultSelectionForForm,
  getProductEntries,
  getSubOptions,
} from "@/lib/productCatalog";
import {
  colorAtom,
  designDataAtom,
  EMPTY_DESIGN_DATA,
  formTypeAtom,
  giftBoxAtom,
  materialAtom,
} from "@/stores/customizationStore";

export default function Step1FormPage() {
  const navigation = useStepNavigation();
  const [formType, setFormType] = useAtom(formTypeAtom);
  const [material, setMaterial] = useAtom(materialAtom);
  const [color, setColor] = useAtom(colorAtom);
  const [, setDesignData] = useAtom(designDataAtom);
  const [, setGiftBox] = useAtom(giftBoxAtom);
  const freshHandled = useRef(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterMaterials, setFilterMaterials] = useState<Set<string>>(new Set());
  const allMaterials = getAllMaterials();

  useEffect(() => {
    if (freshHandled.current) return;
    freshHandled.current = true;
    const params = new URLSearchParams(window.location.search);
    if (params.get("fresh") !== "1") return;
    const defaults = getDefaultSelectionForForm("shoulder");
    const urlFilterMaterial = params.get("filterMaterial");
    if (urlFilterMaterial) setFilterMaterials(new Set(urlFilterMaterial.split(",")));
    setFormType("shoulder");
    setMaterial(defaults.material);
    setColor(defaults.color);
    setGiftBox(false);
    setDesignData(EMPTY_DESIGN_DATA);
    window.history.replaceState(null, "", "/step1-form");
  }, [setColor, setDesignData, setFormType, setGiftBox, setMaterial]);

  const selectForm = (key: string) => {
    const defaults = getDefaultSelectionForForm(key);
    setFormType(key);
    setMaterial(defaults.material);
    setColor(defaults.color);
    setDesignData(EMPTY_DESIGN_DATA);
  };

  const toggleFilterMaterial = (key: string) => {
    setFilterMaterials((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  };
  const clearFilters = () => setFilterMaterials(new Set());
  const hasActiveFilters = filterMaterials.size > 0;

  const filteredEntries = useMemo(() => {
    const entries = getProductEntries();
    if (!hasActiveFilters) return entries;
    return entries.filter(([formKey]) => {
      const matKeys = getSubOptions(formKey).map((s) => s.materialKey);
      return matKeys.some((mk) => filterMaterials.has(mk));
    });
  }, [hasActiveFilters, filterMaterials]);

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">Chọn dáng túi bạn thích</h1>
          <p className="mt-3 text-[#4a392f]">Mỗi dáng là một cá tính khác nhau — chọn cái hợp gu bạn nhất nhé</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <button type="button" onClick={() => setFilterOpen((v) => !v)} className="mb-4 flex w-full items-center justify-between rounded-xl border border-[#e7ded6] bg-white px-4 py-3 text-sm font-semibold text-[#4a392f] lg:hidden">
              <span className="flex items-center gap-2"><SlidersHorizontal size={18} /> Bộ lọc {hasActiveFilters && <span className="rounded-full bg-[#432719] px-2 py-0.5 text-xs text-white">{filterMaterials.size}</span>}</span>
              {filterOpen ? <X size={18} /> : <ArrowRight size={18} className="rotate-90" />}
            </button>
            <div className={cn("rounded-2xl border border-[#e7ded6] bg-white p-5", !filterOpen && "hidden lg:block")}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-[#7d4f2d]"><SlidersHorizontal size={16} /> Chất liệu</h3>
                {hasActiveFilters && <button type="button" onClick={clearFilters} className="text-xs text-[#9a6b36] underline underline-offset-2">Xóa hết</button>}
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {allMaterials.map(([key, mat]) => (
                  <label key={key} className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition", filterMaterials.has(key) ? "bg-[#f7f1eb] text-[#432719]" : "text-[#4a392f] hover:bg-[#fbf8f5]")}>
                    <input type="checkbox" checked={filterMaterials.has(key)} onChange={() => toggleFilterMaterial(key)} className="size-4 rounded border-[#d8c9bc] accent-[#432719]" />
                    <div>
                      <div className="font-semibold">{mat.name}</div>
                      <div className="text-xs text-[#9a8a7d]">{mat.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            {filteredEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c6a43f] bg-[#fffdfb] p-12 text-center">
                <p className="text-lg font-semibold text-[#6d5b50]">Chưa có mẫu nào khớp với bộ lọc</p>
                <button type="button" onClick={clearFilters} className="mt-3 text-sm text-[#9a6b36] underline underline-offset-4">Xóa bộ lọc để xem hết nhé</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredEntries.map(([key, form]) => {
                  const defaults = getDefaultSelectionForForm(key);
                  const subOptions = getSubOptions(key);
                  return (
                    <button key={key} type="button" onClick={() => selectForm(key)} className={cn("rounded-lg border bg-[#fffdfb] p-3 text-center transition hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-xl", formType === key ? "scale-[1.02] border-[#432719] shadow-[0_14px_38px_rgba(67,39,25,0.18),0_0_0_3px_rgba(198,164,63,0.25)]" : "border-[#eadfd6]")}>
                      <ProductImage form={key} material={formType === key ? material : defaults.material} color={formType === key ? color : defaults.color} className="mb-3" priority={key === "shoulder"} />
                      <div className="font-serif text-xl">{form.name}</div>
                      <p className="mx-auto mt-2 min-h-10 max-w-xs text-sm text-[#6d5b50]">{form.description}</p>
                      <div className="mt-1 text-sm text-[#7a675b]">Từ {formatPrice(form.basePrice)}</div>
                      <div className="mt-2 text-xs font-semibold uppercase text-[#9a6b36]">{subOptions.length} phiên bản</div>
                      <div className="mt-2 rounded-full bg-[#f7f1eb] px-3 py-2 text-sm font-bold text-[#432719]">Giá mẫu đang xem: {formatPrice(calculateBagPrice(key, formType === key ? material : defaults.material, formType === key ? color : defaults.color))}</div>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mx-auto mt-8 flex max-w-xl justify-end">
                  <Button onClick={navigation.goNext} className="w-full">Chọn chất liệu <ArrowRight size={22} /></Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}