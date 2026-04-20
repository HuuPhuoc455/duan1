"use client";

import { Product } from "../types/product";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const variant = product.variants?.[0] || null;
  const imageUrl = variant?.img || product.img || "placeholder.png";
  const categoryName =
    typeof product.categoryId === "string"
      ? product.categoryId
      : product.categoryId?.name || "Không rõ";

  const discountPercent = variant
    ? Math.round(((variant.price - variant.sale) / variant.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={`http://localhost:3000/images/${imageUrl}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.hot === 1 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-2xl shadow-md">
              🔥 HOT
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-2xl shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-2 rounded-2xl shadow">
          {categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Tour Name */}
        <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors min-h-[56px]">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Duration & Info */}
        {variant?.duration && (
          <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
            <span>⏱️</span>
            <span>{variant.duration}</span>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-3 border-t border-gray-100">
          {variant ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-amber-600">
                {variant.sale.toLocaleString("vi-VN")}₫
              </span>
              {variant.price > variant.sale && (
                <span className="text-gray-400 line-through text-base">
                  {variant.price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Liên hệ để biết giá</span>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/sanpham/${product._id}`} className="block">
          <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]">
            Xem chi tiết
            <span className="text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
