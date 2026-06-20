# Lenth — Custom Bag Designer

Nền tảng thiết kế túi xách cá nhân hóa. Người dùng chọn kiểu dáng, chất liệu, màu sắc, thêm chữ thêu và icon, xem trước thành phẩm rồi đặt hàng — tất cả trong một luồng 7 bước đơn giản.

## Công nghệ

- [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- [React 19](https://react.dev/) + TypeScript
- [Jotai](https://jotai.org/) (state management với `atomWithStorage` localStorage persistence)
- [Fabric.js 6](https://fabricjs.com/) (canvas thiết kế trực quan)
- [Tailwind CSS 4](https://tailwindcss.com/) + custom animations
- [Lucide Icons](https://lucide.dev/)

## Bắt đầu nhanh

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Cấu trúc thư mục

```
src/
├── app/                    # App Router pages
│   ├── page.tsx            # Trang chủ
│   ├── step1-form/         # Chọn kiểu dáng túi
│   ├── step2-material/     # Chọn chất liệu
│   ├── step3-color/        # Chọn màu sắc
│   ├── step4-design/       # Thiết kế canvas (Fabric.js)
│   ├── step5-preview/      # Xem trước thành phẩm
│   ├── step6-giftbox/      # Chọn hộp quà
│   ├── step7-checkout/     # Thanh toán
│   ├── cart/               # Giỏ hàng (cart + đã mua + đã hủy)
│   ├── success/            # Trang đặt hàng thành công
│   ├── admin/              # Quản lý catalog (forms, materials, colors, icons)
│   ├── materials/          # Trang giới thiệu chất liệu
│   ├── colors/             # Trang bảng màu
│   ├── guide/              # Hướng dẫn sử dụng
│   ├── about/              # Giới thiệu thương hiệu
│   └── api/                # API routes (admin catalog CRUD)
├── components/
│   ├── canvas/             # CanvasEditor (Fabric.js)
│   └── ui/                 # Shared UI (Button, SiteHeader, ProductImage, StepIndicator, PriceSummary)
├── stores/                 # Jotai atoms (customizationStore)
├── hooks/                  # useProductImage, useStepNavigation
├── lib/                    # Utilities (cartUtils, imageUtils, productCatalog, vnRegionApi, pricing)
└── data/                   # Static JSON catalog (forms, materials, colors, icons, prices, giftbox)
```

## Luồng người dùng

1. **Chọn kiểu dáng** — Xem danh sách form túi và giá nền
2. **Chọn chất liệu** — Xem ảnh, mô tả từng loại da/vải
3. **Chọn màu sắc** — Bảng màu theo chất liệu đã chọn
4. **Thiết kế** — Canvas trực quan với Fabric.js: thêm chữ, chọn font, màu chỉ, icon
5. **Xem trước** — Kiểm tra thành phẩm với ảnh preview
6. **Chọn hộp quà** — Thêm box quà, túi vải, thiệp; tự động thêm vào giỏ hàng
7. **Thanh toán** — Form giao hàng (hỗ trợ API tỉnh/phường Việt Nam), chọn phương thức thanh toán

## Admin Panel

Truy cập `/admin` để quản lý catalog:

- **Chất liệu** (Materials) — Thêm/sửa/xóa chất liệu, upload ảnh
- **Màu sắc** (Colors) — Quản lý mã màu và ảnh swatch
- **Forms** — Quản lý kiểu dáng túi, sub-options, màu theo chất liệu
- **Icons** — Upload/remove icon SVG dùng trong canvas thiết kế

`/admin?tab=materials` | `/admin?tab=colors` | `/admin?tab=forms` | `/admin?tab=icons`

## Dữ liệu

Toàn bộ catalog được lưu dưới dạng JSON trong `src/data/`:

| File | Nội dung |
|------|----------|
| `forms.json` | Kiểu dáng túi + sub-options + màu sắc + ảnh |
| `materials.json` | Chất liệu (tên, mô tả, phân cấp parent) |
| `colors.json` | Bảng màu (tên, hex, ảnh) |
| `icons.json` | Icon SVG dùng trong canvas |
| `prices.json` | Cấu hình giá (phí thêu, phí ship, giá ký tự) |
| `giftbox.json` | Tùy chọn hộp quà + phí |
| `common.json` | Cấu hình chung (hero image URL) |
| `mock-shipping-fees.json` | Bảng phí vận chuyển theo tỉnh |

Ảnh sản phẩm được lưu trong `public/images/forms/` và `public/images/materials/`.

## Tính năng nổi bật

- **Canvas thiết kế trực quan** — Kéo thả, thay đổi font/màu/icon real-time
- **Preview đồng bộ** — Ảnh canvas được export PNG và lưu vào localStorage để hiển thị ở cart/checkout
- **Giỏ hàng thông minh** — Giữ nhiều mẫu, chỉnh sửa từng mẫu (có ID riêng), không bị duplicate
- **Phí vận chuyển theo tỉnh** — API tỉnh/phường Việt Nam, tự động tính phí ship
- **Responsive** — Mobile-first, hoạt động tốt trên mọi thiết bị
- **Respects `prefers-reduced-motion`** — Tắt animation khi người dùng yêu cầu

## Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint