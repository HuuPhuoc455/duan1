"use client";

import { useEffect, useState } from "react";
import { categoryAPI } from "../../services/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load danh sách danh mục
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesRes = await categoryAPI.getAll();
        setCategories(
          categoriesRes.map((category: any) => ({
            _id: category._id || category.id,
            name: category.name,
            slug: category.slug || "",
          })),
        );
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback sample data nếu cần
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập tên danh mục" });
      return;
    }

    const trimmedSlug =
      categorySlug.trim() || categoryName.toLowerCase().replace(/\s+/g, "-");
    const token = localStorage.getItem("token");

    setIsLoading(true);

    try {
      if (editingCategoryId) {
        // Cập nhật
        await categoryAPI.update(
          editingCategoryId,
          {
            name: categoryName.trim(),
            slug: trimmedSlug,
          },
          token || undefined,
        );

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategoryId
              ? { ...cat, name: categoryName.trim(), slug: trimmedSlug }
              : cat,
          ),
        );

        setMessage({ type: "success", text: "Cập nhật danh mục thành công!" });
      } else {
        // Tạo mới
        const newCat = await categoryAPI.create(
          { name: categoryName.trim(), slug: trimmedSlug },
          token || undefined,
        );

        setCategories((prev) => [
          {
            _id: newCat._id || newCat.id,
            name: newCat.name,
            slug: newCat.slug || trimmedSlug,
          },
          ...prev,
        ]);

        setMessage({ type: "success", text: "Thêm danh mục mới thành công!" });
      }

      // Reset form
      setCategoryName("");
      setCategorySlug("");
      setEditingCategoryId(null);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category._id);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        type: "error",
        text: "Bạn cần đăng nhập để xóa danh mục.",
      });
      return;
    }

    try {
      await categoryAPI.delete(id, token);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setMessage({ type: "success", text: "Xóa danh mục thành công!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Không thể xóa danh mục.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Quản lý Danh mục
            </h1>
            <p className="text-gray-600 mt-2">
              Thêm, sửa, xóa các danh mục sản phẩm
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCategoryId(null);
              setCategoryName("");
              setCategorySlug("");
              setMessage(null);
            }}
            className="mt-6 lg:mt-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center gap-2"
          >
            + Thêm danh mục mới
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 px-6 py-4 rounded-2xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Danh sách danh mục */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Danh sách danh mục
                  </h2>
                  <p className="text-sm text-gray-500">
                    {categories.length} danh mục
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tên danh mục
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-8 py-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((category, index) => (
                      <tr
                        key={category._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-8 py-6 font-medium text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-8 py-6 font-semibold text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-8 py-6 text-gray-500 font-mono text-sm">
                          {category.slug}
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="px-4 py-2 text-xs font-medium bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="px-4 py-2 text-xs font-medium bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}

                    {categories.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-8 py-16 text-center text-gray-500"
                        >
                          Chưa có danh mục nào. Hãy thêm danh mục mới.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Form thêm/sửa */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {editingCategoryId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {editingCategoryId
                  ? "Cập nhật thông tin danh mục"
                  : "Tạo danh mục sản phẩm mới"}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    placeholder="Ví dụ: Du lịch trong nước"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL-friendly)
                  </label>
                  <input
                    type="text"
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-mono"
                    placeholder="du-lich-trong-nuoc"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tự động tạo nếu để trống
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 rounded-2xl transition-all"
                >
                  {isLoading
                    ? "Đang xử lý..."
                    : editingCategoryId
                      ? "Cập nhật danh mục"
                      : "Thêm danh mục"}
                </button>

                {editingCategoryId && (
                  <button
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCategoryName("");
                      setCategorySlug("");
                    }}
                    className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
