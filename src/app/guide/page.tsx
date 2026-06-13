import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/ui/SiteHeader";

const steps = [
  "Chọn form túi và mức giá nền.",
  "Chọn chất liệu, màu sắc và xem giá được tính lại.",
  "Thêm chữ, chọn font, màu chỉ và icon trên canvas.",
  "Lưu ảnh preview, JSON canvas và quay lại chỉnh tiếp khi cần.",
  "Chọn box quà, điền thông tin giao hàng và hoàn tất demo đơn.",
];

const faqs = [
  {
    q: "Thiết kế có mất khi refresh không?",
    a: "Không. Lựa chọn gần nhất được ghi nhớ để bạn quay lại chỉnh tiếp.",
  },
  {
    q: "Có thêm nhiều mẫu vào giỏ được không?",
    a: "Có. Mỗi lần thêm vào giỏ là một mẫu riêng, xóa khỏi giỏ không làm mất mẫu đang chỉnh.",
  },
  {
    q: "Có tải thiết kế về được không?",
    a: "Có. Bạn có thể tải ảnh thiết kế hoặc hóa đơn tóm tắt sau khi hoàn tất.",
  },
];

export default function GuidePage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="animate-fade-up text-center">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Cách hoạt động</p>
          <h1 className="mt-3 font-serif text-5xl font-bold">Custom túi trong 7 bước.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5c473a]">
            Mỗi bước được chia nhỏ để bạn tập trung vào một lựa chọn: dáng túi,
            chất liệu, màu sắc, trang trí, hộp quà và thông tin nhận hàng.
          </p>
        </div>

        <ol className="mt-10 space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="animate-fade-up flex gap-4 rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <CheckCircle2 className="mt-1 shrink-0 text-[#9a6b36]" />
              <div>
                <div className="font-bold">Bước {index + 1}</div>
                <p className="mt-1 text-[#5c473a]">{step}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/step1-form?fresh=1"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#432719] px-6 py-3 font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-lg"
          >
            Bắt đầu ngay
            <ArrowRight size={21} />
          </Link>
        </div>

        <section className="mt-12 rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-6 text-left shadow-sm">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">FAQ nhanh</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-lg bg-[#f7f1eb] p-5">
                <h2 className="font-bold">{item.q}</h2>
                <p className="mt-3 leading-7 text-[#5c473a]">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
