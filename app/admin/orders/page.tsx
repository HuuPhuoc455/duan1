"use client";

import { useEffect, useState } from "react";
import { orderAPI } from "../../services/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await orderAPI.getAll(token);
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

  const handleUpdateOrder = async (
    id: string,
    field: "orderStatus" | "paymentStatus",
    value: string,
  ) => {
    try {
      const token = localStorage.getItem("token") || "";
      setSavingId(`${id}-${field}`);
      const updatedOrder = await orderAPI.update(id, { [field]: value }, token);
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updatedOrder : order)),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Khong cap nhat duoc don hang",
      );
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Dang tai don hang...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quan ly don hang</h1>
          <p className="mt-2 text-gray-500">
            Admin co the cap nhat trang thai don va thanh toan ngay tai day.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Ma don</th>
                <th className="px-4 py-3">Khach hang</th>
                <th className="px-4 py-3">Lien he</th>
                <th className="px-4 py-3">SL</th>
                <th className="px-4 py-3">Tong tien</th>
                <th className="px-4 py-3">Trang thai don</th>
                <th className="px-4 py-3">Thanh toan</th>
                <th className="px-4 py-3">Ngay tao</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {order.orderId || order._id}
                  </td>
                  <td className="px-4 py-3">{order.customerInfo?.name}</td>
                  <td className="px-4 py-3">
                    <div>{order.customerInfo?.email}</div>
                    <div className="text-gray-500">{order.customerInfo?.phone}</div>
                  </td>
                  <td className="px-4 py-3">{order.totalQuantity}</td>
                  <td className="px-4 py-3 font-semibold text-amber-600">
                    {order.totalPrice.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleUpdateOrder(
                          order._id,
                          "orderStatus",
                          e.target.value,
                        )
                      }
                      disabled={savingId === `${order._id}-orderStatus`}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handleUpdateOrder(
                          order._id,
                          "paymentStatus",
                          e.target.value,
                        )
                      }
                      disabled={savingId === `${order._id}-paymentStatus`}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      <option value="unpaid">unpaid</option>
                      <option value="paid">paid</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
