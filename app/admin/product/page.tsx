"use client";

import { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { productAPI, variantAPI, categoryAPI } from "../../services/api";
import ProductDetailModal from "./ProductDetailModal";

interface Variant {
  _id: string;
  name: string;
  price: number;
  sale: number;
  duration: string;
  img: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductVariantInput {
  id: string;
  name: string;
  price: string;
  sale: string;
  duration: string;
  img: File | null;
  imgName: string;
}

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(true);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    hot: 0,
    img: null as File | null,
  });
  const [productImageName, setProductImageName] = useState("");
  const [newProductVariants, setNewProductVariants] = useState<
    ProductVariantInput[]
  >([
    {
      id: `var-${Date.now()}`,
      name: "",
      price: "",
      sale: "",
      duration: "",
      img: null,
      imgName: "",
    },
  ]);
  const [variantForm, setVariantForm] = useState({
    name: "",
    price: "",
    sale: "",
    duration: "",
    img: null as File | null,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [editingVariants, setEditingVariants] = useState<Variant[]>([]);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null,
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setProducts(productsRes);
      setCategories(categoriesRes);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage({ type: "error", text: "Không thể tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("categoryId", productForm.categoryId);
    formData.append("hot", String(productForm.hot ?? 0));
    if (productForm.img) {
      formData.append("img", productForm.img);
    }

    try {
      let createdProduct: Product | null = null;

      if (editingProduct) {
        await productAPI.update(editingProduct._id, formData, token);
        setMessage({ type: "success", text: "Cập nhật sản phẩm thành công" });
      } else {
        createdProduct = await productAPI.create(formData, token);
        setMessage({ type: "success", text: "Thêm sản phẩm thành công" });
      }

      const createdProductId = createdProduct
        ? createdProduct._id ||
          (createdProduct as any).id ||
          (createdProduct as any).productId ||
          ""
        : "";

      if (!editingProduct && createdProductId) {
        const validVariants = newProductVariants.filter(
          (variant) =>
            variant.name.trim() &&
            Number(variant.price) > 0 &&
            variant.duration.trim(),
        );

        if (validVariants.length > 0) {
          try {
            for (const variant of validVariants) {
              const variantData = new FormData();
              variantData.append("name", variant.name);
              variantData.append("price", Number(variant.price).toString());
              variantData.append(
                "sale",
                (Number(variant.sale) || 0).toString(),
              );
              variantData.append("duration", variant.duration);
              variantData.append("productId", createdProductId);
              if (variant.img) {
                variantData.append("img", variant.img);
              }
              await variantAPI.create(variantData, token);
            }
          } catch (variantError) {
            console.error("Error creating variants:", variantError);
            setMessage({
              type: "error",
              text: "Sản phẩm đã tạo, nhưng một số biến thể chưa được thêm.",
            });
          }
        }
      }

      await loadData();
      setShowProductForm(false);
      resetProductForm();
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage({ type: "error", text: "Lỗi khi lưu sản phẩm" });
    }
  };

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    const variantPrice = Number(variantForm.price);
    const variantSale = Number(variantForm.sale) || 0;
    const formData = new FormData();
    formData.append("name", variantForm.name);
    formData.append("price", variantPrice.toString());
    formData.append("sale", variantSale.toString());
    formData.append("duration", variantForm.duration);
    if (variantForm.img) {
      formData.append("img", variantForm.img);
    }

    try {
      if (editingVariant) {
        await variantAPI.update(editingVariant._id, formData, token);
        setMessage({ type: "success", text: "Cập nhật biến thể thành công" });
      } else {
        formData.append("productId", selectedProduct._id);
        await variantAPI.create(formData, token);
        setMessage({ type: "success", text: "Thêm biến thể thành công" });
      }
      loadData();
      setShowVariantForm(false);
      resetVariantForm();
    } catch (error) {
      console.error("Error saving variant:", error);
      setMessage({ type: "error", text: "Lỗi khi lưu biến thể" });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    try {
      await productAPI.delete(productId, token);
      setMessage({ type: "success", text: "Xóa sản phẩm thành công" });
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({ type: "error", text: "Lỗi khi xóa sản phẩm" });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Bạn có chắc muốn xóa biến thể này?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    try {
      await variantAPI.delete(variantId, token);
      setMessage({ type: "success", text: "Xóa biến thể thành công" });
      loadData();
    } catch (error) {
      console.error("Error deleting variant:", error);
      setMessage({ type: "error", text: "Lỗi khi xóa biến thể" });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      categoryId: "",
      hot: 0,
      img: null,
    });
    setProductImageName("");
    setNewProductVariants([
      {
        id: `var-${Date.now()}`,
        name: "",
        price: "",
        sale: "",
        duration: "",
        img: null,
        imgName: "",
      },
    ]);
    setEditingProduct(null);
    setEditingVariants([]);
    setEditingVariantIndex(null);
    setVariantForm({ name: "", price: "", sale: "", duration: "", img: null });
  };

  const handleAddProductVariant = () => {
    setNewProductVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        name: "",
        price: "",
        sale: "",
        duration: "",
        img: null,
        imgName: "",
      },
    ]);
  };

  const handleUpdateProductVariant = (
    index: number,
    field: keyof ProductVariantInput,
    value: string | File | null,
  ) => {
    setNewProductVariants((prev) =>
      prev.map((variant, idx) =>
        idx === index
          ? {
              ...variant,
              [field]: value,
              ...(field === "img" ? { imgName: "" } : {}),
            }
          : variant,
      ),
    );
  };

  const handleRemoveProductVariant = (index: number) => {
    setNewProductVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const resetVariantForm = () => {
    setVariantForm({ name: "", price: "", sale: "", duration: "", img: null });
    setEditingVariant(null);
  };

  const handleEditProductVariant = (index: number) => {
    setEditingVariantIndex(index);
    setVariantForm({
      name: editingVariants[index].name,
      price: editingVariants[index].price.toString(),
      sale: editingVariants[index].sale.toString(),
      duration: editingVariants[index].duration,
      img: null,
    });
  };

  const handleDeleteProductVariant = async (variantId: string) => {
    if (!confirm("Bạn có chắc muốn xóa biến thể này?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    try {
      await variantAPI.delete(variantId, token);
      setEditingVariants(editingVariants.filter((v) => v._id !== variantId));
      setMessage({ type: "success", text: "Xóa biến thể thành công" });
    } catch (error) {
      console.error("Error deleting variant:", error);
      setMessage({ type: "error", text: "Lỗi khi xóa biến thể" });
    }
  };

  const handleSaveEditingVariant = async () => {
    if (editingVariantIndex === null) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    try {
      const variantId = editingVariants[editingVariantIndex]._id;
      const formData = new FormData();
      formData.append("name", variantForm.name);
      formData.append("price", variantForm.price);
      formData.append("sale", variantForm.sale);
      formData.append("duration", variantForm.duration);
      if (variantForm.img) {
        formData.append("img", variantForm.img);
      }

      await variantAPI.update(variantId, formData, token);

      // Update local state
      setEditingVariants(
        editingVariants.map((v, idx) =>
          idx === editingVariantIndex
            ? {
                ...v,
                name: variantForm.name,
                price: parseFloat(variantForm.price),
                sale: parseFloat(variantForm.sale),
                duration: variantForm.duration,
              }
            : v,
        ),
      );

      setMessage({ type: "success", text: "Cập nhật biến thể thành công" });
      setEditingVariantIndex(null);
      setVariantForm({
        name: "",
        price: "",
        sale: "",
        duration: "",
        img: null,
      });
    } catch (error) {
      console.error("Error saving variant:", error);
      setMessage({ type: "error", text: "Lỗi khi lưu biến thể" });
    }
  };

  const getCategoryName = (categoryId: Product["categoryId"]) =>
    typeof categoryId === "string"
      ? categoryId
      : categoryId?.name || "Không rõ";

  const getCategoryIdValue = (categoryId: Product["categoryId"]) =>
    typeof categoryId === "string" ? categoryId : categoryId?._id || "";

  const openProductForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        categoryId: getCategoryIdValue(product.categoryId),
        hot: product.hot,
        img: null,
      });
      setProductImageName(product.img || "");
      setEditingVariants(product.variants || []);
      setEditingVariantIndex(null);
      setNewProductVariants([
        {
          id: `var-${Date.now()}`,
          name: "",
          price: "",
          sale: "",
          duration: "",
          img: null,
          imgName: "",
        },
      ]);
    } else {
      resetProductForm();
    }
    setShowProductForm(true);
  };

  const openVariantForm = (product: Product, variant?: Variant) => {
    setSelectedProduct(product);
    if (variant) {
      setEditingVariant(variant);
      setVariantForm({
        name: variant.name,
        price: variant.price?.toString() || "",
        sale: variant.sale?.toString() || "",
        duration: variant.duration,
        img: null,
      });
    } else {
      resetVariantForm();
    }
    setShowVariantForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {message.text}
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Quản lý sản phẩm
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Tổng cộng{" "}
              <span className="font-semibold text-gray-900">
                {products.length}
              </span>{" "}
              sản phẩm
            </p>
          </div>

          <button
            onClick={() => openProductForm()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
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
            Thêm sản phẩm
          </button>
        </div>

        {/* Product Form */}
        {showProductForm && (
          <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                </h2>
                <p className="text-sm text-gray-500">
                  Điền thông tin sản phẩm và biến thể đầu tiên ngay trên trang
                  quản lý.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  resetProductForm();
                }}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Ẩn form
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Danh mục
                    </label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          categoryId: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={productForm.hot === 1}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            hot: e.target.checked ? 1 : 0,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      HOT
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ảnh sản phẩm
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        img: e.target.files?.[0] || null,
                      })
                    }
                    className="mt-1 block w-full"
                    accept="image/*"
                  />
                  {editingProduct && productImageName && !productForm.img && (
                    <p className="mt-2 text-sm text-gray-500">
                      Ảnh hiện tại: {productImageName}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Giá / Biến thể (tùy chọn)
                    </h3>
                    {!editingProduct ? (
                      <button
                        type="button"
                        onClick={handleAddProductVariant}
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Thêm biến thể
                      </button>
                    ) : null}
                  </div>
                  {!editingProduct ? (
                    newProductVariants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="mb-4 rounded-xl border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm font-medium text-gray-700">
                            Biến thể {index + 1}
                          </div>
                          {newProductVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveProductVariant(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                        <div className="grid gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Tên biến thể
                            </label>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) =>
                                handleUpdateProductVariant(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Giá
                              </label>
                              <input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                  handleUpdateProductVariant(
                                    index,
                                    "price",
                                    e.target.value,
                                  )
                                }
                                placeholder="Nhập giá"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Giá sale
                              </label>
                              <input
                                type="number"
                                value={variant.sale}
                                onChange={(e) =>
                                  handleUpdateProductVariant(
                                    index,
                                    "sale",
                                    e.target.value,
                                  )
                                }
                                placeholder="Nhập giá sale"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Thời gian
                            </label>
                            <input
                              type="text"
                              value={variant.duration}
                              onChange={(e) =>
                                handleUpdateProductVariant(
                                  index,
                                  "duration",
                                  e.target.value,
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Ảnh biến thể
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                handleUpdateProductVariant(
                                  index,
                                  "img",
                                  e.target.files?.[0] || null,
                                )
                              }
                              className="mt-1 block w-full"
                              accept="image/*"
                            />
                            {variant.imgName && !variant.img && (
                              <p className="mt-2 text-sm text-gray-500">
                                Ảnh hiện tại: {variant.imgName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      {editingVariants.length > 0 ? (
                        editingVariants.map((variant, index) => (
                          <div
                            key={variant._id}
                            className="rounded-xl border border-gray-200 bg-white p-4"
                          >
                            {editingVariantIndex === index ? (
                              // Edit mode
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                  />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
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
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Giá gốc
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
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Ảnh biến thể
                                  </label>
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      setVariantForm({
                                        ...variantForm,
                                        img: e.target.files?.[0] || null,
                                      })
                                    }
                                    className="mt-1 block w-full"
                                    accept="image/*"
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingVariantIndex(null);
                                      setVariantForm({
                                        name: "",
                                        price: "",
                                        sale: "",
                                        duration: "",
                                        img: null,
                                      });
                                    }}
                                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleSaveEditingVariant}
                                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                  >
                                    Lưu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // View mode
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {variant.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Thời lượng: {variant.duration}
                                  </p>
                                  <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-emerald-600">
                                      {variant.price.toLocaleString("vi-VN")}đ
                                    </span>
                                    {variant.sale > 0 && (
                                      <span className="text-sm text-gray-500 line-through">
                                        {variant.sale.toLocaleString("vi-VN")}đ
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditProductVariant(index)
                                    }
                                    className="rounded-md bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                                    title="Sửa"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteProductVariant(variant._id)
                                    }
                                    className="rounded-md bg-red-50 p-2 text-red-700 hover:bg-red-100"
                                    title="Xóa"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                          Không có biến thể. Hãy thêm biến thể mới.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      resetProductForm();
                    }}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {editingProduct ? "Cập nhật" : "Thêm sản phẩm"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                    #
                  </th>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Ảnh
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Danh mục
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Giá
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Mô tả
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((product, index) => (
                  <tr
                    key={product._id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex justify-center">
                        <img
                          src={`http://localhost:3000/images/${product.img || "placeholder.png"}`}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {product.name}
                        </p>
                        {product.hot === 1 && (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            🔥 HOT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-emerald-600">
                          {product.variants.length > 0 && (
                            <>
                              {Math.min(
                                ...product.variants.map((v) => v.price),
                              ).toLocaleString("vi-VN")}
                              đ
                              {product.variants.length > 1 && (
                                <span className="font-normal text-gray-400">
                                  {" - "}
                                  {Math.max(
                                    ...product.variants.map((v) => v.price),
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              )}
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.variants.length} phiên bản
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[150px] truncate text-sm text-gray-600">
                        {product.description}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="inline-flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-700 transition-colors hover:bg-blue-100"
                          title="Xem chi tiết"
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
                        <button
                          onClick={() => openProductForm(product)}
                          className="inline-flex items-center justify-center rounded-md bg-amber-50 p-1.5 text-amber-700 transition-colors hover:bg-amber-100"
                          title="Sửa"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="inline-flex items-center justify-center rounded-md bg-red-50 p-1.5 text-red-700 transition-colors hover:bg-red-100"
                          title="Xóa"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Variant Form Modal */}
        {showVariantForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingVariant ? "Sửa biến thể" : "Thêm biến thể"}
              </h2>
              <form onSubmit={handleVariantSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên biến thể
                  </label>
                  <input
                    type="text"
                    value={variantForm.name}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
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
                    placeholder="Nhập giá"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Giá sale
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
                    placeholder="Nhập giá sale"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Thời gian
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Ảnh
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        img: e.target.files?.[0] || null,
                      })
                    }
                    className="mt-1 block w-full"
                    accept="image/*"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVariantForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {editingVariant ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && !showVariantForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Chi tiết sản phẩm: {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <button
                  onClick={() => openVariantForm(selectedProduct)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Thêm biến thể
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProduct.variants.map((variant) => (
                  <div key={variant._id} className="border p-4 rounded">
                    <img
                      src={`http://localhost:3000/images/${variant.img || "placeholder.png"}`}
                      alt={variant.name}
                      className="w-full h-32 object-cover mb-2"
                    />
                    <h3 className="font-semibold">{variant.name}</h3>
                    <p>Giá: {variant.price.toLocaleString("vi-VN")}đ</p>
                    <p>Sale: {variant.sale.toLocaleString("vi-VN")}đ</p>
                    <p>Thời gian: {variant.duration}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          openVariantForm(selectedProduct, variant)
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="mt-8 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              Chưa có sản phẩm nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bắt đầu bằng cách thêm sản phẩm mới vào hệ thống
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
