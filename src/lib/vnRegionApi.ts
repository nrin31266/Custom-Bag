export type Province = {
  code: number;
  name: string;
  division_type?: string;
  codename?: string;
  phone_code?: number;
};

export type Ward = {
  code: number;
  name: string;
  division_type?: string;
  codename?: string;
  province_code: number;
};

export type ShippingFee = {
  name: string;
  code: number;
  shipping_fee: number;
};

import shippingFeesData from "@/data/mock-shipping-fees.json";

const OPEN_API_BASE = "https://provinces.open-api.vn/api/v2";

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
  const response = await fetch(`${OPEN_API_BASE}/p/`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Không tải được danh sách tỉnh/thành");
  }

  return (await response.json()) as Province[];
}

export async function fetchVietnamWards(provinceCode: string | number): Promise<Ward[]> {
  const response = await fetch(
    `${OPEN_API_BASE}/w/?province=${encodeURIComponent(provinceCode.toString())}`,
    { cache: "force-cache" },
  );

  if (!response.ok) {
    throw new Error(`Không tải được danh sách xã/phường cho tỉnh ${provinceCode}`);
  }

  return (await response.json()) as Ward[];
}

/**
 * Get shipping fee by province code from mock data
 */
export function getShippingFeeByProvinceCode(
  provinceCode: string | number,
): Promise<number | null> {
  return Promise.resolve().then(() => {
    try {
      const fees = shippingFeesData as ShippingFee[];
      const codeNum = typeof provinceCode === "string" ? parseInt(provinceCode, 10) : provinceCode;
      const fee = fees.find((f) => f.code === codeNum);
      return fee?.shipping_fee ?? null;
    } catch {
      return null;
    }
  });
}
