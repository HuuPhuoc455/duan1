"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/slices/cartslices";
import { cartAPI, orderAPI } from "../services/api";

type CheckoutItem = {
  _id: string;
  name: string;
  quantity: number;
  cartItemId: string;
  selectedVariant?: {
    _id: string;
    name: string;
    price: number;
    sale: number;
    duration: string;
    img: string;
  };
};

const initialForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  paymentMethod: "cod",
  note: "",
};

export default function ThanhToanPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items) as CheckoutItem[];
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");
  const [error, setError] = useState("");

  const normalizedItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const variant = item.selectedVariant;
          if (!variant?._id) {
            return null;
          }

          return {
            cartItemId: item.cartItemId,
            productId: item._id,
            variantId: variant._id,
            name: item.name,
            quantity: Number(item.quantity || 1),
            price: Number(variant.price || 0),
            sale: Number(variant.sale || 0),
            image: variant.img,
            variantName: variant.name,
            duration: variant.duration,
          };
        })
        .filter(Boolean),
    [cartItems],
  );

  const totalAmount = useMemo(
    () =>
      normalizedItems.reduce(
        (sum: number, item: any) => sum + item.sale * item.quantity,
        0,
      ),
    [normalizedItems],
  );

  const totalQuantity = useMemo(
    () =>
      normalizedItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      ),
    [normalizedItems],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!normalizedItems.length) {
      setError("Gio hang dang trong, chua the thanh toan.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      const order = await orderAPI.create(
        {
          ...form,
          items: normalizedItems,
        },
        token || undefined,
      );

      dispatch(clearCart());

      if (token) {
        await cartAPI.clearCart(token);
      }

      setSuccessOrderId(order.orderId || order._id);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Thanh toan that bai",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!cartItems.length && !successOrderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-4xl font-bold text-gray-900">
            Chua co tour de thanh toan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Ban hay them tour vao gio hang truoc khi tao don nhe.
          </p>
          <Link
            href="/sanpham"
            className="mt-8 inline-block rounded-3xl bg-amber-600 px-8 py-4 font-semibold text-white hover:bg-amber-700"
          >
            Xem tour ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900">Thanh toan</h1>
            <p className="mt-3 text-gray-500">
              Dien thong tin de tao don hang va luu du lieu thong ke.
            </p>

            {successOrderId && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
                Dat tour thanh cong. Ma don cua ban la <strong>{successOrderId}</strong>.
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ho va ten
                </label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-500"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    So dien thoai
                  </label>
                  <input
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dia chi
                </label>
                <input
                  name="customerAddress"
                  value={form.customerAddress}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phuong thuc thanh toan
                </label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-500"
                >
                  <option value="cod">Thanh toan khi xac nhan</option>
                  <option value="bank_transfer">Chuyen khoan</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ghi chu
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-amber-700 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Dang xu ly don hang..." : "Xac nhan thanh toan"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-8 rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">Don hang cua ban</h2>
            <div className="mt-6 space-y-4">
              {normalizedItems.map((item: any) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                >
                  <img
                    src={`http://localhost:3000/images/${item.image}`}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.variantName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.sale.toLocaleString("vi-VN")} d
                    </p>
                  </div>
                  <div className="text-right font-semibold text-amber-600">
                    {(item.sale * item.quantity).toLocaleString("vi-VN")} d
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="space-y-3 text-lg">
              <div className="flex justify-between text-gray-600">
                <span>Tong so khach</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900">
                <span>Tong thanh toan</span>
                <span className="text-amber-600">
                  {totalAmount.toLocaleString("vi-VN")} d
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
