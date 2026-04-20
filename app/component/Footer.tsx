import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Cột 1: Logo & Giới thiệu */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-4xl">✈️</span>
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tighter text-white">
                  Voyage
                </span>
                <p className="text-amber-500 text-sm font-medium -mt-1">
                  Travel & Tours
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-md">
              Chúng tôi mang đến những hành trình đáng nhớ, những trải nghiệm du
              lịch chất lượng cao và dịch vụ tận tâm nhất cho mọi khách hàng.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5 mt-8">
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="md:col-span-3">
            <h3 className="text-white font-semibold mb-6 text-lg">Khám phá</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/sanpham" className="hover:text-white transition">
                  Tất cả tour
                </Link>
              </li>
              <li>
                <Link
                  href="/sanpham?category=Du%20Lịch%20Trong%20Nước"
                  className="hover:text-white transition"
                >
                  Tour trong nước
                </Link>
              </li>
              <li>
                <Link
                  href="/sanpham?category=Du%20Lịch%20Quốc%20Tế"
                  className="hover:text-white transition"
                >
                  Tour quốc tế
                </Link>
              </li>
              <li>
                <Link href="/gioithieu" className="hover:text-white transition">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="md:col-span-4">
            <h3 className="text-white font-semibold mb-6 text-lg">
              Liên hệ với chúng tôi
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex gap-4">
                <MapPinIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>123 Đường Nguyễn Huệ, Quận 1</p>
                  <p>TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="flex gap-4">
                <PhoneIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Hotline: 0123 456 789</p>
                  <p>Đặt tour: 0987 654 321</p>
                </div>
              </div>

              <div className="flex gap-4">
                <EnvelopeIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p>contact@voyagetravel.com</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-10">
              <p className="text-white font-medium mb-3">Nhận tin khuyến mãi</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-l-3xl px-5 py-3 text-sm flex-1 outline-none"
                />
                <button className="bg-amber-600 hover:bg-amber-700 px-8 rounded-r-3xl font-medium text-white transition">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 Voyage Travel. All rights reserved. | Chính sách bảo mật | Điều
          khoản sử dụng
        </div>
      </div>
    </footer>
  );
}
