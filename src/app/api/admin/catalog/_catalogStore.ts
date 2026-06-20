import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
type CatalogScope = "materials" | "colors" | "forms";

type MaterialRecord = {
  name: string;
  description: string;
  imageUrl: string;
  parent?: string;
};

type ColorRecord = {
  name: string;
  hex: string;
  imageUrl: string;
};

type ProductColorOption = {
  id: string;
  priceAdjust: number;
  imageUrl: string;
};

type ProductSubOption = {
  id: string;
  name: string;
  materialKey: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  colors: ProductColorOption[];
};

type ProductFormRecord = {
  name: string;
  shortName: string;
  icon: string;
  basePrice: number;
  description: string;
  imageUrl: string;
  subOptions: ProductSubOption[];
};

type CatalogData = {
  materials: Record<string, MaterialRecord>;
  colors: Record<string, ColorRecord>;
  forms: Record<string, ProductFormRecord>;
  usage: {
    materials: Record<string, number>;
    colors: Record<string, number>;
    forms: Record<string, { subOptions: number; colors: number }>;
  };
};

const rootDir = process.cwd();
const dataFiles: Record<CatalogScope, string> = {
  materials: path.join(rootDir, "src/data/materials.json"),
  colors: path.join(rootDir, "src/data/colors.json"),
  forms: path.join(rootDir, "src/data/forms.json"),
};
const formsFile = path.join(rootDir, "src/data/forms.json");

function isLocalRequest(request: Request) {
  const host = request.headers.get("host")?.split(":")[0];
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function assertLocalRequest(request: Request) {
  if (!isLocalRequest(request)) {
    throw new Response(JSON.stringify({ error: "Admin API is local-only." }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function writeJsonFile(filePath: string, data: unknown) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeCatalogFile(
  scope: CatalogScope,
  data: Record<string, MaterialRecord | ColorRecord | ProductFormRecord>,
) {
  if (scope === "materials") {
    await writeJsonFile(dataFiles.materials, data);
    return;
  }

  if (scope === "forms") {
    await writeJsonFile(dataFiles.forms, data);
    return;
  }

  const entries = Object.entries(data as Record<string, ColorRecord>);
  const lines = ["{"];
  entries.forEach(([id, value], index) => {
    const suffix = index === entries.length - 1 ? "" : ",";
    lines.push(
      `  ${JSON.stringify(id)}: { "name": ${JSON.stringify(value.name)}, "hex": ${JSON.stringify(value.hex)}, "imageUrl": ${JSON.stringify(value.imageUrl ?? "")} }${suffix}`,
    );
  });
  lines.push("}");
  await writeFile(dataFiles.colors, `${lines.join("\n")}\n`, "utf8");
}

function sanitizeId(id: unknown) {
  return String(id ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getImageExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  if (!allowed.has(ext)) {
    throw new Response(JSON.stringify({ error: "Chỉ hỗ trợ jpg, jpeg, png, webp hoặc gif." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  return ext;
}

function getUsage(forms: Record<string, ProductFormRecord>) {
  const materials: Record<string, number> = {};
  const colors: Record<string, number> = {};
  const formUsage: Record<string, { subOptions: number; colors: number }> = {};

  for (const [formId, form] of Object.entries(forms)) {
    formUsage[formId] = {
      subOptions: form.subOptions?.length ?? 0,
      colors: 0,
    };
    for (const sub of form.subOptions ?? []) {
      materials[sub.materialKey] = (materials[sub.materialKey] ?? 0) + 1;
      for (const color of sub.colors ?? []) {
        colors[color.id] = (colors[color.id] ?? 0) + 1;
        formUsage[formId].colors += 1;
      }
    }
  }

  return { materials, colors, forms: formUsage };
}

async function readCatalog(): Promise<CatalogData> {
  const [materials, colors, forms] = await Promise.all([
    readJsonFile<Record<string, MaterialRecord>>(dataFiles.materials),
    readJsonFile<Record<string, ColorRecord>>(dataFiles.colors),
    readJsonFile<Record<string, ProductFormRecord>>(formsFile),
  ]);

  return {
    materials,
    colors,
    forms,
    usage: getUsage(forms),
  };
}

function normalizeMaterial(entry: Partial<MaterialRecord>): MaterialRecord {
  return {
    name: String(entry.name ?? "").trim(),
    description: String(entry.description ?? "").trim(),
    imageUrl: String(entry.imageUrl ?? "").trim(),
    ...(String(entry.parent ?? "").trim() ? { parent: String(entry.parent).trim() } : {}),
  };
}

function normalizeColor(entry: Partial<ColorRecord>): ColorRecord {
  return {
    name: String(entry.name ?? "").trim(),
    hex: String(entry.hex ?? "#000000").trim(),
    imageUrl: String(entry.imageUrl ?? "").trim(),
  };
}

function getScopedFile(scope: unknown): { scope: CatalogScope; filePath: string } {
  if (scope !== "materials" && scope !== "colors" && scope !== "forms") {
    throw new Response(JSON.stringify({ error: "Scope không hợp lệ." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  return { scope, filePath: dataFiles[scope] };
}

async function deleteLocalPublicImage(imageUrl: string) {
  const cleanPath = imageUrl.split("?")[0];
  if (!cleanPath.startsWith("/images/")) return;
  if (cleanPath.includes("..")) return;

  const diskPath = path.join(rootDir, "public", cleanPath);
  if (!diskPath.startsWith(path.join(rootDir, "public/images"))) return;

  try {
    await unlink(diskPath);
  } catch {
    // Missing old files are fine; uploads should not fail because cleanup did.
  }
}

function getExistingImagePath(
  scope: CatalogScope,
  record: MaterialRecord | ColorRecord | ProductFormRecord,
  target: string,
  subId: string,
  colorId: string,
) {
  if (scope !== "forms") return record.imageUrl;

  const form = record as ProductFormRecord;
  if (target === "form") return form.imageUrl;

  const sub = form.subOptions.find((item) => item.id === subId);
  if (target === "sub") return sub?.imageUrl ?? "";
  if (target === "color") {
    return sub?.colors.find((color) => color.id === colorId)?.imageUrl ?? "";
  }

  return "";
}

function failValidation(message: string): never {
  throw new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

function normalizeProductForm(
  entry: Partial<ProductFormRecord>,
  materials: Record<string, MaterialRecord>,
  colors: Record<string, ColorRecord>,
): ProductFormRecord {
  const basePrice = Number(entry.basePrice);
  const subOptions = Array.isArray(entry.subOptions) ? entry.subOptions : [];
  const subIds = new Set<string>();

  if (!String(entry.name ?? "").trim()) failValidation("Tên form không được trống.");
  if (!String(entry.shortName ?? "").trim()) failValidation("Tên ngắn của form không được trống.");
  if (!Number.isFinite(basePrice) || basePrice < 0) failValidation("Giá basePrice của form không hợp lệ.");
  if (subOptions.length === 0) failValidation("Form phải có ít nhất 1 chất liệu con.");

  return {
    name: String(entry.name ?? "").trim(),
    shortName: String(entry.shortName ?? "").trim(),
    icon: String(entry.icon ?? "ShoppingBag").trim() || "ShoppingBag",
    basePrice,
    description: String(entry.description ?? "").trim(),
    imageUrl: String(entry.imageUrl ?? "").trim(),
    subOptions: subOptions.map((sub, subIndex) => {
      const subId = sanitizeId(sub.id);
      const subBasePrice = Number(sub.basePrice);
      const colorOptions = Array.isArray(sub.colors) ? sub.colors : [];
      const colorIds = new Set<string>();

      if (!subId) failValidation(`Sub option #${subIndex + 1} thiếu id.`);
      if (subIds.has(subId)) failValidation(`Sub option bị trùng id: ${subId}.`);
      subIds.add(subId);
      if (!String(sub.name ?? "").trim()) failValidation(`Sub option ${subId} thiếu tên.`);
      if (!materials[String(sub.materialKey ?? "")]) failValidation(`Sub option ${subId} dùng materialKey không tồn tại.`);
      if (!Number.isFinite(subBasePrice) || subBasePrice < 0) failValidation(`Sub option ${subId} có basePrice không hợp lệ.`);
      if (colorOptions.length === 0) failValidation(`Sub option ${subId} phải có ít nhất 1 màu.`);

      return {
        id: subId,
        name: String(sub.name ?? "").trim(),
        materialKey: String(sub.materialKey ?? "").trim(),
        description: String(sub.description ?? "").trim(),
        basePrice: subBasePrice,
        imageUrl: String(sub.imageUrl ?? "").trim(),
        colors: colorOptions.map((color, colorIndex) => {
          const colorId = sanitizeId(color.id);
          const priceAdjust = Number(color.priceAdjust);
          if (!colorId) failValidation(`Màu #${colorIndex + 1} trong ${subId} thiếu id.`);
          if (colorIds.has(colorId)) failValidation(`Sub option ${subId} bị trùng màu: ${colorId}.`);
          colorIds.add(colorId);
          if (!colors[colorId]) failValidation(`Sub option ${subId} dùng màu không tồn tại: ${colorId}.`);
          if (!Number.isFinite(priceAdjust)) failValidation(`Màu ${colorId} trong ${subId} có priceAdjust không hợp lệ.`);
          return {
            id: colorId,
            priceAdjust,
            imageUrl: String(color.imageUrl ?? "").trim(),
          };
        }),
      };
    }),
  };
}

export async function GET(request: Request) {
  try {
    assertLocalRequest(request);
    return Response.json(await readCatalog());
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Không đọc được dữ liệu admin." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    assertLocalRequest(request);

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      return await uploadImage(request);
    }

    const body = (await request.json()) as {
      action?: "upsert" | "delete";
      scope?: CatalogScope;
      id?: string;
      originalId?: string;
      entry?: Partial<MaterialRecord | ColorRecord | ProductFormRecord>;
    };
    const { scope, filePath } = getScopedFile(body.scope);
    const id = sanitizeId(body.id);
    const originalId = sanitizeId(body.originalId || body.id);
    if (!id) return Response.json({ error: "Thiếu mã item." }, { status: 400 });

    const data = await readJsonFile<Record<string, MaterialRecord | ColorRecord | ProductFormRecord>>(filePath);

    if (body.action === "delete") {
      delete data[originalId];
      await writeCatalogFile(scope, data);
      return Response.json(await readCatalog());
    }

    if (body.action !== "upsert") {
      return Response.json({ error: "Action không hợp lệ." }, { status: 400 });
    }

    const normalized = await (async () => {
      if (scope === "materials") return normalizeMaterial(body.entry as Partial<MaterialRecord>);
      if (scope === "colors") return normalizeColor(body.entry as Partial<ColorRecord>);
      const [materials, colors] = await Promise.all([
        readJsonFile<Record<string, MaterialRecord>>(dataFiles.materials),
        readJsonFile<Record<string, ColorRecord>>(dataFiles.colors),
      ]);
      return normalizeProductForm(body.entry as Partial<ProductFormRecord>, materials, colors);
    })();

    if (!normalized.name) {
      return Response.json({ error: "Tên không được trống." }, { status: 400 });
    }

    if (originalId && originalId !== id) delete data[originalId];
    data[id] = normalized;
    await writeCatalogFile(scope, data);
    return Response.json(await readCatalog());
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Không lưu được dữ liệu admin." }, { status: 500 });
  }
}

async function uploadImage(request: Request) {
  const formData = await request.formData();
  const { scope, filePath } = getScopedFile(formData.get("scope"));
  const id = sanitizeId(formData.get("id"));
  const file = formData.get("file");

  if (!id) return Response.json({ error: "Thiếu mã item để upload ảnh." }, { status: 400 });
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Thiếu file ảnh." }, { status: 400 });
  }

  const target = String(formData.get("target") ?? "").trim();
  const subId = sanitizeId(formData.get("subId"));
  const colorId = sanitizeId(formData.get("colorId"));
  const uploadToken = Date.now();
  const formsUpload =
    scope === "forms"
      ? getFormUploadPath(id, target, subId, colorId, file.name, uploadToken)
      : { folder: "", fileName: "" };
  const folder = scope === "materials" ? "materials" : scope === "colors" ? "colors" : formsUpload.folder;
  const fileName =
    scope === "forms" ? formsUpload.fileName : `${id}-${uploadToken}${getImageExtension(file.name)}`;
  const publicDir =
    scope === "forms"
      ? path.join(rootDir, "public/images/forms", id, folder)
      : path.join(rootDir, "public/images", folder);
  const diskPath = path.join(publicDir, fileName);
  const publicPath =
    scope === "forms"
      ? `/images/forms/${id}/${folder ? `${folder}/` : ""}${fileName}`
      : `/images/${folder}/${fileName}`;

  const data = await readJsonFile<Record<string, MaterialRecord | ColorRecord | ProductFormRecord>>(filePath);
  if (!data[id]) return Response.json({ error: "Item chưa tồn tại trong JSON." }, { status: 404 });
  assertUploadTargetExists(scope, data[id], target, subId, colorId);

  await mkdir(publicDir, { recursive: true });
  await deleteLocalPublicImage(getExistingImagePath(scope, data[id], target, subId, colorId));
  await writeFile(diskPath, Buffer.from(await file.arrayBuffer()));
  data[id] = applyUploadedImagePath(scope, data[id], publicPath, target, subId, colorId);
  await writeCatalogFile(scope, data);

  return Response.json(await readCatalog());
}

function getFormUploadPath(
  id: string,
  target: string,
  subId: string,
  colorId: string,
  originalFileName: string,
  uploadToken: number,
) {
  const ext = getImageExtension(originalFileName);
  if (target === "form") return { folder: "", fileName: `i-${uploadToken}${ext}` };
  if (target === "sub") {
    if (!subId) failValidation("Thiếu subId khi upload ảnh subOption.");
    return { folder: "subs", fileName: `${subId}-${uploadToken}${ext}` };
  }
  if (target === "color") {
    if (!subId || !colorId) failValidation("Thiếu subId/colorId khi upload ảnh màu của form.");
    return { folder: "subs", fileName: `${subId}-${colorId}-${uploadToken}${ext}` };
  }
  failValidation("Target upload form không hợp lệ.");
}

function assertUploadTargetExists(
  scope: CatalogScope,
  record: MaterialRecord | ColorRecord | ProductFormRecord,
  target: string,
  subId: string,
  colorId: string,
) {
  if (scope !== "forms" || target === "form") return;

  const form = record as ProductFormRecord;
  const sub = form.subOptions.find((item) => item.id === subId);
  if (!sub) failValidation(`Không tìm thấy subOption ${subId} trong form.`);

  if (target === "color" && !sub.colors.some((color) => color.id === colorId)) {
    failValidation(`Không tìm thấy màu ${colorId} trong subOption ${subId}.`);
  }
}

function applyUploadedImagePath(
  scope: CatalogScope,
  record: MaterialRecord | ColorRecord | ProductFormRecord,
  publicPath: string,
  target: string,
  subId: string,
  colorId: string,
) {
  if (scope !== "forms") return { ...record, imageUrl: publicPath };

  const form = record as ProductFormRecord;
  if (target === "form") return { ...form, imageUrl: publicPath };

  return {
    ...form,
    subOptions: form.subOptions.map((sub) => {
      if (sub.id !== subId) return sub;
      if (target === "sub") return { ...sub, imageUrl: publicPath };
      return {
        ...sub,
        colors: sub.colors.map((color) =>
          color.id === colorId ? { ...color, imageUrl: publicPath } : color,
        ),
      };
    }),
  };
}
