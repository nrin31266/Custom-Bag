import { Gem, HeartHandshake, Layers, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/ui/SiteHeader";

const values = [
  { icon: Gem, title: "Dễ chọn", text: "Mỗi bước tập trung vào một quyết định để bạn không bị rối khi custom." },
  { icon: Layers, title: "Nhiều chất liệu", text: "Da Pebble, Saffiano, Canvas, Nylon và nhiều màu túi dễ phối đồ." },
  { icon: ShieldCheck, title: "Giữ thiết kế", text: "Mẫu bạn đang chỉnh được ghi nhớ để quay lại xem hoặc thêm vào giỏ." },
  { icon: HeartHandshake, title: "Quà tặng chỉn chu", text: "Có lựa chọn box quà, túi vải và thiệp để món quà trọn vẹn hơn." },
];

const roadmap = [
  "Chọn mẫu túi hợp dịp: đi làm, đi chơi, tặng sinh nhật hoặc kỷ niệm.",
  "Thêm dấu ấn cá nhân bằng tên thêu, font chữ, màu chỉ và icon nhỏ.",
  "Kiểm tra lại thành phẩm, chọn hộp quà và lưu đơn để tiện theo dõi.",
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="animate-fade-up max-w-3xl">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Về Lenth</p>
          <h1 className="mt-3 font-serif text-5xl font-bold">Một góc nhỏ để tự thiết kế túi xách.</h1>
          <p className="mt-5 text-lg leading-8 text-[#5c473a]">
            Lenth giúp bạn biến một chiếc túi quen thuộc thành món đồ có câu chuyện
            riêng: tên thêu, màu chỉ, icon nhỏ và hộp quà chỉn chu cho người nhận.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="animate-fade-up rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Icon className="mb-5 text-[#9a6b36]" size={30} />
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-3 leading-7 text-[#5c473a]">{item.text}</p>
              </article>
            );
          })}
        </div>

        <section className="mt-10 rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Roadmap đại khái</p>
          <h2 className="mt-2 font-serif text-3xl font-bold">
            Gợi ý để custom đẹp hơn.
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {roadmap.map((item, index) => (
              <div key={item} className="rounded-lg bg-[#f7f1eb] p-5">
                <div className="mb-4 text-3xl font-bold text-[#9a6b36]">
                  0{index + 1}
                </div>
                <p className="leading-7 text-[#5c473a]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
