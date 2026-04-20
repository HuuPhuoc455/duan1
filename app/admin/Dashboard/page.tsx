"use client";

import { useEffect, useMemo, useState } from "react";
import {
  categoryAPI,
  orderAPI,
  productAPI,
  userAPI,
} from "../../services/api";

type RangeKey = "day" | "week" | "month" | "year";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>("month");
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    customers: 0,
    products: 0,
    categories: 0,
    users: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [categoryChart, setCategoryChart] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [slowSelling, setSlowSelling] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const [ordersRes, productsRes, categoriesRes, usersRes] = await Promise.all([
          orderAPI.getAll(token),
          productAPI.getAll(),
          categoryAPI.getAll(),
          userAPI.getAll(token),
        ]);

        const revenue = ordersRes.reduce(
          (sum: number, order: any) => sum + Number(order.totalPrice || 0),
          0,
        );

        const pendingList = ordersRes
          .filter((order: any) => order.orderStatus === "pending")
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        const soldMap = new Map<string, { name: string; quantity: number; revenue: number }>();
        const categoryMap = new Map<string, { name: string; quantity: number }>();
        const productCategoryMap = new Map<string, string>();
        const categoryNameMap = new Map<string, string>();

        categoriesRes.forEach((category: any) => {
          categoryNameMap.set(category._id, category.name);
        });

        productsRes.forEach((product: any) => {
          const categoryId =
            typeof product.categoryId === "string"
              ? product.categoryId
              : product.categoryId?._id;
          productCategoryMap.set(product._id, categoryId || "unknown");
          if (!soldMap.has(product._id)) {
            soldMap.set(product._id, {
              name: product.name,
              quantity: 0,
              revenue: 0,
            });
          }
        });

        ordersRes.forEach((order: any) => {
          (order.items || []).forEach((item: any) => {
            const key = String(item.productId);
            const current = soldMap.get(key) || {
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
            current.quantity += Number(item.quantity || 0);
            current.revenue += Number(item.total || 0);
            soldMap.set(key, current);

            const categoryId = productCategoryMap.get(key) || "unknown";
            const categoryName = categoryNameMap.get(categoryId) || "Chua phan loai";
            const categoryCurrent = categoryMap.get(categoryId) || {
              name: categoryName,
              quantity: 0,
            };
            categoryCurrent.quantity += Number(item.quantity || 0);
            categoryMap.set(categoryId, categoryCurrent);
          });
        });

        const soldList = Array.from(soldMap.entries()).map(([productId, data]) => ({
          productId,
          ...data,
        }));

        setStats({
          revenue,
          orders: ordersRes.length,
          pendingOrders: pendingList.length,
          completedOrders: ordersRes.filter((o: any) => o.orderStatus === "completed").length,
          customers: new Set(ordersRes.map((o: any) => o.customerInfo?.email).filter(Boolean)).size,
          products: productsRes.length,
          categories: categoriesRes.length,
          users: usersRes.length,
        });
        setOrders(ordersRes);
        setCategoryChart(Array.from(categoryMap.values()).sort((a, b) => b.quantity - a.quantity));
        setTopSelling(soldList.sort((a, b) => b.quantity - a.quantity).slice(0, 5));
        setSlowSelling([...soldList].sort((a, b) => a.quantity - b.quantity).slice(0, 5));
        setPendingOrders(pendingList.slice(0, 6));
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const revenueSeries = useMemo(() => buildRevenueSeries(orders, range), [orders, range]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Dang tai dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-orange-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-orange-200">
                Admin analytics
              </p>
              <h1 className="mt-3 text-4xl font-bold">Thong ke ban hang va doanh thu</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200">
                Dashboard nay doc truc tiep tu collection order trong MongoDB de hien doanh thu,
                san pham ban chay, ban e va cac don dang cho xac nhan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <MetricBadge label="Doanh thu" value={formatCurrency(stats.revenue)} />
              <MetricBadge label="Don hang" value={stats.orders} />
              <MetricBadge label="Cho xac nhan" value={stats.pendingOrders} />
              <MetricBadge label="Khach mua" value={stats.customers} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Tong doanh thu" value={formatCurrency(stats.revenue)} accent="from-emerald-500 to-teal-600" />
          <StatCard title="Tong don hang" value={stats.orders} accent="from-blue-500 to-indigo-600" />
          <StatCard title="Don hoan tat" value={stats.completedOrders} accent="from-violet-500 to-fuchsia-600" />
          <StatCard title="Tai nguyen he thong" value={`${stats.products} tour / ${stats.categories} danh muc / ${stats.users} users`} accent="from-amber-500 to-orange-600" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Doanh thu
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Bieu do cot theo {rangeLabel(range)}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["day", "week", "month", "year"] as RangeKey[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      range === item
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {rangeLabel(item)}
                  </button>
                ))}
              </div>
            </div>
            <RevenueChart data={revenueSeries} />
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Co cau ban hang
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              San pham theo danh muc
            </h2>
            <CategoryDonut data={categoryChart} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ProductRanking
            title="Top san pham ban chay"
            subtitle="Xep hang theo so luong da ban"
            items={topSelling}
            tone="emerald"
          />
          <ProductRanking
            title="Top ban e"
            subtitle="Nhung tour co so luong ban thap nhat"
            items={slowSelling}
            tone="rose"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Pending orders
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Don hang moi nhat cho xac nhan
                </h2>
              </div>
              <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                {stats.pendingOrders} don
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Ma don</th>
                    <th className="px-4 py-3">Khach hang</th>
                    <th className="px-4 py-3">Tong tien</th>
                    <th className="px-4 py-3">Ngay tao</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">{order.orderId}</td>
                      <td className="px-4 py-3">
                        <div>{order.customerInfo?.name}</div>
                        <div className="text-xs text-slate-500">{order.customerInfo?.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                  {pendingOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        Khong co don nao dang cho xac nhan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Quick stats
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Nhung thong ke nho
            </h2>
            <div className="mt-6 space-y-4">
              <MiniStat label="Gia tri don trung binh" value={stats.orders ? formatCurrency(stats.revenue / stats.orders) : formatCurrency(0)} />
              <MiniStat label="So san pham da ban" value={orders.reduce((sum: number, order: any) => sum + Number(order.totalQuantity || 0), 0)} />
              <MiniStat label="Danh muc co doanh so" value={categoryChart.filter((item: any) => item.quantity > 0).length} />
              <MiniStat label="Cap nhat luc" value={new Date().toLocaleTimeString("vi-VN")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-200">{label}</div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function StatCard({ title, value, accent }: { title: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm">
      <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  const max = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <div className="grid h-80 grid-cols-6 gap-3 items-end md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
      {data.map((item) => {
        const height = `${Math.max((item.revenue / max) * 100, item.revenue > 0 ? 10 : 2)}%`;
        return (
          <div key={item.label} className="flex h-full flex-col items-center justify-end gap-3">
            <span className="text-[11px] font-semibold text-slate-500">
              {item.revenue > 0 ? compactCurrency(item.revenue) : "0"}
            </span>
            <div className="flex h-full w-full items-end rounded-3xl bg-slate-100 p-1">
              <div
                className="w-full rounded-[20px] bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-300"
                style={{ height }}
                title={`${item.label}: ${formatCurrency(item.revenue)}`}
              />
            </div>
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CategoryDonut({ data }: { data: { name: string; quantity: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.quantity, 0);
  const colors = ["#f97316", "#0f766e", "#2563eb", "#7c3aed", "#db2777", "#16a34a"];
  let currentAngle = 0;

  const segments = data.slice(0, 6).map((item, index) => {
    const percentage = total > 0 ? item.quantity / total : 0;
    const angle = percentage * 360;
    const segment = `${colors[index]} ${currentAngle}deg ${currentAngle + angle}deg`;
    currentAngle += angle;
    return segment;
  });

  const topCategory = data[0];

  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      <div
        className="relative h-56 w-56 rounded-full"
        style={{
          background: segments.length
            ? `conic-gradient(${segments.join(", ")})`
            : "conic-gradient(#e2e8f0 0deg 360deg)",
        }}
      >
        <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-white text-center">
          <div>
            <p className="text-3xl font-bold text-slate-900">{total}</p>
            <p className="text-sm text-slate-500">san pham da ban</p>
          </div>
        </div>
      </div>
      <div className="w-full space-y-3">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index] }} />
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900">{item.quantity}</span>
          </div>
        ))}
        {!topCategory && (
          <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-slate-400">
            Chua co du lieu danh muc.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRanking({ title, subtitle, items, tone }: any) {
  const toneClass = tone === "rose" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700";

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Product ranking</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-6 space-y-4">
        {items.map((item: any, index: number) => (
          <div key={item.productId} className="flex items-center justify-between rounded-3xl border border-slate-100 px-5 py-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold ${toneClass}`}>
                #{index + 1}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">Doanh thu: {formatCurrency(item.revenue)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">{item.quantity}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">da ban</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function buildRevenueSeries(orders: any[], range: RangeKey) {
  if (range === "year") {
    const yearMap = new Map<number, number>();
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      yearMap.set(year, (yearMap.get(year) || 0) + Number(order.totalPrice || 0));
    });
    return Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, revenue]) => ({ label: String(year), revenue }));
  }

  if (range === "month") {
    const now = new Date();
    const labels = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), index, 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: `T${date.getMonth() + 1}`,
      };
    });
    const map = new Map(labels.map((item) => [item.key, 0]));
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + Number(order.totalPrice || 0));
      }
    });
    return labels.map((item) => ({ label: item.label, revenue: map.get(item.key) || 0 }));
  }

  if (range === "week") {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = new Map(labels.map((item) => [item, 0]));
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const day = labels[(date.getDay() + 6) % 7];
      map.set(day, (map.get(day) || 0) + Number(order.totalPrice || 0));
    });
    return labels.map((label) => ({ label, revenue: map.get(label) || 0 }));
  }

  const labels = Array.from({ length: 31 }, (_, index) => `${index + 1}`);
  const map = new Map(labels.map((item) => [item, 0]));
  const now = new Date();
  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    if (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      const day = String(date.getDate());
      map.set(day, (map.get(day) || 0) + Number(order.totalPrice || 0));
    }
  });
  return labels.map((label) => ({ label, revenue: map.get(label) || 0 }));
}

function formatCurrency(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")} d`;
}

function compactCurrency(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return String(value);
}

function rangeLabel(range: RangeKey) {
  if (range === "day") return "ngay";
  if (range === "week") return "tuan";
  if (range === "month") return "thang";
  return "nam";
}
