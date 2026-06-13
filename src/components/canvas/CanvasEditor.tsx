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
import { getTempImageUrl } from "@/lib/imageUtils";
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
  { src: "/icons/ribbon.svg", label: "Ruy băng" },
  { src: "/icons/moon.svg", label: "Trăng" },
  { src: "/icons/candy.svg", label: "Kẹo" },
  { src: "/icons/cupcake.svg", label: "Bánh" },
  { src: "/icons/cloud.svg", label: "Mây" },
  { src: "/icons/sun.svg", label: "Nắng" },
  { src: "/icons/key.svg", label: "Chìa khóa" },
  { src: "/icons/charm.svg", label: "Charm" },
  { src: "/icons/pearl.svg", label: "Ngọc" },
  { src: "/icons/leaf.svg", label: "Lá" },
  { src: "/icons/smile.svg", label: "Vui" },
];

const MAX_TEXT_OBJECTS = 3;
const MAX_ICON_OBJECTS = 3;

const fontOptions = [
  {
    label: "Nét ký",
    cssVar: "--font-great-vibes",
    fallback: "\"Great Vibes\", cursive",
    preview: "Lenth Custom",
  },
  {
    label: "Mềm bay",
    cssVar: "--font-dancing-script",
    fallback: "\"Dancing Script\", cursive",
    preview: "For my daily dream",
  },
  {
    label: "Ngọt ngào",
    cssVar: "--font-pacifico",
    fallback: "\"Pacifico\", cursive",
    preview: "Lovely little bag",
  },
  {
    label: "Cá tính",
    cssVar: "--font-lobster",
    fallback: "\"Lobster\", cursive",
    preview: "Van Rin style",
  },
  {
    label: "Thiệp tay",
    cssVar: "--font-sacramento",
    fallback: "\"Sacramento\", cursive",
    preview: "Especially for you",
  },
  {
    label: "Couture",
    cssVar: "--font-playfair-display",
    fallback: "\"Playfair Display\", serif",
    preview: "LENTH Atelier",
  },
  {
    label: "Cổ điển",
    cssVar: "--font-cormorant-garamond",
    fallback: "\"Cormorant Garamond\", serif",
    preview: "Monogram signature",
  },
  {
    label: "Hoàng gia",
    cssVar: "--font-cinzel",
    fallback: "\"Cinzel\", serif",
    preview: "LUXE INITIALS",
  },
];

const threadColors = ["#5b3b1f", "#a6792f", "#2f2a25", "#8b2f45", "#27615a", "#b78a9a"];

function resolveFontFamily(option: (typeof fontOptions)[number]): string {
  if (typeof window === "undefined") return option.fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(option.cssVar)
    .trim();

  return value || option.fallback;
}

function getFontOptionByLabel(label: string | undefined) {
  return fontOptions.find((option) => option.label === label) ?? fontOptions[0];
}

function getFontOptionByFamily(family: string | undefined) {
  if (!family) return fontOptions[0];

  return (
    fontOptions.find((option) =>
      family.toLowerCase().includes(option.label.toLowerCase()),
    ) ?? fontOptions[0]
  );
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
  const [selectedObjectType, setSelectedObjectType] = useState<
    "text" | "icon" | null
  >(null);
  const [objectCounts, setObjectCounts] = useState({ texts: 0, icons: 0 });
  const [status, setStatus] = useState("Sẵn sàng thiết kế");

  const getCanvasCounts = useCallback(() => {
    const objects = canvasRef.current?.getObjects() ?? [];

    return {
      texts: objects.filter((object) => object.type === "textbox").length,
      icons: objects.filter((object) => object.type === "image").length,
    };
  }, []);

  const syncObjectCounts = useCallback(() => {
    setObjectCounts(getCanvasCounts());
  }, [getCanvasCounts]);

  const syncSelectedObject = useCallback(() => {
    const activeObject = canvasRef.current?.getActiveObject();

    if (!activeObject) {
      setSelectedObjectType(null);
      return;
    }

    if (activeObject.type === "textbox") {
      const textbox = activeObject as import("fabric").Textbox;
      const fontLabel = String(
        (
          textbox as import("fabric").Textbox & {
            data?: { fontLabel?: string };
          }
        ).data?.fontLabel ?? "",
      );
      const fontOption = fontLabel
        ? getFontOptionByLabel(fontLabel)
        : getFontOptionByFamily(String(textbox.fontFamily ?? ""));
      setSelectedObjectType("text");
      setText(textbox.text ?? "");
      setSelectedFontLabel(fontOption.label);
      setThreadColor(String(textbox.fill ?? threadColors[1]));
      return;
    }

    if (activeObject.type === "image") {
      setSelectedObjectType("icon");
      return;
    }

    setSelectedObjectType(null);
  }, []);

  const ensureFontLoaded = async (family: string) => {
    if (typeof document === "undefined" || !("fonts" in document)) return;

    try {
      await document.fonts.load(`32px ${family}`);
    } catch {
      // Canvas still falls back gracefully if a remote font is unavailable.
    }
  };

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    let previewDataUrl: string | null = null;

    try {
      previewDataUrl = canvas.toDataURL({
        format: "png",
        multiplier: 1,
      });
    } catch {
      previewDataUrl = null;
    }

    const texts = objects
      .filter((object) => object.type === "textbox")
      .map((object) => {
          const textbox = object as import("fabric").Textbox;
          return {
            text: textbox.text ?? "",
            font: String(textbox.fontFamily ?? "Arial"),
            fontLabel: String(
              (
                textbox as import("fabric").Textbox & {
                  data?: { fontLabel?: string };
                }
              ).data?.fontLabel ??
                getFontOptionByFamily(String(textbox.fontFamily ?? "")).label,
            ),
            color: String(textbox.fill ?? "#333"),
            position: { x: textbox.left ?? 0, y: textbox.top ?? 0 },
          };
        });
    const icons = objects
      .filter((object) => object.type === "image")
      .map((object) => {
          const image = object as import("fabric").FabricImage;
          return image.getSrc();
        });
    const nextDesignData = {
      texts,
      icons,
      pricing: calculateCustomizationFee({ texts, icons }),
      canvasJSON: canvas.toJSON(),
      previewDataUrl,
      updatedAt: new Date().toISOString(),
    };

    setDesignData(nextDesignData);
    setObjectCounts({ texts: texts.length, icons: icons.length });
    setStatus(previewDataUrl ? "Đã lưu thiết kế và ảnh xem trước" : "Đã lưu thiết kế");
  }, [setDesignData]);

  useEffect(() => {
    let disposed = false;

    async function setupCanvas() {
      if (!canvasElRef.current) return;

      const fabric = await import("fabric");
      if (disposed || !canvasElRef.current) return;

      fabricRef.current = fabric;
      const canvas = new fabric.Canvas(canvasElRef.current, {
        width: CANVAS_DEFAULT_CONFIG.width,
        height: CANVAS_DEFAULT_CONFIG.height,
        backgroundColor: CANVAS_DEFAULT_CONFIG.backgroundColor,
        preserveObjectStacking: true,
        selection: true,
      });
      canvasRef.current = canvas;

      const backgroundUrl = getTempImageUrl(form, material, color);
      try {
        const background = await fabric.FabricImage.fromURL(backgroundUrl, {
          crossOrigin: "anonymous",
        });
        const scale = Math.min(
          CANVAS_DEFAULT_CONFIG.width / (background.width || 500),
          CANVAS_DEFAULT_CONFIG.height / (background.height || 500),
        );
        background.set({
          left: CANVAS_DEFAULT_CONFIG.width / 2,
          top: CANVAS_DEFAULT_CONFIG.height / 2,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
          scaleX: scale * 0.86,
          scaleY: scale * 0.86,
        });
        canvas.backgroundImage = background;
        canvas.requestRenderAll();
      } catch {
        setStatus("Không tải được ảnh nền, vẫn có thể thêm chữ và icon");
      }

      if (initialCanvasJSONRef.current) {
        try {
          await canvas.loadFromJSON(initialCanvasJSONRef.current);
          canvas.requestRenderAll();
        } catch {
          setStatus("Dữ liệu thiết kế cũ không hợp lệ");
        }
      }

      const saveOnChange = () => saveCanvas();
      canvas.on("object:modified", saveOnChange);
      canvas.on("object:added", () => {
        syncObjectCounts();
        saveCanvas();
      });
      canvas.on("object:removed", () => {
        syncObjectCounts();
        saveCanvas();
      });
      canvas.on("selection:created", syncSelectedObject);
      canvas.on("selection:updated", syncSelectedObject);
      canvas.on("selection:cleared", () => setSelectedObjectType(null));
      syncObjectCounts();
    }

    setupCanvas();

    return () => {
      disposed = true;
      canvasRef.current?.dispose();
      canvasRef.current = null;
    };
  }, [color, form, material, saveCanvas, syncObjectCounts, syncSelectedObject]);

  const applySelectedStyle = async (next?: {
    fontFamily?: string;
    threadColor?: string;
    text?: string;
  }) => {
    const fabric = fabricRef.current;
    const activeObject = canvasRef.current?.getActiveObject();
    if (!fabric || !activeObject) {
      setStatus("Chọn chữ hoặc icon trên ảnh để cập nhật");
      return;
    }

    const nextFont =
      next?.fontFamily ?? resolveFontFamily(getFontOptionByLabel(selectedFontLabel));
    const nextColor = next?.threadColor ?? threadColor;
    const nextText = next?.text ?? text;
    await ensureFontLoaded(nextFont);

    if (activeObject.type === "textbox") {
      activeObject.set({
        text: nextText.trim() || "Lenth",
        fill: nextColor,
        stroke: nextColor,
        fontFamily: nextFont,
        data: {
          fontLabel: selectedFontLabel,
        },
        shadow: new fabric.Shadow("rgba(0,0,0,0.2) 2px 2px 3px"),
      });
      canvasRef.current?.requestRenderAll();
      saveCanvas();
      setStatus("Đã cập nhật chữ đang chọn");
      return;
    }

    if (activeObject.type === "image") {
      const image = activeObject as import("fabric").FabricImage & {
        filters: unknown[];
        applyFilters: () => void;
      };
      image.filters = [
        new fabric.filters.BlendColor({
          color: nextColor,
          mode: "tint",
          alpha: 0.72,
        }),
      ];
      image.applyFilters();
      canvasRef.current?.requestRenderAll();
      saveCanvas();
      setStatus("Đã đổi màu icon đang chọn");
      return;
    }

    setStatus("Mục đang chọn chưa hỗ trợ cập nhật");
  };

  const handleTextChange = (value: string) => {
    setText(value);
    const activeObject = canvasRef.current?.getActiveObject();
    if (activeObject?.type === "textbox") {
      applySelectedStyle({ text: value });
    }
  };

  const handleFontChange = async (option: (typeof fontOptions)[number]) => {
    const family = resolveFontFamily(option);
    setSelectedFontLabel(option.label);
    if (canvasRef.current?.getActiveObject()?.type === "textbox") {
      await applySelectedStyle({ fontFamily: family });
    }
  };

  const handleThreadColorChange = (value: string) => {
    setThreadColor(value);
    if (canvasRef.current?.getActiveObject()) {
      applySelectedStyle({ threadColor: value });
    }
  };

  const addText = async () => {
    const fabric = fabricRef.current;
    const canvas = canvasRef.current;
    if (!fabric || !canvas) return;
    if (getCanvasCounts().texts >= MAX_TEXT_OBJECTS) {
      setStatus("Tối đa 3 cụm chữ trên một mẫu túi");
      return;
    }

    const { shadow, ...textConfig } = CANVAS_DEFAULT_CONFIG.defaultText;
    const selectedFontOption = getFontOptionByLabel(selectedFontLabel);
    const resolvedFontFamily = resolveFontFamily(selectedFontOption);
    await ensureFontLoaded(resolvedFontFamily);
    const textbox = new fabric.Textbox(text.trim() || "Lenth", {
      ...textConfig,
      fill: threadColor,
      stroke: threadColor,
      fontFamily: resolvedFontFamily,
      data: {
        fontLabel: selectedFontOption.label,
      },
      left: 280,
      top: 300,
      width: 180,
      textAlign: "center",
      lockUniScaling: true,
      shadow: new fabric.Shadow(shadow),
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.requestRenderAll();
    syncSelectedObject();
  };

  const addIcon = async (iconSrc = selectedIcon) => {
    const fabric = fabricRef.current;
    const canvas = canvasRef.current;
    if (!fabric || !canvas) return;
    if (getCanvasCounts().icons >= MAX_ICON_OBJECTS) {
      setStatus("Tối đa 3 icon trên một mẫu túi");
      return;
    }

    try {
      setSelectedIcon(iconSrc);
      const icon = await fabric.FabricImage.fromURL(iconSrc);
      icon.set({
        left: 430,
        top: 275,
        scaleX: 0.24,
        scaleY: 0.24,
        lockUniScaling: true,
      });
      canvas.add(icon);
      canvas.setActiveObject(icon);
      canvas.requestRenderAll();
      syncSelectedObject();
    } catch {
      setStatus("Không tải được icon");
    }
  };

  const removeSelected = () => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedObjectType(null);
  };

  const downloadData = (content: string, fileName: string, type: string) => {
    const anchor = document.createElement("a");
    const blob = new Blob([content], { type });
    anchor.href = URL.createObjectURL(blob);
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  const downloadJson = () => {
    saveCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    downloadData(
      JSON.stringify(
        {
          form,
          material,
          color,
          design: canvas.toJSON(),
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      "lenth-custom-design.json",
      "application/json",
    );
  };

  const downloadPng = () => {
    saveCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const anchor = document.createElement("a");
      anchor.href = canvas.toDataURL({ format: "png", multiplier: 2 });
      anchor.download = "lenth-custom-bag.png";
      anchor.click();
    } catch {
      setStatus("Chưa xuất được PNG do ảnh nền bên ngoài không cho phép");
    }
  };

  return (
    <section className="space-y-5 animate-fade-up">
      <div className="rounded-lg border-2 border-[#432719] bg-[#e8e5e1] p-4 shadow-lg sm:p-6">
        <h2 className="mb-4 text-center text-lg font-bold uppercase text-[#7d4f2d]">
          Bước 4: Thiết kế trên canvas
        </h2>
        <div className="mx-auto max-w-[700px] overflow-hidden rounded-md bg-[#ddd9d4] shadow-inner">
          <canvas ref={canvasElRef} className="h-auto max-w-full" />
        </div>
      </div>

      <div className="rounded-lg border-2 border-[#432719] bg-[#e8e5e1] p-5 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <input
              value={text}
              onChange={(event) => handleTextChange(event.target.value)}
              placeholder="Nhập chữ muốn thêu lên túi"
              className="h-12 w-full rounded-xl border border-[#d8c9bc] bg-white px-4 text-center text-[#6b4a3b] shadow-sm outline-none transition focus:border-[#c6a43f] focus:ring-4 focus:ring-[#c6a43f]/20"
            />

            <div>
              <div className="mb-2 text-sm font-bold uppercase text-[#7d4f2d]">
                Kiểu chữ
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {fontOptions.map((font) => (
                  <button
                    key={font.label}
                    type="button"
                    onClick={() => handleFontChange(font)}
                    className={cn(
                      "rounded-md border border-[#d8c9bc] bg-white px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#c6a43f]",
                      selectedFontLabel === font.label &&
                        "border-[#432719] bg-[#432719] text-white",
                    )}
                  >
                    <span className="block text-xs font-semibold">
                      {font.label}
                    </span>
                    <span
                      className="mt-1 block truncate text-xl leading-6"
                      style={{
                        fontFamily: `var(${font.cssVar}), ${font.fallback}`,
                      }}
                    >
                      {font.preview}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-bold uppercase text-[#7d4f2d]">
                Màu chỉ
              </div>
              <div className="flex flex-wrap gap-2">
                {threadColors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Màu ${item}`}
                    onClick={() => handleThreadColorChange(item)}
                    className={cn(
                      "size-10 rounded-full border border-[#d8c9bc] transition hover:scale-110",
                      threadColor === item && "ring-4 ring-[#c6a43f] ring-offset-2",
                    )}
                    style={{ backgroundColor: item }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={addText} className="rounded-full normal-case">
                <Type size={18} />
                Thêm chữ lên túi
              </Button>
              <Button
                onClick={() => applySelectedStyle()}
                variant="secondary"
                className="rounded-full normal-case"
              >
                Cập nhật mục đang chọn
              </Button>
            </div>
            <div className="rounded-lg border border-[#d8c9bc] bg-white/80 p-3 text-sm text-[#5c473a]">
              <div className="flex items-center gap-2 font-bold text-[#7d4f2d]">
                <Palette size={16} />
                {selectedObjectType
                  ? selectedObjectType === "text"
                    ? "Đang chọn một cụm chữ"
                    : "Đang chọn một icon"
                  : "Chưa chọn mục nào trên ảnh"}
              </div>
              <p className="mt-2">
                Chữ: {objectCounts.texts}/{MAX_TEXT_OBJECTS} cụm, icon:{" "}
                {objectCounts.icons}/{MAX_ICON_OBJECTS}. Phí thêu hiện tại:{" "}
                <strong>
                  {formatPrice(
                    calculateCustomizationFee({
                      texts: designData.texts,
                      icons: designData.icons,
                    }).total,
                  )}
                </strong>
                . Số ký tự tính phí không gồm khoảng trắng.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-[#7d4f2d]">
              <ImageIcon size={18} />
              Chọn icon thêu
            </div>
            <div className="max-h-80 overflow-y-auto rounded-lg border border-[#d8c9bc] bg-[#f8f2ec] p-3 shadow-inner">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {iconOptions.map((icon) => (
                <button
                  key={icon.src}
                  type="button"
                  onClick={() => addIcon(icon.src)}
                  className={cn(
                    "group rounded-lg border border-[#d8c9bc] bg-white p-3 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-md",
                    selectedIcon === icon.src && "border-[#432719] shadow-[0_0_0_2px_rgba(67,39,25,0.14)]",
                  )}
                >
                  <span
                    className="mx-auto block size-12 bg-contain bg-center bg-no-repeat transition group-hover:scale-110"
                    style={{ backgroundImage: `url(${icon.src})` }}
                  />
                  <span className="mt-2 block text-xs font-semibold text-[#5c473a]">
                    {icon.label}
                  </span>
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={removeSelected}
            variant="secondary"
            className="rounded-full normal-case"
          >
            <Trash2 size={18} />
            Xóa mục đang chọn
          </Button>
          <Button onClick={saveCanvas} className="rounded-full px-8">
            <Save size={18} />
            Lưu thiết kế
          </Button>
          <Button onClick={downloadPng} variant="secondary" className="rounded-full">
            <Download size={18} />
            Tải ảnh thiết kế
          </Button>
          <Button onClick={downloadJson} variant="secondary" className="rounded-full">
            <Download size={18} />
            Tải bản lưu
          </Button>
        </div>
        <p className={cn("mt-4 text-center text-sm text-[#9b6f5f]")}>
          {status}. Kéo thả để di chuyển; kéo góc để phóng to, thu nhỏ hoặc xoay.
        </p>
      </div>
    </section>
  );
}
