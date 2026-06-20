import Link from "next/link";
import { ArrowRight, Gem, HeartHandshake, Layers, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/ui/SiteHeader";

const values = [
  { icon: Gem, title: "Dễ chọn", text: "Mỗi bước tập trung vào một quyết định để bạn không bị rối khi custom." },
  { icon: Layers, title: "Nhiều chất liệu", text: "Da Pebble, Saffiano, Canvas, Nylon và nhiều màu túi dễ phối đồ." },
  { icon: ShieldCheck, title: "Giữ thiết kế", text: "Mẫu bạn đang chỉnh được ghi nhớ để quay lại xem hoặc thêm vào giỏ." },
  { icon: HeartHandshake, title: "Quà tặng chỉn chu", text: "Có lựa chọn box quà, túi vải và thiệp để món quà trọn vẹn hơn." },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fdfaf7] min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="animate-fade-up max-w-3xl">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Về Lenth</p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-[#2b1a12]">
            Một góc nhỏ để tự thiết kế túi xách.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5c473a]">
            Lenth ra đời từ một ý tưởng đơn giản: mỗi chiếc túi nên kể một câu chuyện 
            của riêng người dùng — từ tên thêu, màu chỉ, icon nhỏ đến hộp quà chỉn chu 
            cho người nhận.
          </p>
          <Link
            href="/step1-form?fresh=1"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#432719] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#573522]"
          >
            Trải nghiệm ngay <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="animate-fade-up group rounded-xl border border-[#eadfd6] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-[#432719] text-white shadow transition group-hover:scale-110">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-bold text-[#2b1a12]">{item.title}</h2>
                <p className="mt-2 leading-7 text-[#5c473a]">{item.text}</p>
              </article>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl border border-[#eadfd6] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Gợi ý custom</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2b1a12]">Làm sao để có chiếc túi ưng ý nhất?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", text: "Chọn mẫu túi hợp dịp: đi làm, đi chơi, tặng sinh nhật hoặc kỷ niệm." },
              { step: "02", text: "Thêm dấu ấn cá nhân: tên thêu, font chữ, màu chỉ và icon nhỏ." },
              { step: "03", text: "Kiểm tra thành phẩm, chọn hộp quà và hoàn tất đơn hàng." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl bg-[#faf5ee] p-5">
                <div className="text-2xl font-bold text-[#9a6b36]">{item.step}</div>
                <p className="mt-2 leading-relaxed text-[#5c473a]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}