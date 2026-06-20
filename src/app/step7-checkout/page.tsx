"use client";

import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CreditCard,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import prices from "@/data/prices.json";
import giftbox from "@/data/giftbox.json";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { createCartItem, getCartItemsTotal, stripHeavyDesignData } from "@/lib/cartUtils";
import { EMAIL_REGEX, PHONE_REGEX } from "@/lib/constants";
import {
  calculateBagPrice,
  calculateCustomizationFee,
  calculateTotal,
  createLocalId,
  formatPrice,
  getDisplayName,
} from "@/lib/utils";
import {
  fetchVietnamProvinces,
  fetchVietnamWards,
  getShippingFeeByProvinceCode,
  type Province,
  type Ward,
} from "@/lib/vnRegionApi";
import {
  cartItemsAtom,
  colorAtom,
  customerInfoAtom,
  designDataAtom,
  formTypeAtom,
  giftBoxAtom,
  lastOrderAtom,
  materialAtom,
  paymentMethodAtom,
  shippingFeeAtom,
  shippingProvinceCodeAtom,
  purchasedOrdersAtom,
} from "@/stores/customizationStore";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  provinceCode: string;
  wardCode: string;
  wardName: string;
  note: string;
};

const paymentOptions = [
  {
    value: "card",
    title: "Đặt hàng ngay bằng thẻ",
    description: "Visa, MasterCard, JCB, ATM nội địa",
    icon: CreditCard,
  },
  {
    value: "wallet",
    title: "Ví điện tử",
    description: "Momo, ZaloPay, ShopeePay, VNPay",
    icon: Wallet,
  },
  {
    value: "cod",
    title: "Đặt hàng ngay khi nhận hàng (COD)",
    description: "Đặt hàng ngay bằng tiền mặt khi nhận hàng",
    icon: Banknote,
  },
];

export default function Step7CheckoutPage() {
  const router = useRouter();
  const navigation = useStepNavigation();
  const formType = useAtomValue(formTypeAtom);
  const material = useAtomValue(materialAtom);
  const color = useAtomValue(colorAtom);
  const giftBox = useAtomValue(giftBoxAtom);
  const designData = useAtomValue(designDataAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [customerInfo, setCustomerInfo] = useAtom(customerInfoAtom);
  const [paymentMethod, setPaymentMethod] = useAtom(paymentMethodAtom);
  const [, setLastOrder] = useAtom(lastOrderAtom);
  const [, setPurchasedOrders] = useAtom(purchasedOrdersAtom);
  const [shippingProvinceCode, setShippingProvinceCode] = useAtom(shippingProvinceCodeAtom);
  const [shippingFee, setShippingFee] = useAtom(shippingFeeAtom);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wardResult, setWardResult] = useState<{
    provinceCode: string;
    items: Ward[];
  }>({ provinceCode: "", items: [] });
  const [regionError, setRegionError] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(Boolean(customerInfo.provinceCode));
  const [loadingShippingFee, setLoadingShippingFee] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const bagPrice = calculateBagPrice(formType, material, color);
  const currentTotal = calculateTotal(
    formType,
    material,
    color,
    giftBox,
    designData,
  );
  const customizationFee = calculateCustomizationFee(designData);
  const checkoutTotal = cartItems.length > 0 ? getCartItemsTotal(cartItems) + shippingFee : currentTotal + shippingFee;
  const summaryItems =
    cartItems.length > 0
      ? cartItems
      : [
          {
            id: "current-design",
            form: formType,
            material,
            color,
            giftBox,
            designData,
            total: currentTotal,
          },
        ];
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    shouldUnregister: true,
    defaultValues: {
      fullName: customerInfo.fullName,
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      provinceCode: customerInfo.provinceCode,
      wardCode: customerInfo.wardCode,
      wardName: customerInfo.ward,
      note: customerInfo.note,
    },
  });
  const selectedProvinceCode = useWatch({
    control,
    name: "provinceCode",
  });
  const wards =
    wardResult.provinceCode === selectedProvinceCode ? wardResult.items : [];
  const useManualWardInput =
    Boolean(selectedProvinceCode) && !loadingWards && wards.length === 0;

  useEffect(() => {
    let active = true;

    if (!selectedProvinceCode) {
      if (active) {
        setShippingFee(0);
        setShippingProvinceCode("");
      }
      return () => {
        active = false;
      };
    }

    setLoadingShippingFee(true);
    getShippingFeeByProvinceCode(selectedProvinceCode)
      .then((fee) => {
        if (!active) return;
        const shippingAmount = fee ?? 0;
        setShippingFee(shippingAmount);
        setShippingProvinceCode(selectedProvinceCode);
      })
      .catch(() => {
        if (!active) return;
        setShippingFee(0);
        setShippingProvinceCode("");
      })
      .finally(() => {
        if (active) setLoadingShippingFee(false);
      });

    return () => {
      active = false;
    };
  }, [selectedProvinceCode, setShippingFee, setShippingProvinceCode]);

  useEffect(() => {
    let active = true;

    fetchVietnamProvinces()
      .then((items) => {
        if (!active) return;
        setProvinces(items);
        setRegionError("");
      })
      .catch(() => {
        if (!active) return;
        setRegionError("Chưa tải được danh sách tỉnh/thành. Vui lòng thử lại.");
      })
      .finally(() => {
        if (active) setLoadingProvinces(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!selectedProvinceCode) {
      return () => {
        active = false;
      };
    }

    fetchVietnamWards(selectedProvinceCode)
      .then((items) => {
        if (!active) return;
        setWardResult({ provinceCode: selectedProvinceCode, items });
        setRegionError(
          items.length === 0
            ? "API chưa có phường/xã cho tỉnh này. Bạn nhập phường/xã thủ công để tiếp tục đặt hàng."
            : "",
        );
      })
      .catch(() => {
        if (!active) return;
        setRegionError("Chưa tải được danh sách phường/xã. Vui lòng thử lại.");
      })
      .finally(() => {
        if (active) setLoadingWards(false);
      });

    return () => {
      active = false;
    };
  }, [selectedProvinceCode, setValue]);

  const onSubmit = async (values: CheckoutForm) => {
    setSubmitError("");
    const provinceCodeNum = Number(values.provinceCode);
    const wardCodeNum = Number(values.wardCode);
    const selectedProvince = provinces.find(
      (province) => province.code === provinceCodeNum,
    );
    const selectedWard = wards.find((ward) => ward.code === wardCodeNum);
    const wardName = selectedWard?.name ?? values.wardName.trim();
    const normalizedCustomer = {
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      address: values.address,
      province: selectedProvince?.name ?? values.provinceCode,
      provinceCode: values.provinceCode,
      district: "",
      ward: wardName,
      wardCode: selectedWard?.code.toString() ?? "",
      note: values.note,
    };
    setCustomerInfo(normalizedCustomer);
    const checkoutItems =
      cartItems.length > 0
        ? cartItems
        : [
            createCartItem({
              form: formType,
              material,
              color,
              giftBox,
              designData,
            }),
          ];
    const total = getCartItemsTotal(checkoutItems);

    const orderId = createLocalId("order");
    const createdAt = new Date().toISOString();
    const localOrder = {
      id: orderId,
      customer: normalizedCustomer,
      paymentMethod,
      product: {
        form: formType,
        material,
        color,
        giftBox,
      },
      items: checkoutItems.map(stripHeavyDesignData),
      design: designData,
      pricing: {
        bagPrice,
        shippingFee: shippingFee,
        giftBoxFee: giftBox ? giftbox.fee : 0,
        customizationFee: customizationFee.total,
        total,
      },
    };

    try {
      window.localStorage.setItem("lenth_order_latest", JSON.stringify({
        id: orderId,
        total,
        status: "saved",
        createdAt,
        itemCount: checkoutItems.length,
      }));

      setLastOrder({
        id: orderId,
        total,
        status: "saved",
        createdAt,
      });
      setPurchasedOrders((orders) =>
        [
          {
            id: orderId,
            items: checkoutItems.map(stripHeavyDesignData),
            customer: normalizedCustomer,
            paymentMethod,
            total,
            status: "saved" as const,
            createdAt,
          },
          ...orders,
        ].slice(0, 20),
      );
      if (cartItems.length > 0) {
        setCartItems([]);
      }

      router.push(`/success?orderId=${encodeURIComponent(orderId)}`);
    } catch {
      setSubmitError(
        "Chưa lưu được đơn trên trình duyệt. Bạn thử xoá bớt đơn cũ trong giỏ hoặc tải lại trang rồi đặt lại.",
      );
    }
  };

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="custom-flow-screen mx-auto max-w-6xl px-4 py-8 sm:px-6"
      >
        <div className="mb-7 text-center">
          <h1 className="font-serif text-3xl font-bold uppercase sm:text-4xl">
            Đặt hàng ngay
          </h1>
          <p className="mt-3 text-[#4a392f]">
            Điền thông tin nhận hàng và chọn cách thanh toán bạn muốn
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.25fr]">
          <section className="rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 sm:p-6 lg:order-2">
            <h2 className="mb-5 text-lg font-bold uppercase">
              Thông tin giao hàng
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="font-medium">Họ và tên *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#ddd0c8] px-3 outline-none focus:border-[#c6a43f]"
                  placeholder="Nhập họ và tên"
                  {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                />
                {errors.fullName && (
                  <span className="text-sm text-red-600">
                    {errors.fullName.message}
                  </span>
                )}
              </label>
              <label className="space-y-2">
                <span className="font-medium">Số điện thoại *</span>
                <input
                  className="h-11 w-full rounded-md border border-[#ddd0c8] px-3 outline-none focus:border-[#c6a43f]"
                  placeholder="Nhập số điện thoại"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: PHONE_REGEX,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                />
                {errors.phone && (
                  <span className="text-sm text-red-600">{errors.phone.message}</span>
                )}
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="font-medium">Email</span>
                <input
                  className="h-11 w-full rounded-md border border-[#ddd0c8] px-3 outline-none focus:border-[#c6a43f]"
                  placeholder="Nhập email"
                  {...register("email", {
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-sm text-red-600">{errors.email.message}</span>
                )}
              </label>
              <label className="space-y-2">
                <span className="font-medium">Tỉnh / Thành phố *</span>
                <select
                  className="h-11 w-full rounded-md border border-[#ddd0c8] bg-white px-3 outline-none focus:border-[#c6a43f]"
                  disabled={loadingProvinces}
                  {...register("provinceCode", {
                    required: "Vui lòng chọn tỉnh/thành phố",
                    onChange: (event) => {
                      setValue("wardCode", "");
                      setValue("wardName", "");
                      setLoadingWards(Boolean(event.target.value));
                    },
                  })}
                >
                  <option value="">
                    {loadingProvinces ? "Đang tải tỉnh/thành..." : "Chọn tỉnh/thành"}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.provinceCode && (
                  <span className="text-sm text-red-600">
                    {errors.provinceCode.message}
                  </span>
                )}
              </label>
              {useManualWardInput ? (
                <label className="space-y-2">
                  <span className="font-medium">Phường / Xã *</span>
                  <input
                    className="h-11 w-full rounded-md border border-[#ddd0c8] bg-white px-3 outline-none focus:border-[#c6a43f]"
                    placeholder="Nhập phường/xã của bạn"
                    {...register("wardName", {
                      required: "Vui lòng nhập phường/xã",
                    })}
                  />
                  {errors.wardName && (
                    <span className="text-sm text-red-600">
                      {errors.wardName.message}
                    </span>
                  )}
                </label>
              ) : (
                <label className="space-y-2">
                  <span className="font-medium">Phường / Xã *</span>
                  <select
                    className="h-11 w-full rounded-md border border-[#ddd0c8] bg-white px-3 outline-none focus:border-[#c6a43f] disabled:bg-[#f7f1eb]"
                    disabled={!selectedProvinceCode || loadingWards}
                    {...register("wardCode", {
                      required: "Vui lòng chọn phường/xã",
                    })}
                  >
                    <option value="">
                      {!selectedProvinceCode
                        ? "Chọn tỉnh/thành trước"
                        : loadingWards
                          ? "Đang tải phường/xã..."
                          : "Chọn phường/xã"}
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  {errors.wardCode && (
                    <span className="text-sm text-red-600">
                      {errors.wardCode.message}
                    </span>
                  )}
                </label>
              )}
              <label className="space-y-2 sm:col-span-2">
                <span className="font-medium">Địa chỉ nhận hàng (số nhà, tên đường)</span>
                <input
                  className="h-11 w-full rounded-md border border-[#ddd0c8] px-3 outline-none focus:border-[#c6a43f]"
                  placeholder="Nhập địa chỉ nhận hàng"
                  {...register("address")}
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="font-medium">Ghi chú</span>
                <textarea
                  className="w-full rounded-md border border-[#ddd0c8] px-3 py-3 outline-none focus:border-[#c6a43f] resize-none"
                  placeholder="Nhập ghi chú nếu có"
                  rows={3}
                  {...register("note")}
                />
              </label>
              {regionError && (
                <p className="rounded-md bg-[#fff4d9] p-3 text-sm font-medium text-[#7d4f2d] sm:col-span-2">
                  {regionError}
                </p>
              )}
            </div>

            <h2 className="mb-4 mt-7 text-lg font-bold uppercase">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentMethod(option.value)}
                    className={`flex w-full items-center gap-4 rounded-md border p-4 text-left transition ${
                      paymentMethod === option.value
                        ? "border-[#432719] bg-[#f7f1eb] shadow-[0_0_0_3px_rgba(198,164,63,0.18)]"
                        : "border-[#eadfd6] hover:border-[#c6a43f]"
                    }`}
                  >
                    <span className="grid size-5 place-items-center rounded-full border border-[#d8c9bc]">
                      {paymentMethod === option.value && (
                        <span className="size-3 rounded-full bg-[#432719]" />
                      )}
                    </span>
                    <Icon className="shrink-0" />
                    <span>
                      <span className="block font-semibold">{option.title}</span>
                      <span className="text-sm text-[#6d5b50]">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-5 shadow-[0_18px_50px_rgba(67,39,25,0.12)] sm:p-6 lg:order-1 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="mb-5 text-lg font-bold uppercase">Tóm tắt đơn hàng</h2>
            <div className="flex gap-4">
              {cartItems.length > 0 && cartItems[0]?.designData.previewDataUrl ? (
                <div
                  className="aspect-[3/2] h-32 shrink-0 rounded-md bg-[#eee9e3] bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${cartItems[0].designData.previewDataUrl})`,
                  }}
                />
              ) : designData.previewDataUrl ? (
                <div
                  className="aspect-[3/2] h-32 shrink-0 rounded-md bg-[#eee9e3] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${designData.previewDataUrl})` }}
                />
              ) : (
                <ProductImage
                  form={formType}
                  material={material}
                  color={color}
                  className="size-32 shrink-0"
                />
              )}
              <div className="pt-2">
                <div className="font-semibold">
                  {cartItems.length > 0
                    ? `${cartItems.length} mẫu túi trong giỏ`
                    : getDisplayName("form", formType)}
                </div>
                <div className="mt-2 text-sm text-[#4a392f]">
                  {cartItems.length > 0
                    ? "Đặt hàng ngay toàn bộ giỏ hàng"
                    : `${getDisplayName("material", material)} - ${getDisplayName("color", color)}`}
                </div>
                <div className="mt-2 text-sm text-[#4a392f]">
                  {cartItems.length > 0
                    ? "Sau khi đặt, giỏ sẽ được chuyển sang tab Đã mua"
                    : `${designData.texts.length} cụm chữ, ${designData.icons.length} icon`}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 rounded-lg bg-[#f7f1eb] p-4">
              <h3 className="font-bold uppercase">Chi tiết custom</h3>
              {summaryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-md border border-[#eadfd6] bg-[#fffdfb] p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold">
                        {cartItems.length > 0
                          ? `Mẫu ${index + 1}: ${getDisplayName("form", item.form)}`
                          : getDisplayName("form", item.form)}
                      </div>
                      <div className="mt-1 text-[#5c473a]">
                        {getDisplayName("material", item.material)} -{" "}
                        {getDisplayName("color", item.color)}
                      </div>
                    </div>
                    <div className="font-bold">{formatPrice(item.total)}</div>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-[#4a392f]">
                    <div className="col-span-2">
                      <dt className="font-semibold">Chữ thêu</dt>
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
                      <dt className="font-semibold">Icon</dt>
                      <dd>{item.designData.icons.length} icon</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Box quà</dt>
                      <dd>{item.giftBox ? "Có" : "Không"}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-[#eadfd6] pt-5">
              <div className="flex justify-between">
                <span>{cartItems.length > 0 ? "Tổng các mẫu trong giỏ" : "Giá túi"}</span>
                <span>{formatPrice(cartItems.length > 0 ? checkoutTotal : bagPrice)}</span>
              </div>
              {cartItems.length === 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Chữ & icon</span>
                    <span>+{formatPrice(customizationFee.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Box quà</span>
                    <span>{giftBox ? `+${formatPrice(giftbox.fee)}` : "0đ"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>
                      {shippingProvinceCode ? (
                        loadingShippingFee ? (
                          <span className="text-sm text-[#9a6b36]">Đang tính...</span>
                        ) : (
                          formatPrice(shippingFee)
                        )
                      ) : (
                        <span className="text-sm text-[#9a6b36]">Chọn tỉnh để tính phí</span>
                      )}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>
                  {shippingProvinceCode ? (
                    loadingShippingFee ? (
                      <span className="text-sm text-[#9a6b36]">Đang tính...</span>
                    ) : (
                      formatPrice(shippingFee)
                    )
                  ) : (
                    <span className="text-sm text-[#9a6b36]">Chọn tỉnh để tính phí</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#eadfd6] pt-5 text-xl font-bold">
                <span>Tổng cộng</span>
                <span>{formatPrice(checkoutTotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4 rounded-md bg-[#f7f1eb] p-4">
              <ShieldCheck className="shrink-0" />
              <p className="text-sm text-[#4a392f]">
                Lenth giữ thông tin đơn hàng cẩn thận và chỉ dùng để xác nhận,
                đóng gói, giao món quà đến đúng địa chỉ.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={navigation.goBack}>
            <ArrowLeft size={22} />
            Quay lại
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xác nhận..." : "Đặt hàng ngay"}
            <ArrowRight size={22} />
          </Button>
        </div>
        {submitError && (
          <p className="mt-4 rounded-md bg-[#fff4d9] p-3 text-sm font-medium text-[#7d4f2d]">
            {submitError}
          </p>
        )}
      </form>
    </main>
  );
}
