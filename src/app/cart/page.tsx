"use client";

import Link from "next/link";
import { useAtom, useAtomValue } from "jotai";
import { ArrowRight, Clock, Download, History, Pencil, ShoppingBag, Trash2 } from "lucide-react";
import giftbox from "@/data/giftbox.json";
import { ProductImage } from "@/components/ui/ProductImage";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { Button } from "@/components/ui/Button";
import { createCartItem, getCartItemsTotal } from "@/lib/cartUtils";
import { cn, formatPrice, getDisplayName } from "@/lib/utils";
import { getColorName, getSubOption } from "@/lib/productCatalog";
import {
  canceledOrdersAtom,
  cartItemsAtom,
  colorAtom,
  designDataAtom,
  formTypeAtom,
  giftBoxAtom,
  materialAtom,
  purchasedOrdersAtom,
} from "@/stores/customizationStore";
import { useState } from "react";

type CartTab = "cart" | "purchased" | "canceled";

export default function CartPage() {
  const form = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const giftBox = useAtomValue(giftBoxAtom);
  const designData = useAtomValue(designDataAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [purchasedOrders, setPurchasedOrders] = useAtom(purchasedOrdersAtom);
  const [canceledOrders, setCanceledOrders] = useAtom(canceledOrdersAtom);
  const [activeTab, setActiveTab] = useState<CartTab>("cart");
  const cartTotal = getCartItemsTotal(cartItems);

  const addCurrentDesign = () => {
    setCartItems((items) => [
      createCartItem({ form, material, color, giftBox, designData }),
      ...items,
    ]);
  };

  const removeCartItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const buyAgain = (order: { items: typeof cartItems }) => {
    setCartItems((items) => [...order.items, ...items]);
    setActiveTab("cart");
  };

  const cancelOrder = (orderId: string) => {
    const order = purchasedOrders.find((item) => item.id === orderId);
    if (!order) return;

    setPurchasedOrders((orders) => orders.filter((item) => item.id !== orderId));
    setCanceledOrders((orders) => [
      {
        ...order,
        status: "canceled",
        canceledAt: new Date().toISOString(),
        cancelReason: "Khách hàng hủy từ giỏ hàng",
      },
      ...orders,
    ]);
    setActiveTab("canceled");
  };

  const downloadReceipt = (
    order:
      | (typeof purchasedOrders)[number]
      | (typeof canceledOrders)[number],
  ) => {
    const anchor = document.createElement("a");
    const blob = new Blob([JSON.stringify(order, null, 2)], {
      type: "application/json",
    });
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `lenth-order-${order.id}.json`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="animate-fade-up mb-8">
          <p className="text-sm font-bold uppercase text-[#9a6b36]">Giỏ hàng</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">
            Túi đã chọn, đơn đã mua và đơn đã hủy
          </h1>
          <p className="mt-3 max-w-2xl text-[#5c473a]">
            Bạn có thể giữ nhiều mẫu túi trong giỏ, xóa từng mẫu khỏi giỏ mà không
            làm mất thiết kế đang chỉnh. Đơn đã hủy được tách riêng để bạn kiểm tra lại.
          </p>
        </div>

        <div className="mb-6 inline-grid rounded-full border border-[#eadfd6] bg-[#fffdfb] p-1 shadow-sm sm:grid-cols-3">
          {[
            { value: "cart" as const, label: `Giỏ hàng (${cartItems.length})`, icon: ShoppingBag },
            {
              value: "purchased" as const,
              label: `Đã mua (${purchasedOrders.length})`,
              icon: History,
            },
            {
              value: "canceled" as const,
              label: `Đã hủy (${canceledOrders.length})`,
              icon: Trash2,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition",
                  activeTab === tab.value
                    ? "bg-[#432719] text-white shadow-md"
                    : "text-[#5c473a] hover:bg-[#f7f1eb]",
                )}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "cart" ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <article className="animate-fade-up rounded-xl border border-dashed border-[#c6a43f] bg-[#fffdfb] p-6 text-center shadow-sm">
                  <ShoppingBag className="mx-auto mb-4 text-[#9a6b36]" size={42} />
                  <h2 className="font-serif text-2xl font-bold">Giỏ hàng đang trống</h2>
                  <p className="mx-auto mt-3 max-w-xl text-[#5c473a]">
                    Nếu bạn vừa thiết kế xong, hãy thêm mẫu hiện tại vào giỏ để
                    giữ lại như một lựa chọn mua hàng riêng.
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button onClick={addCurrentDesign}>
                      <ShoppingBag size={20} />
                      Thêm mẫu hiện tại
                    </Button>
                    <Link
                      href="/step1-form?fresh=1"
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#432719]/60 bg-white px-6 py-3 font-semibold uppercase text-[#432719] transition hover:-translate-y-0.5 hover:bg-[#f5eee7]"
                    >
                      Custom mẫu mới
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </article>
              ) : (
                cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="animate-fade-up rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
                      {item.designData.previewDataUrl ? (
                        <div
                          className="aspect-square rounded-lg bg-[#eee9e3] bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${item.designData.previewDataUrl})`,
                          }}
                        />
                      ) : (
                        <ProductImage
                          form={item.form}
                          material={item.material}
                          color={item.color}
                        />
                      )}

                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="font-serif text-2xl font-bold">
                              {getDisplayName("form", item.form)}
                            </h2>
                            <p className="mt-2 text-[#5c473a]">
                              {getSubOption(item.form, item.material).name} -{" "}
                              {getColorName(item.color)}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#f4eee8] px-4 py-2 font-bold">
                            {formatPrice(item.total)}
                          </span>
                        </div>

                        <dl className="mt-5 grid gap-3 text-sm text-[#4a392f] sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <dt className="font-bold">Chữ thêu</dt>
                            <dd>
                              {item.designData.texts.length
                                ? item.designData.texts
                                    .map(
                                      (text) =>
                                        `${text.text} (${text.fontLabel ?? text.font})`,
                                    )
                                    .join(", ")
                                : "Chưa thêm"}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-bold">Icon</dt>
                            <dd>{item.designData.icons.length} icon</dd>
                          </div>
                          <div>
                            <dt className="font-bold">Box quà</dt>
                            <dd>
                              {item.giftBox
                                ? `Có (+${formatPrice(giftbox.fee)})`
                                : "Không"}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-bold">Đã thêm</dt>
                            <dd>{new Date(item.createdAt).toLocaleString("vi-VN")}</dd>
                          </div>
                        </dl>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href="/step4-design"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#432719]/60 bg-white px-4 py-2 text-sm font-semibold uppercase text-[#432719] transition hover:-translate-y-0.5 hover:bg-[#f5eee7]"
                          >
                            <Pencil size={18} />
                            Chỉnh mẫu đang mở
                          </Link>
                          <Button
                            variant="ghost"
                            onClick={() => removeCartItem(item.id)}
                            className="min-h-11 px-4 text-sm"
                          >
                            <Trash2 size={18} />
                            Xóa khỏi giỏ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <aside className="animate-fade-up h-fit rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-6 shadow-sm">
              <h2 className="text-xl font-bold uppercase">Tóm tắt giỏ hàng</h2>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span>Số mẫu</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>Đã tính trong từng mẫu</span>
                </div>
                <div className="flex justify-between border-t border-[#eadfd6] pt-5 text-2xl font-bold">
                  <span>Tổng</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Link
                href="/step7-checkout"
                className={cn(
                  "mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md px-6 py-3 font-semibold uppercase transition duration-300",
                  cartItems.length > 0
                    ? "bg-[#432719] text-white hover:-translate-y-0.5 hover:bg-[#573522] hover:shadow-lg"
                    : "pointer-events-none bg-[#d8c9bc] text-white",
                )}
              >
                Thanh toán giỏ hàng
                <ArrowRight size={21} />
              </Link>
              <Button onClick={addCurrentDesign} variant="secondary" className="mt-3 w-full">
                <ShoppingBag size={20} />
                Thêm mẫu hiện tại
              </Button>
            </aside>
          </div>
        ) : activeTab === "purchased" ? (
          <div className="space-y-4">
            {purchasedOrders.length === 0 ? (
              <article className="animate-fade-up rounded-xl border border-dashed border-[#c6a43f] bg-[#fffdfb] p-8 text-center shadow-sm">
                <Clock className="mx-auto mb-4 text-[#9a6b36]" size={42} />
                <h2 className="font-serif text-2xl font-bold">Chưa có đơn đã mua</h2>
                <p className="mx-auto mt-3 max-w-xl text-[#5c473a]">
                  Sau khi hoàn tất thanh toán, đơn của bạn sẽ nằm ở đây để xem lại
                  hoặc mua lại mẫu tương tự.
                </p>
              </article>
            ) : (
              purchasedOrders.map((order) => (
                <article
                  key={order.id}
                  className="animate-fade-up rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase text-[#9a6b36]">
                        Mã đơn {order.id}
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-bold">
                        {order.items.length} mẫu túi - {formatPrice(order.total)}
                      </h2>
                      <p className="mt-2 text-[#5c473a]">
                        Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f7f1eb] px-4 py-2 text-sm font-bold">
                      {order.status === "pending" ? "Đang xử lý" : "Đã ghi nhận"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-lg bg-[#f7f1eb] p-3">
                        <div className="flex gap-3">
                          {item.designData.previewDataUrl ? (
                            <div
                              className="size-20 shrink-0 rounded-md bg-[#eee9e3] bg-contain bg-center bg-no-repeat"
                              style={{
                                backgroundImage: `url(${item.designData.previewDataUrl})`,
                              }}
                            />
                          ) : (
                            <ProductImage
                              form={item.form}
                              material={item.material}
                              color={item.color}
                              className="size-20 shrink-0"
                            />
                          )}
                          <div className="text-sm">
                            <div className="font-bold">
                              {getDisplayName("form", item.form)}
                            </div>
                            <div className="mt-1 text-[#5c473a]">
                              {getDisplayName("color", item.color)}
                            </div>
                            <div className="mt-1 font-semibold">
                              {formatPrice(item.total)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => buyAgain(order)}
                      className="min-h-11 px-4 text-sm"
                    >
                      <ShoppingBag size={18} />
                      Mua lại
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => downloadReceipt(order)}
                      className="min-h-11 px-4 text-sm"
                    >
                      <Download size={18} />
                      Tải hóa đơn
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => cancelOrder(order.id)}
                      className="min-h-11 px-4 text-sm"
                    >
                      Hủy đơn
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {canceledOrders.length === 0 ? (
              <article className="animate-fade-up rounded-xl border border-dashed border-[#c6a43f] bg-[#fffdfb] p-8 text-center shadow-sm">
                <Trash2 className="mx-auto mb-4 text-[#9a6b36]" size={42} />
                <h2 className="font-serif text-2xl font-bold">Chưa có đơn đã hủy</h2>
                <p className="mx-auto mt-3 max-w-xl text-[#5c473a]">
                  Khi bạn hủy một đơn đã mua, đơn đó sẽ chuyển vào đây để dễ đối
                  chiếu và có thể mua lại nếu đổi ý.
                </p>
              </article>
            ) : (
              canceledOrders.map((order) => (
                <article
                  key={order.id}
                  className="animate-fade-up rounded-xl border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase text-[#9a6b36]">
                        Mã đơn {order.id}
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-bold">
                        {order.items.length} mẫu túi - {formatPrice(order.total)}
                      </h2>
                      <p className="mt-2 text-[#5c473a]">
                        Hủy lúc {new Date(order.canceledAt).toLocaleString("vi-VN")}
                      </p>
                      <p className="mt-1 text-sm text-[#7a675b]">
                        Lý do: {order.cancelReason}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f7e6df] px-4 py-2 text-sm font-bold text-[#7d3b2d]">
                      Đã hủy
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-lg bg-[#f7f1eb] p-3">
                        <div className="flex gap-3">
                          {item.designData.previewDataUrl ? (
                            <div
                              className="size-20 shrink-0 rounded-md bg-[#eee9e3] bg-contain bg-center bg-no-repeat"
                              style={{
                                backgroundImage: `url(${item.designData.previewDataUrl})`,
                              }}
                            />
                          ) : (
                            <ProductImage
                              form={item.form}
                              material={item.material}
                              color={item.color}
                              className="size-20 shrink-0"
                            />
                          )}
                          <div className="text-sm">
                            <div className="font-bold">
                              {getDisplayName("form", item.form)}
                            </div>
                            <div className="mt-1 text-[#5c473a]">
                              {getDisplayName("color", item.color)}
                            </div>
                            <div className="mt-1 font-semibold">
                              {formatPrice(item.total)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => buyAgain(order)}
                      className="min-h-11 px-4 text-sm"
                    >
                      <ShoppingBag size={18} />
                      Mua lại
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => downloadReceipt(order)}
                      className="min-h-11 px-4 text-sm"
                    >
                      <Download size={18} />
                      Tải thông tin hủy
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
