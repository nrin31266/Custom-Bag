import Link from "next/link";
import { ArrowRight, BadgeCheck, Palette, ShoppingBag, Sparkles } from "lucide-react";
import forms from "@/data/forms.json";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";

const highlights = [
  {
    icon: Palette,
    title: "Tự chọn từng chi tiết",
    text: "Chọn dáng túi, chất liệu, màu, chữ thêu và phụ kiện theo đúng phong cách của bạn.",
  },
  {
    icon: Sparkles,
    title: "Quay lại vẫn còn",
    text: "Thiết kế được ghi nhớ để bạn có thể xem lại, chỉnh tiếp hoặc thêm vào giỏ khi sẵn sàng.",
  },
  {
    icon: BadgeCheck,
    title: "Đặt hàng rõ ràng",
    text: "Kiểm tra thành phẩm, chọn hộp quà, xem tổng tiền và hoàn tất đơn trong cùng một hành trình.",
  },
];

const studioNotes = [
  "Lưu nhiều mẫu trong giỏ để so sánh trước khi quyết định.",
  "Tab Đã mua giúp xem lại đơn và mua lại mẫu yêu thích.",
  "Icon thêu có nhiều kiểu đáng yêu, danh sách có thể cuộn gọn gàng.",
  "Trang thành công hiển thị mã đơn và bản tóm tắt dễ kiểm tra.",
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero-sheen overflow-hidden border-b border-[#eadfd6]">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="animate-fade-up">
            <p className="mb-4 text-sm font-bold uppercase text-[#9a6b36]">
              Lenth Custom Bag
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight sm:text-7xl">
              Tự thiết kế chiếc túi mang dấu ấn riêng.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5c473a]">
              Chọn dáng túi, chất liệu, màu sắc, thêm chữ thêu và icon bằng canvas.
              Mọi lựa chọn được ghi nhớ để bạn quay lại chỉnh tiếp bất cứ lúc nào.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/step1-form?fresh=1"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#432719] px-6 py-3 font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-lg"
              >
                Bắt đầu custom
                <ArrowRight size={21} />
              </Link>
              <Link
                href="/cart"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#432719]/60 bg-white px-6 py-3 font-semibold uppercase text-[#432719] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5eee7]"
              >
                Xem giỏ hàng
                <ShoppingBag size={21} />
              </Link>
            </div>
          </div>

          <div className="animate-float relative mx-auto w-full max-w-xl">
            <div className="absolute inset-8 rounded-full bg-[#c6a43f]/20 blur-3xl" />
            <ProductImage
              form="shoulder"
              material="da-pebble"
              color="trang-be"
              className="relative shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="animate-fade-up rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-5 grid size-12 place-items-center rounded-full bg-[#432719] text-white">
                  <Icon size={22} />
                </div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-3 leading-7 text-[#5c473a]">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-6 shadow-sm lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
          <div className="animate-fade-up">
            <p className="text-sm font-bold uppercase text-[#9a6b36]">
              Studio notes
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold">
              Một hành trình đặt túi gọn gàng từ ý tưởng đến giỏ hàng.
            </h2>
            <p className="mt-4 leading-7 text-[#5c473a]">
              Bạn có thể thử nhiều mẫu, thêm vào giỏ, chọn hộp quà, thanh toán và
              lưu lại đơn đã mua để xem lại khi cần.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {studioNotes.map((note, index) => (
              <div
                key={note}
                className="animate-fade-up rounded-lg bg-[#f7f1eb] p-4 text-[#4a392f]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="mb-3 grid size-8 place-items-center rounded-full bg-[#432719] text-sm font-bold text-white">
                  {index + 1}
                </span>
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-[#9a6b36]">
              Form phổ biến
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">Chọn nhanh dáng túi</h2>
          </div>
          <Link href="/step1-form?fresh=1" className="hidden font-semibold text-[#432719] sm:block">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(forms)
            .slice(0, 4)
            .map(([key, item]) => (
              <Link
                key={key}
                href="/step1-form?fresh=1"
                className="group rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-3 transition duration-300 hover:-translate-y-1 hover:border-[#c6a43f] hover:shadow-xl"
              >
                <ProductImage form={key} material="da-pebble" color="trang-be" />
                <div className="mt-4 flex items-center justify-between px-1 pb-2">
                  <span className="font-serif text-xl">{item.name}</span>
                  <span className="text-sm text-[#7a675b]">
                    {formatPrice(item.basePrice)}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
