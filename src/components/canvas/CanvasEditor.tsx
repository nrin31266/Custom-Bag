"use client";

import {
  Download,
  Image as ImageIcon,
  Palette,
  Save,
  Trash2,
  Type,
} from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CANVAS_DEFAULT_CONFIG } from "@/lib/constants";
import { getDataImageUrl, getTempImageUrl } from "@/lib/imageUtils";
import {
  calculateCustomizationFee,
  cn,
  formatPrice,
} from "@/lib/utils";
import {
  colorAtom,
  designDataAtom,
  formTypeAtom,
  materialAtom,
} from "@/stores/customizationStore";

const iconOptions = [
  { src: "/icons/gau.svg", label: "Gấu" },
  { src: "/icons/ho.svg", label: "Hổ" },
  { src: "/icons/koala.svg", label: "Koala" },
  { src: "/icons/bow.svg", label: "Nơ" },
  { src: "/icons/heart.svg", label: "Tim" },
  { src: "/icons/star.svg", label: "Sao" },
  { src: "/icons/sparkle.svg", label: "Lấp lánh" },
  { src: "/icons/flower.svg", label: "Hoa" },
  { src: "/icons/crown.svg", label: "Vương miện" },
  { src: "/icons/diamond.svg", label: "Kim cương" },
  { src: "/icons/moon.svg", label: "Trăng" },
  { src: "/icons/cupcake.svg", label: "Bánh" },
  { src: "/icons/cloud.svg", label: "Mây" },
  { src: "/icons/key.svg", label: "Chìa khóa" },
  { src: "/icons/smile.svg", label: "Vui" },
];

const MAX_TEXT_OBJECTS = 3;
const MAX_ICON_OBJECTS = 3;

const fontOptions = [
  { label: "Nét ký", cssVar: "--font-great-vibes", fallback: "\"Great Vibes\", cursive", preview: "Lenth Custom" },
  { label: "Mềm bay", cssVar: "--font-dancing-script", fallback: "\"Dancing Script\", cursive", preview: "For my daily dream" },
  { label: "Ngọt ngào", cssVar: "--font-pacifico", fallback: "\"Pacifico\", cursive", preview: "Lovely little bag" },
  { label: "Cá tính", cssVar: "--font-lobster", fallback: "\"Lobster\", cursive", preview: "Van Rin style" },
  { label: "Thiệp tay", cssVar: "--font-sacramento", fallback: "\"Sacramento\", cursive", preview: "Especially for you" },
  { label: "Couture", cssVar: "--font-playfair-display", fallback: "\"Playfair Display\", serif", preview: "LENTH Atelier" },
  { label: "Cổ điển", cssVar: "--font-cormorant-garamond", fallback: "\"Cormorant Garamond\", serif", preview: "Monogram signature" },
  { label: "Hoàng gia", cssVar: "--font-cinzel", fallback: "\"Cinzel\", serif", preview: "LUXE INITIALS" },
];

const threadColors = [
  "#ffffff", // Trắng
  "#1a1a1a", // Đen
  "#c9a96e", // Gold
  "#c0c0c0", // Bạc
  "#5b3b1f", // Nâu đen
  "#cc3333", // Đỏ
  "#2d6a4f", // Xanh lá
  "#1e6091", // Xanh dương
  "#8b2f45", // Đỏ rượu
  "#f4a261", // Cam đất
  "#7b5ea7", // Tím
  "#f5e6ca", // Kem
  "#e85d75", // Hồng
  "#264653", // Xanh đêm
];

function resolveFontFamily(option: (typeof fontOptions)[number]): string {
  if (typeof window === "undefined") return option.fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(option.cssVar).trim();
  return value || option.fallback;
}

function getFontOptionByLabel(label: string | undefined) {
  return fontOptions.find((o) => o.label === label) ?? fontOptions[0];
}

function getFontOptionByFamily(family: string | undefined) {
  if (!family) return fontOptions[0];
  return fontOptions.find((o) => family.toLowerCase().includes(o.label.toLowerCase())) ?? fontOptions[0];
}

export function CanvasEditor() {
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const [designData, setDesignData] = useAtom(designDataAtom);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<import("fabric").Canvas | null>(null);
  const fabricRef = useRef<typeof import("fabric") | null>(null);
  const initialCanvasJSONRef = useRef(designData.canvasJSON);
  const [text, setText] = useState("Lenth");
  const [selectedFontLabel, setSelectedFontLabel] = useState(fontOptions[0].label);
  const [threadColor, setThreadColor] = useState(threadColors[1]);
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].src);
  const [selectedObjectType, setSelectedObjectType] = useState<"text" | "icon" | null>(null);
  const [objectCounts, setObjectCounts] = useState({ texts: 0, icons: 0 });
  const [status, setStatus] = useState("Sẵn sàng thiết kế");

  const getCanvasCounts = useCallback(() => {
    const objs = canvasRef.current?.getObjects() ?? [];
    return { texts: objs.filter((o) => o.type === "textbox").length, icons: objs.filter((o) => o.type === "image").length };
  }, []);

  const syncObjectCounts = useCallback(() => { setObjectCounts(getCanvasCounts()); }, [getCanvasCounts]);

  const syncSelectedObject = useCallback(() => {
    const active = canvasRef.current?.getActiveObject();
    if (!active) { setSelectedObjectType(null); return; }
    if (active.type === "textbox") {
      const tb = active as import("fabric").Textbox & { data?: { fontLabel?: string } };
      const fl = String(tb.data?.fontLabel ?? "");
      const fo = fl ? getFontOptionByLabel(fl) : getFontOptionByFamily(String(tb.fontFamily ?? ""));
      setSelectedObjectType("text"); setText(tb.text ?? ""); setSelectedFontLabel(fo.label); setThreadColor(String(tb.fill ?? threadColors[1]));
    } else if (active.type === "image") {
      setSelectedObjectType("icon");
    } else { setSelectedObjectType(null); }
  }, []);

  const ensureFontLoaded = async (family: string) => {
    if (typeof document === "undefined" || !("fonts" in document)) return;
    try { await document.fonts.load(`32px ${family}`); } catch { /* fallback */ }
  };

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const objs = canvas.getObjects();
    let pdu: string | null = null;
    try { pdu = canvas.toDataURL({ format: "png", multiplier: 1 }); } catch { pdu = null; }
    const texts = objs.filter((o) => o.type === "textbox").map((o) => {
      const tb = o as import("fabric").Textbox & { data?: { fontLabel?: string } };
      return { text: tb.text ?? "", font: String(tb.fontFamily ?? "Arial"), fontLabel: String(tb.data?.fontLabel ?? getFontOptionByFamily(String(tb.fontFamily ?? "")).label), color: String(tb.fill ?? "#333"), position: { x: tb.left ?? 0, y: tb.top ?? 0 } };
    });
    const icons = objs.filter((o) => o.type === "image").map((o) => (o as import("fabric").FabricImage).getSrc());
    setDesignData({ texts, icons, pricing: calculateCustomizationFee({ texts, icons }), canvasJSON: canvas.toJSON(), previewDataUrl: pdu, updatedAt: new Date().toISOString() });
    setObjectCounts({ texts: texts.length, icons: icons.length });
    setStatus(pdu ? "Đã lưu thiết kế và ảnh xem trước" : "Đã lưu thiết kế");
  }, [setDesignData]);

  useEffect(() => {
    let disposed = false;
    async function setup() {
      if (!canvasElRef.current) return;
      const fabric = await import("fabric");
      if (disposed || !canvasElRef.current) return;
      fabricRef.current = fabric;
      const canvas = new fabric.Canvas(canvasElRef.current, {
        width: CANVAS_DEFAULT_CONFIG.width, height: CANVAS_DEFAULT_CONFIG.height,
        backgroundColor: CANVAS_DEFAULT_CONFIG.backgroundColor, preserveObjectStacking: true, selection: true,
      });
      canvasRef.current = canvas;
      const bg = getDataImageUrl(form, material, color) ?? getTempImageUrl(form, material, color);
      try {
        const img = await fabric.FabricImage.fromURL(bg, { crossOrigin: "anonymous" });
        const s = Math.min(CANVAS_DEFAULT_CONFIG.width / (img.width || 500), CANVAS_DEFAULT_CONFIG.height / (img.height || 500));
        img.set({ left: CANVAS_DEFAULT_CONFIG.width / 2, top: CANVAS_DEFAULT_CONFIG.height / 2, originX: "center", originY: "center", selectable: false, evented: false, scaleX: s * 0.96, scaleY: s * 0.96 });
        canvas.backgroundImage = img; canvas.requestRenderAll();
      } catch { setStatus("Không tải được ảnh nền"); }
      if (initialCanvasJSONRef.current) { try { await canvas.loadFromJSON(initialCanvasJSONRef.current); canvas.requestRenderAll(); } catch { setStatus("Dữ liệu cũ không hợp lệ"); } }
      canvas.on("object:modified", saveCanvas);
      canvas.on("object:added", () => { syncObjectCounts(); saveCanvas(); });
      canvas.on("object:removed", () => { syncObjectCounts(); saveCanvas(); });
      canvas.on("selection:created", syncSelectedObject);
      canvas.on("selection:updated", syncSelectedObject);
      canvas.on("selection:cleared", () => setSelectedObjectType(null));
      syncObjectCounts();
    }
    setup();
    return () => { disposed = true; canvasRef.current?.dispose(); canvasRef.current = null; };
  }, [color, form, material, saveCanvas, syncObjectCounts, syncSelectedObject]);

  const applyStyle = async (next?: { fontFamily?: string; threadColor?: string; text?: string }) => {
    const f = fabricRef.current; const active = canvasRef.current?.getActiveObject();
    if (!f || !active) { setStatus("Chọn chữ hoặc icon trên ảnh"); return; }
    const nf = next?.fontFamily ?? resolveFontFamily(getFontOptionByLabel(selectedFontLabel));
    const nc = next?.threadColor ?? threadColor; const nt = next?.text ?? text;
    await ensureFontLoaded(nf);
    if (active.type === "textbox") {
      active.set({ text: nt.trim() || "Lenth", fill: nc, stroke: nc, fontFamily: nf, data: { fontLabel: selectedFontLabel }, shadow: new f.Shadow("rgba(0,0,0,0.2) 2px 2px 3px") });
      canvasRef.current?.requestRenderAll(); saveCanvas(); setStatus("Đã cập nhật chữ");
    } else if (active.type === "image") {
      const img = active as import("fabric").FabricImage & { filters: unknown[]; applyFilters: () => void };
      img.filters = [new f.filters.BlendColor({ color: nc, mode: "tint", alpha: 0.72 })];
      img.applyFilters(); canvasRef.current?.requestRenderAll(); saveCanvas(); setStatus("Đã đổi màu icon");
    }
  };

  const addText = async () => {
    const f = fabricRef.current; const c = canvasRef.current; if (!f || !c) return;
    if (getCanvasCounts().texts >= MAX_TEXT_OBJECTS) { setStatus("Tối đa 3 cụm chữ"); return; }
    const { shadow, ...cfg } = CANVAS_DEFAULT_CONFIG.defaultText;
    const fo = getFontOptionByLabel(selectedFontLabel); const ff = resolveFontFamily(fo);
    await ensureFontLoaded(ff);
    const tb = new f.Textbox(text.trim() || "Lenth", { ...cfg, fill: threadColor, stroke: threadColor, fontFamily: ff, data: { fontLabel: fo.label }, left: 280, top: 300, width: 180, textAlign: "center", lockUniScaling: true, shadow: new f.Shadow(shadow) });
    c.add(tb); c.setActiveObject(tb); c.requestRenderAll(); syncSelectedObject();
  };

  const addIcon = async (src = selectedIcon) => {
    const f = fabricRef.current; const c = canvasRef.current; if (!f || !c) return;
    if (getCanvasCounts().icons >= MAX_ICON_OBJECTS) { setStatus("Tối đa 3 icon"); return; }
    try { setSelectedIcon(src); const icon = await f.FabricImage.fromURL(src); icon.set({ left: 430, top: 275, scaleX: 0.24, scaleY: 0.24, lockUniScaling: true }); c.add(icon); c.setActiveObject(icon); c.requestRenderAll(); syncSelectedObject(); } catch { setStatus("Không tải được icon"); }
  };

  const removeSelected = () => {
    const c = canvasRef.current; const a = c?.getActiveObject(); if (!c || !a) return;
    c.remove(a); c.discardActiveObject(); c.requestRenderAll(); setSelectedObjectType(null);
  };

  const downloadData = (content: string, name: string, type: string) => {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
  };

  const downloadPng = () => { saveCanvas(); const c = canvasRef.current; if (!c) return; try { downloadData(c.toDataURL({ format: "png", multiplier: 2 }), "lenth-custom-bag.png", "image/png"); } catch { setStatus("Không xuất được PNG"); } };

  return (
    <section className="flex h-[calc(100vh-130px)] gap-4">
      {/* Left: Canvas */}
      <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-[#432719] bg-[#e8e5e1] p-3 shadow-lg">
        <div className="overflow-hidden rounded-md bg-[#ddd9d4] shadow-inner">
          <canvas ref={canvasElRef} className="max-h-full max-w-full" style={{ maxHeight: "calc(100vh - 180px)" }} />
        </div>
      </div>

      {/* Right: Tools panel */}
      <div className="flex w-[420px] shrink-0 flex-col gap-3 overflow-y-auto rounded-xl border-2 border-[#432719] bg-[#e8e5e1] p-4 shadow-lg">
        <h2 className="text-center text-lg font-bold uppercase text-[#7d4f2d]">Công cụ thiết kế</h2>

        {/* Text input */}
        <input value={text} onChange={(e) => { setText(e.target.value); if (canvasRef.current?.getActiveObject()?.type === "textbox") applyStyle({ text: e.target.value }); }} placeholder="Nhập chữ muốn thêu" className="h-11 w-full rounded-lg border border-[#d8c9bc] bg-white px-3 text-center text-sm outline-none focus:border-[#c6a43f]" />

        {/* Font selection */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase text-[#7d4f2d]">Kiểu chữ</div>
          <div className="grid grid-cols-2 gap-1.5">
            {fontOptions.map((font) => (
              <button key={font.label} type="button" onClick={() => { setSelectedFontLabel(font.label); const family = resolveFontFamily(font); if (canvasRef.current?.getActiveObject()?.type === "textbox") applyStyle({ fontFamily: family }); }}
                className={cn("rounded-md border border-[#d8c9bc] bg-white px-2 py-2 text-left text-xs transition", selectedFontLabel === font.label && "border-[#432719] bg-[#432719] text-white")}>
                <span className="block font-semibold">{font.label}</span>
                <span className="mt-0.5 block truncate text-sm" style={{ fontFamily: `var(${font.cssVar}), ${font.fallback}` }}>{font.preview}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Thread color */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase text-[#7d4f2d]">Màu chỉ</div>
          <div className="flex flex-wrap gap-2">
            {threadColors.map((c) => (
              <button key={c} type="button" onClick={() => { setThreadColor(c); if (canvasRef.current?.getActiveObject()) applyStyle({ threadColor: c }); }}
                className={cn("size-9 rounded-full border border-[#d8c9bc] transition hover:scale-110", threadColor === c && "ring-3 ring-[#c6a43f] ring-offset-2")} style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Icons */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase text-[#7d4f2d]">Icon thêu</div>
          <div className="grid max-h-44 grid-cols-5 gap-1.5 overflow-y-auto">
            {iconOptions.map((icon) => (
              <button key={icon.src} type="button" onClick={() => addIcon(icon.src)}
                className={cn("rounded-lg border border-[#d8c9bc] bg-white p-1.5 text-center transition hover:border-[#c6a43f]", selectedIcon === icon.src && "border-[#432719] ring-2 ring-[#432719]")}>
                <span className="mx-auto block size-10 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${icon.src})` }} />
                <span className="mt-0.5 block text-[10px] text-[#5c473a]">{icon.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={addText} className="rounded-full normal-case text-xs h-9 px-3"><Type size={14} /> Thêm chữ</Button>
          <Button onClick={() => applyStyle()} variant="secondary" className="rounded-full normal-case text-xs h-9 px-3">Cập nhật</Button>
          <Button onClick={removeSelected} variant="secondary" className="rounded-full normal-case text-xs h-9 px-3"><Trash2 size={14} /> Xóa</Button>
        </div>

        {/* Status */}
        <div className="rounded-lg border border-[#d8c9bc] bg-white/80 p-2 text-xs text-[#5c473a]">
          <div className="flex items-center gap-1 font-bold text-[#7d4f2d]"><Palette size={14} />{selectedObjectType === "text" ? "Chữ" : selectedObjectType === "icon" ? "Icon" : "Chưa chọn"}</div>
          <p className="mt-1">Chữ: {objectCounts.texts}/{MAX_TEXT_OBJECTS} | Icon: {objectCounts.icons}/{MAX_ICON_OBJECTS} | Phí: {formatPrice(calculateCustomizationFee({ texts: designData.texts, icons: designData.icons }).total)}</p>
        </div>

        {/* Save & download */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={saveCanvas} className="rounded-full text-xs h-9 px-4"><Save size={14} /> Lưu</Button>
          <Button onClick={downloadPng} variant="secondary" className="rounded-full text-xs h-9 px-4"><Download size={14} /> PNG</Button>
        </div>

        <p className="text-center text-xs text-[#9b6f5f]">{status}</p>
      </div>
    </section>
  );
}