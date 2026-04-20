"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slices/cartslices";
import { Product, Variant } from "../types/product";
import Link from "next/link";

type CartItem = Product & {
  quantity: number;
  cartItemId: string;
  selectedVariant?: Variant;
};

export default function GioHangPage() {
  const cartItems = useSelector((state: any) => state.cart.items) as CartItem[];
  const dispatch = useDispatch<any>();

  const handleRemove = (cartItemId: string) => {
    dispatch(removeFromCart({ cartItemId }));
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ cartItemId, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart({} as any));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => {
      const variant = item.selectedVariant || item.variants?.[0];
      return total + (variant?.sale || 0) * item.quantity;
    }, 0);
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="text-7xl mb-8">🛒</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Bạn chưa có tour nào trong giỏ hàng.
            <br />
            Hãy chọn những chuyến đi tuyệt vời ngay nhé!
          </p>
          <Link
            href="/sanpham"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-lg px-10 py-4 rounded-3xl transition-all shadow-lg"
          >
            Khám phá tour ngay
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600 mt-3 text-xl">
              {cartItems.length} chuyến đi đang chờ thanh toán
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition"
          >
            🗑️ Xóa toàn bộ giỏ hàng
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item: CartItem) => {
              const variant = item.selectedVariant || item.variants?.[0];
              if (!variant) return null;

              const cartItemId =
                item.cartItemId || `${item._id}-${variant._id}`;
              const itemTotal = variant.sale * item.quantity;

              return (
                <div
                  key={cartItemId}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Ảnh */}
                    <div className="md:w-80 h-64 md:h-auto overflow-hidden">
                      <img
                        src={`http://localhost:3000/images/${variant.img}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thông tin */}
                    <div className="flex-1 p-8 flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-2xl font-bold text-gray-900 pr-8">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => handleRemove(cartItemId)}
                            className="text-gray-400 hover:text-red-500 transition text-xl"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="text-amber-600 font-medium mt-1">
                          {variant.name}
                        </p>
                        {variant.duration && (
                          <p className="text-gray-500 text-sm mt-1">
                            {variant.duration}
                          </p>
                        )}
                      </div>

                      {/* Giá & Số lượng */}
                      <div className="mt-8 flex items-end justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Đơn giá</p>
                          <p className="text-2xl font-semibold text-amber-600">
                            {variant.sale.toLocaleString("vi-VN")} ₫
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-4 mb-4">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  cartItemId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-100 disabled:opacity-40 transition"
                            >
                              −
                            </button>
                            <span className="text-2xl font-semibold w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  cartItemId,
                                  item.quantity + 1,
                                )
                              }
                              className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Thành tiền</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {itemTotal.toLocaleString("vi-VN")} ₫
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Tóm tắt đơn hàng */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Tóm tắt đơn hàng
              </h2>
              <p className="text-gray-500">Kiểm tra lại trước khi thanh toán</p>

              <div className="border-t border-gray-200 my-8" />

              <div className="space-y-5">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Số lượng tour</span>
                  <span className="font-semibold">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-amber-600">
                    {calculateTotal().toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              <Link
                href="/thanhtoan"
                className="mt-10 block w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xl font-semibold py-5 rounded-3xl text-center transition-all shadow-lg shadow-amber-500/30"
              >
                Tiếp tục thanh toán
              </Link>

              <div className="mt-6 text-center text-sm text-gray-500">
                ✓ Thanh toán an toàn • ✓ Hỗ trợ 24/7 • ✓ Xác nhận ngay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
