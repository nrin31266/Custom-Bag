import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { dataUrl: string };
    if (!body.dataUrl?.startsWith("data:image/png;base64,")) {
      return NextResponse.json({ error: "Chỉ chấp nhận PNG base64" }, { status: 400 });
    }

    const base64 = body.dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const exportsDir = path.join(process.cwd(), "public", "exports");
    await mkdir(exportsDir, { recursive: true });

    const fileName = `preview-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
    const filePath = path.join(exportsDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ path: `/exports/${fileName}` });
  } catch (error) {
    return NextResponse.json({ error: "Không lưu được ảnh preview" }, { status: 500 });
  }
}