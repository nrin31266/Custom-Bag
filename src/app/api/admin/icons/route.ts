import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import iconsData from "@/data/icons.json";

const rootDir = process.cwd();
const iconsFile = path.join(rootDir, "src/data/icons.json");

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

async function readIconsFile() {
  return JSON.parse(await readFile(iconsFile, "utf8")) as { icons: Array<{ src: string; label: string }> };
}

async function writeIconsFile(data: unknown) {
  await writeFile(iconsFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function getImageExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  const allowed = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);
  if (!allowed.has(ext)) {
    throw new Response(JSON.stringify({ error: "Chỉ hỗ trợ svg, png, jpg, jpeg, webp." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  return ext;
}

export async function GET(request: Request) {
  try {
    assertLocalRequest(request);
    return Response.json(await readIconsFile());
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Không đọc được icons." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    assertLocalRequest(request);

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const action = String(formData.get("action") ?? "add");
      const label = String(formData.get("label") ?? "").trim();
      const file = formData.get("file");

      if (action === "delete") {
        const src = String(formData.get("src") ?? "").trim();
        if (!src) return Response.json({ error: "Thiếu src icon cần xóa." }, { status: 400 });

        const data = await readIconsFile();
        const idx = data.icons.findIndex((icon) => icon.src === src);
        if (idx === -1) return Response.json({ error: "Icon không tồn tại." }, { status: 404 });

        // Delete file from public
        const diskPath = path.join(rootDir, "public", src.replace(/^\//, ""));
        if (diskPath.startsWith(path.join(rootDir, "public/icons"))) {
          try { await unlink(diskPath); } catch { /* ok if missing */ }
        }

        data.icons.splice(idx, 1);
        await writeIconsFile(data);
        return Response.json(data);
      }

      if (!label) return Response.json({ error: "Tên icon không được trống." }, { status: 400 });
      if (!(file instanceof File) || file.size === 0) {
        return Response.json({ error: "Thiếu file icon." }, { status: 400 });
      }

      const ext = getImageExtension(file.name);
      const uploadToken = Date.now();
      const fileName = `icon-${uploadToken}${ext}`;
      const publicDir = path.join(rootDir, "public/icons");
      const diskPath = path.join(publicDir, fileName);
      const publicPath = `/icons/${fileName}`;

      await mkdir(publicDir, { recursive: true });
      await writeFile(diskPath, Buffer.from(await file.arrayBuffer()));

      const data = await readIconsFile();
      data.icons.push({ src: publicPath, label });
      await writeIconsFile(data);

      return Response.json(data);
    }

    return Response.json({ error: "Phải dùng multipart/form-data." }, { status: 400 });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Không lưu được icons." }, { status: 500 });
  }
}