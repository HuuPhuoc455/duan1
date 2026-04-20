"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import ProductCard from "../component/ProductCard";
import Link from "next/link";

export default function SanPhamPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [sortBy, setSortBy] = useState("name");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategoryOptions(
          Array.isArray(data)
            ? data.map((category: any) => category.name).filter(Boolean)
            : [],
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (product: Product) =>
    typeof product.categoryId === "string"
      ? product.categoryId
      : product.categoryId?.name || "";

  // Filter & Sort logic
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" ||
        getCategoryName(product) === selectedCategory;

      const variant = product.variants?.[0];
      const price = variant?.sale || 0;
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort
    filtered.sort((a, b) => {
      const priceA = a.variants?.[0]?.sale || 0;
      const priceB = b.variants?.[0]?.sale || 0;

      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories =
    categoryOptions.length > 0
      ? categoryOptions
      : [...new Set(products.map((p) => getCategoryName(p)))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Khám Phá Tất Cả Tour</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Hàng trăm hành trình tuyệt vời đang chờ bạn trải nghiệm
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar - Hiện đại hơn */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Bộ lọc</h2>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setPriceRange({ min: 0, max: 100000000 });
                    setSortBy("name");
                  }}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tìm kiếm tour
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tên tour, địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400 absolute left-5 top-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Category */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Khoảng giá (VNĐ)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tối thiểu</p>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tối đa</p>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                >
                  <option value="name">Tên A → Z</option>
                  <option value="price-low">Giá thấp → cao</option>
                  <option value="price-high">Giá cao → thấp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-lg text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                tour du lịch
              </p>
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
              >
                ← Quay về trang chủ
              </Link>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow">
                <div className="text-7xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Không tìm thấy tour nào
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Không có tour nào phù hợp với bộ lọc hiện tại. Hãy thử thay
                  đổi điều kiện tìm kiếm.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setPriceRange({ min: 0, max: 100000000 });
                    setSortBy("name");
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-medium text-lg transition"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
