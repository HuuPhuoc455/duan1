"use client";

import { Product } from "../../types/product";
import { useState } from "react";

export default function ProductDetailModal({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [variantForm, setVariantForm] = useState({
    name: "",
    duration: "",
    price: "",
    sale: "",
    img: "",
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-200"
        title="Chi tiết"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {typeof product.categoryId === "string"
                    ? product.categoryId
                    : product.categoryId.name}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="overflow-y-auto p-6"
              style={{ maxHeight: "calc(90vh - 80px)" }}
            >
              <div className="mb-6 flex gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={`http://localhost:3000/images/${product.img}`}
                    alt={product.name}
                    className="h-48 w-48 rounded-lg border border-gray-200 object-cover shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">
                    Mô tả
                  </h3>
                  <p className="whitespace-normal text-sm leading-relaxed text-gray-600">
                    {product.description}
                  </p>

                  {product.hot === 1 && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        🔥 Sản phẩm HOT
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Các biến thể ({product.variants.length})
                  </h3>
                  <button
                    onClick={() => {
                      setShowVariantForm(true);
                      setEditingVariant(null);
                      setVariantForm({
                        name: "",
                        duration: "",
                        price: "",
                        sale: "",
                        img: "",
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    title="Thêm biến thể"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Thêm biến thể
                  </button>
                </div>

                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant._id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={`http://localhost:3000/images/${variant.img}`}
                            alt={variant.name}
                            className="h-20 w-20 rounded-lg border border-gray-300 object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {variant.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-600">
                                Thời lượng: {variant.duration}
                              </p>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="text-right">
                                <div className="text-lg font-bold text-emerald-600">
                                  {variant.price.toLocaleString("vi-VN")}đ
                                </div>
                                {variant.sale > 0 && (
                                  <div className="mt-1 text-xs text-gray-500 line-through">
                                    {variant.sale.toLocaleString("vi-VN")}đ
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setEditingVariant(variant);
                                    setVariantForm({
                                      name: variant.name,
                                      duration: variant.duration,
                                      price: variant.price.toString(),
                                      sale: variant.sale.toString(),
                                      img: variant.img,
                                    });
                                    setShowVariantForm(true);
                                  }}
                                  className="inline-flex items-center justify-center rounded-md bg-amber-50 p-1.5 text-amber-700 transition-colors hover:bg-amber-100 active:bg-amber-200"
                                  title="Sửa"
                                >
                                  <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="inline-flex items-center justify-center rounded-md bg-red-50 p-1.5 text-red-700 transition-colors hover:bg-red-100 active:bg-red-200"
                                  title="Xóa"
                                >
                                  <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          {variant.sale > 0 && (
                            <div className="mt-2">
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Giảm{" "}
                                {Math.round(
                                  ((variant.sale - variant.price) /
                                    variant.sale) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showVariantForm && (
                <div className="mt-8 border-t pt-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    {editingVariant ? "Sửa biến thể" : "Thêm biến thể mới"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên biến thể
                      </label>
                      <input
                        type="text"
                        value={variantForm.name}
                        onChange={(e) =>
                          setVariantForm({
                            ...variantForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: 30 ngày"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời lượng
                      </label>
                      <input
                        type="text"
                        value={variantForm.duration}
                        onChange={(e) =>
                          setVariantForm({
                            ...variantForm,
                            duration: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: 30 ngày"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá
                        </label>
                        <input
                          type="number"
                          value={variantForm.price}
                          onChange={(e) =>
                            setVariantForm({
                              ...variantForm,
                              price: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá gốc (nếu có)
                        </label>
                        <input
                          type="number"
                          value={variantForm.sale}
                          onChange={(e) =>
                            setVariantForm({
                              ...variantForm,
                              sale: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh biến thể
                      </label>
                      <input
                        type="text"
                        value={variantForm.img}
                        onChange={(e) =>
                          setVariantForm({
                            ...variantForm,
                            img: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tên ảnh"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          setShowVariantForm(false);
                          setEditingVariant(null);
                          setVariantForm({
                            name: "",
                            duration: "",
                            price: "",
                            sale: "",
                            img: "",
                          });
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement save variant logic
                          alert("Lưu biến thể: " + variantForm.name);
                          setShowVariantForm(false);
                          setEditingVariant(null);
                          setVariantForm({
                            name: "",
                            duration: "",
                            price: "",
                            sale: "",
                            img: "",
                          });
                        }}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        {editingVariant ? "Cập nhật" : "Thêm"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
