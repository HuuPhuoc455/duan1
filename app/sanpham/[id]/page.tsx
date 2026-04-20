"use client";

import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartslices";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Product, Variant } from "../../types/product";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const dispatch = useDispatch();

  const params = useParams();
  const id = params.id as string;

  const {
    data: product,
    error,
    isLoading,
  } = useSWR<Product>(
    id ? `http://localhost:3000/products/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
    },
  );

  // Tự động chọn variant đầu tiên
  const defaultVariant = useMemo(() => {
    return product?.variants?.[0] || null;
  }, [product]);

  const currentVariant = selectedVariant || defaultVariant;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">
            Đang tải thông tin tour...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Không tìm thấy tour
          </h2>
          <p className="text-gray-600 mb-8">
            Tour bạn đang tìm có thể đã bị xóa hoặc không tồn tại.
          </p>
          <a
            href="/sanpham"
            className="inline-block bg-amber-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-amber-700 transition"
          >
            Quay lại danh sách tour
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl bg-white">
              <img
                src={`http://localhost:3000/images/${currentVariant?.img || product.img}`}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Thumbnail variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      currentVariant?._id === variant._id
                        ? "border-amber-500 scale-110"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={`http://localhost:3000/images/${variant.img}`}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                {typeof product.categoryId === "string"
                  ? product.categoryId
                  : product.categoryId?.name}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            {currentVariant && (
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-amber-600">
                  {currentVariant.sale.toLocaleString("vi-VN")} ₫
                </span>
                {currentVariant.price > currentVariant.sale && (
                  <span className="text-xl line-through text-gray-400">
                    {currentVariant.price.toLocaleString("vi-VN")} ₫
                  </span>
                )}
                {currentVariant.price > currentVariant.sale && (
                  <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                    Tiết kiệm{" "}
                    {Math.round(
                      ((currentVariant.price - currentVariant.sale) /
                        currentVariant.price) *
                        100,
                    )}
                    %
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <div className="prose text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Chọn gói dịch vụ
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 rounded-2xl border transition-all font-medium ${
                        currentVariant?._id === variant._id
                          ? "bg-amber-600 text-white border-amber-600 shadow-md"
                          : "border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng người tham gia
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-100 text-xl font-medium"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-24 text-center text-2xl font-semibold border border-gray-300 rounded-2xl py-3 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-2xl hover:bg-gray-100 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    item: product,
                    variant: currentVariant,
                    quantity: Number(quantity),
                  }),
                )
              }
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xl py-5 rounded-3xl transition-all duration-300 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-3"
            >
              <span>Thêm vào giỏ hàng</span>
              <span className="text-2xl">🛒</span>
            </button>

            <p className="text-center text-sm text-gray-500">
              ✓ Đảm bảo hoàn tiền • ✓ Hỗ trợ 24/7 • ✓ Xác nhận ngay lập tức
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
