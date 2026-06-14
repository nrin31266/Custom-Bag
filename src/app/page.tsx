import Link from "next/link";
import { ArrowRight, BadgeCheck, Palette, ShoppingBag, Sparkles } from "lucide-react";
import forms from "@/data/forms.json";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";
import { getDefaultSelectionForForm } from "@/lib/productCatalog";

const highlights = [
  { icon: Palette, title: "Bạn chọn, bạn quyết", text: "Từ dáng túi, chất liệu cho đến màu sắc và chữ thêu — tất cả do bạn tự tay chọn lựa theo gu riêng." },
  { icon: Sparkles, title: "Chỉnh sửa không giới hạn", text: "Thích đổi ý? Thoải mái quay lại chỉnh sửa mẫu của bạn bất cứ lúc nào trước khi đặt hàng." },
  { icon: BadgeCheck, title: "Đặt hàng dễ như đi chợ", text: "Xem trước túi, chọn hộp quà xinh, biết tổng tiền ngay và hoàn tất chỉ trong vài phút." },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      {/* Hero */}
      <section className="hero-sheen relative overflow-hidden border-b border-[#eadfd6]">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] items-center gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="animate-slide-in-left">
            <div className="mb-4 inline-flex items-center rounded-full border border-[#c6a43f]/50 bg-[#fef9f0] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#9a6b36]">
              Lenth Custom Bag
            </div>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.08] sm:text-7xl">
              Thiết kế chiếc túi
              <br />
              <span className="bg-gradient-to-r from-[#432719] via-[#7d4f2d] to-[#c6a43f] bg-clip-text text-transparent">theo cách của riêng bạn.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c473a]">
              Không cần biết vẽ, không cần rành công nghệ — bạn chỉ việc chọn kiểu dáng,
              chất liệu và màu sắc yêu thích. Mọi thứ đã có sẵn, dễ như đang lướt mạng xã hội.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/step1-form?fresh=1" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#432719] px-8 py-3.5 font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-xl">
                Tạo túi của bạn <ArrowRight size={21} />
              </Link>
              <Link href="/cart" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#432719]/40 bg-white px-8 py-3.5 font-semibold uppercase text-[#432719] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5eee7] hover:shadow-md">
                Giỏ hàng <ShoppingBag size={21} />
              </Link>
            </div>
          </div>

          <div className="animate-float relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-4 rounded-full bg-[#c6a43f]/15 blur-3xl" />
            <div className="absolute left-1/4 top-1/4"><div className="animate-sparkle size-2 rounded-full bg-[#c6a43f]" /></div>
            <div className="absolute right-1/4 top-2/3" style={{ animationDelay: "0.8s" }}><div className="animate-sparkle size-1.5 rounded-full bg-[#c6a43f]" style={{ animationDelay: "0.8s" }} /></div>
            <ProductImage mode="form" form="shoulder" material="da-pebble" color="trang-be" className="relative drop-shadow-2xl" priority />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-8">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6b36]">Vì sao bạn thích Lenth</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#2b1a12] sm:text-4xl">Đơn giản, vui và đầy cá tính</h2>
        </div>
        <div className="animate-enter-stagger grid gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-shine rounded-2xl border border-[#eadfd6] bg-[#fffdfb] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#432719] text-white shadow-lg"><Icon size={26} /></div>
                <h3 className="text-xl font-bold text-[#2b1a12]">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#5c473a]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Studio card */}
      <section className="mx-auto max-w-[1600px] px-6 pb-16 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-gradient-to-br from-[#fffdfb] to-[#f7efe7] shadow-sm">
          <div className="grid gap-8 p-8 lg:grid-cols-[0.7fr_1.3fr] lg:p-12">
            <div className="animate-slide-in-left">
              <span className="inline-block rounded-full bg-[#432719] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Cách hoạt động</span>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#2b1a12]">Từ ý tưởng đến lúc nhận hàng — mọi thứ đều dễ dàng.</h2>
              <p className="mt-4 leading-7 text-[#5c473a]">Bạn có thể thử nhiều mẫu khác nhau, để dành trong giỏ, so sánh rồi mới quyết định. Không áp lực, không vội vàng.</p>
            </div>
            <div className="animate-enter-stagger grid gap-4 sm:grid-cols-2">
              {["Để dành nhiều mẫu trong giỏ, thoải mái so sánh trước khi chọn.", "Xem lại đơn đã mua, mua lại mẫu cũ nếu thấy ưng.", "Thêu tên, thêu icon xinh xắn — tha hồ sáng tạo.", "Sau khi đặt hàng, bạn sẽ thấy ngay mã đơn để tiện theo dõi."].map((note, i) => (
                <div key={i} className="flex gap-3 rounded-xl bg-white/80 p-5 shadow-sm backdrop-blur">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#432719] text-sm font-bold text-white">{i + 1}</span>
                  <span className="text-sm leading-relaxed text-[#4a392f]">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick pick forms */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6b36]">Kiểu dáng được yêu thích</span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#2b1a12]">Chọn nhanh dáng túi</h2>
          </div>
          <Link href="/step1-form?fresh=1" className="hidden text-sm font-semibold text-[#432719] underline underline-offset-4 hover:text-[#7d4f2d] sm:block">Xem tất cả &rarr;</Link>
        </div>
        <div className="animate-enter-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(forms).slice(0, 4).map(([key, item]) => {
            const defaults = getDefaultSelectionForForm(key);
            return (
            <Link key={key} href="/step1-form?fresh=1" className="card-shine group rounded-2xl border border-[#eadfd6] bg-[#fffdfb] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-xl">
              <ProductImage form={key} material={defaults.material} color={defaults.color} mode="form" />
              <div className="mt-4 flex items-center justify-between px-1 pb-1">
                <span className="font-serif text-lg font-semibold">{item.name}</span>
                <span className="text-sm text-[#7a675b]">{formatPrice(item.basePrice)}</span>
              </div>
            </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}