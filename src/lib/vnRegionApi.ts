export type Province = {
  code: string;
  name: string;
  type?: string;
};

export type Ward = {
  code: string;
  name: string;
  district_code?: string;
  province_code: string;
};

const API_BASE = "https://huynhminhvangit.github.io/vn-region-api";

function tryParsePreJson<T>(html: string): T | null {
  const match = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (!match) return null;

  try {
    const text = match[1]
      .replace(/&quot;/g, "\"")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function fetchVietnamProvinces(): Promise<Province[]> {
  const response = await fetch(`${API_BASE}/data/provinces.json`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Không tải được danh sách tỉnh/thành");
  }

  return (await response.json()) as Province[];
}

export async function fetchVietnamWards(provinceCode: string): Promise<Ward[]> {
  const apiResponse = await fetch(
    `${API_BASE}/api/wards.html?province_code=${encodeURIComponent(provinceCode)}`,
    { cache: "force-cache" },
  );

  if (apiResponse.ok) {
    const parsed = tryParsePreJson<Ward[]>(await apiResponse.text());
    if (parsed) return parsed;
  }

  const dataResponse = await fetch(`${API_BASE}/data/wards.json`, {
    cache: "force-cache",
  });

  if (!dataResponse.ok) {
    throw new Error("Không tải được danh sách phường/xã");
  }

  const wards = (await dataResponse.json()) as Ward[];

  return wards.filter((ward) => ward.province_code === provinceCode);
}
