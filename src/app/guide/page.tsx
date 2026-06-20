import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/ui/SiteHeader";

const steps = [
  { title: "Chọn kiểu dáng", desc: "Chọn form túi và xem mức giá nền. Nhấn Tiếp theo để sang bước tiếp." },
  { title: "Chọn chất liệu", desc: "Lướt qua bộ sưu tập da và vải. Mỗi chất liệu có ảnh và mô tả riêng." },
  { title: "Chọn màu sắc", desc: "Chọn màu phù hợp với chất liệu bạn đã chọn. Giá tự động cập nhật." },
  { title: "Thiết kế & trang trí", desc: "Thêm chữ thêu, chọn font, màu chỉ và icon trên canvas trực quan." },
  { title: "Xem thành phẩm", desc: "Xem lại thiết kế hoàn chỉnh trước khi qua bước tiếp theo." },
  { title: "Chọn hộp quà", desc: "Chọn gói quà kèm túi vải, thiệp. Nhấn để thêm mẫu vào giỏ hàng." },
  { title: "Thanh toán", desc: "Điền thông tin giao hàng, chọn phương thức thanh toán và hoàn tất đơn." },
];

const faqs = [
  { q: "Thiết kế có mất khi refresh không?", a: "Không. Lựa chọn gần nhất được ghi nhớ để bạn quay lại chỉnh tiếp bất cứ lúc nào." },
  { q: "Có thêm nhiều mẫu vào giỏ được không?", a: "Có. Mỗi lần qua bước Gói quà, một mẫu mới được thêm vào giỏ để bạn so sánh." },
  { q: "Có tải thiết kế về được không?", a: "Có. Bạn có thể tải ảnh PNG thiết kế hoặc hóa đơn JSON sau khi hoàn tất đơn." },
];

export default function GuidePage() {
  return (
    <main className="bg-[#fdfaf7] min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="animate-fade-up text-center">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Hướng dẫn</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-[#2b1a12]">Custom túi trong 7 bước.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#5c473a]">
            Mỗi bước được thiết kế để bạn tập trung vào một quyết định duy nhất — 
            không rối, không vội.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="animate-fade-up flex gap-4 rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#432719] text-sm font-bold text-white">
                {index + 1}
              </div>
              <div>
                <div className="font-bold text-[#2b1a12]">{step.title}</div>
                <p className="mt-1 text-[#5c473a]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/step1-form?fresh=1"
            className="inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-[#432719] px-8 py-3 text-sm font-semibold uppercase text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-xl"
          >
            Bắt đầu ngay <ArrowRight size={18} />
          </Link>
        </div>

        <section className="mt-14 rounded-2xl border border-[#eadfd6] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Câu hỏi thường gặp</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2b1a12]">FAQ nhanh</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-xl bg-[#faf5ee] p-5">
                <CheckCircle2 size={18} className="text-[#9a6b36]" />
                <h3 className="mt-2 font-bold text-[#2b1a12]">{item.q}</h3>
                <p className="mt-2 leading-7 text-[#5c473a]">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}