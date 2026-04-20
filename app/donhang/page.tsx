"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderAPI } from "../services/api";

export default function DonHangPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Ban can dang nhap de xem don hang.");
        setLoading(false);
        return;
      }

      try {
        const data = await orderAPI.getMine(token);
        setOrders(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Khong tai duoc don hang",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Dang tai don hang...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Don hang cua toi</h1>
            <p className="mt-2 text-gray-500">Theo doi cac don ban da dat.</p>
          </div>
          <Link
            href="/sanpham"
            className="rounded-2xl bg-amber-600 px-5 py-3 font-medium text-white"
          >
            Dat them tour
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow">
            Chua co don hang nao.
          </div>
        )}

        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-6 shadow">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Ma don: {order.orderId || order._id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                    {order.orderStatus}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.variantName || "Goi mac dinh"} • SL: {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-amber-600">
                      {item.total.toLocaleString("vi-VN")} d
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-right text-xl font-bold text-gray-900">
                Tong cong:{" "}
                <span className="text-amber-600">
                  {order.totalPrice.toLocaleString("vi-VN")} d
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
