"use client";

import Link from "next/link";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { SearchContext } from "@/app/component/searchContext";

export default function Header() {
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartCount = cartItems.reduce(
    (count: number, item: any) => count + Number(item.quantity),
    0,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { keyword, setKeyword } = useContext(SearchContext);
  const router = useRouter();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (!token) {
        setUserRole(null);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/users/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserRole(data?.role ?? null);
        }
      } catch (err) {
        setUserRole(null);
      }
    };

    checkLoginStatus();
    const handleChange = () => checkLoginStatus();
    window.addEventListener("focus", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("focus", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    if (e.target.value.trim()) router.push("/timkiem");
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* ==================== LOGO MỚI - ĐẸP HƠN ==================== */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="h-12 w-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl drop-shadow-md">✈️</span>
            </div>
            {/* Decorative small plane */}
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow">
              <span className="text-[10px]">🛫</span>
            </div>
          </div>

          <div className="leading-none">
            <div className="text-3xl font-bold tracking-tighter text-gray-900 group-hover:text-amber-600 transition-colors">
              Voyage
            </div>
            <div className="text-xs font-medium text-amber-600 tracking-widest">
              TRAVEL & TOURS
            </div>
          </div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-9 text-gray-700 font-medium">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Trang chủ
          </Link>
          <Link
            href="/sanpham"
            className="hover:text-amber-600 transition-colors"
          >
            Tour du lịch
          </Link>
          <Link
            href="/gioithieu"
            className="hover:text-amber-600 transition-colors"
          >
            Giới thiệu
          </Link>
          <Link
            href="/lienhe"
            className="hover:text-amber-600 transition-colors"
          >
            Liên hệ
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-lg mx-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tour, điểm đến..."
              className="w-full bg-gray-100 border border-gray-200 focus:border-amber-500 focus:bg-white pl-12 py-3.5 rounded-3xl text-sm outline-none transition-all duration-200"
              value={keyword}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Giỏ hàng */}
          <Link
            href="/giohang"
            className="relative p-3 hover:bg-gray-100 rounded-2xl transition group"
          >
            <ShoppingCartIcon className="w-6 h-6 text-gray-700 group-hover:text-amber-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-100 rounded-2xl transition"
              >
                <UserCircleIcon className="w-7 h-7 text-gray-700" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl py-2 border border-gray-100 z-50">
                  <Link
                    href="/nguoidung"
                    className="block px-6 py-3 hover:bg-gray-50"
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    href="/donhang"
                    className="block px-6 py-3 hover:bg-gray-50"
                  >
                    Đơn hàng của tôi
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      href="/admin/product"
                      className="block px-6 py-3 hover:bg-gray-50 text-amber-600 font-medium"
                    >
                      Trang quản trị
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      document.cookie = "token=; path=/; max-age=0";
                      setIsLoggedIn(false);
                      setUserRole(null);
                      setShowUserMenu(false);
                      router.push("/");
                    }}
                    className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/dangnhap"
              className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-3xl font-medium transition"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 hover:bg-gray-100 rounded-2xl transition"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-6 py-6 space-y-6">
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <Link href="/">Trang chủ</Link>
            <Link href="/sanpham">Tour du lịch</Link>
            <Link href="/gioithieu">Giới thiệu</Link>
            <Link href="/lienhe">Liên hệ</Link>
          </nav>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tour..."
              className="w-full bg-gray-100 pl-12 py-4 rounded-3xl outline-none"
              value={keyword}
              onChange={handleSearch}
            />
          </div>
        </div>
      )}
    </header>
  );
}
