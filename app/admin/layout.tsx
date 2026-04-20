import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xl transition-all duration-300">
          <div className="flex h-full flex-col">
            {/* Logo / Header */}
            <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-8">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Admin
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              <Link
                href="/admin/Dashboard"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Thống kê
              </Link>

              <Link
                href="/admin/product"
                className="flex items-center gap-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 px-4 py-3 text-sm font-semibold text-indigo-700 dark:text-indigo-400 transition-all duration-200"
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Sản phẩm
              </Link>

              <Link
                href="/admin/category"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Danh mục
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Đơn hàng
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Người dùng
              </Link>
            </nav>

            {/* Footer Sidebar */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Về trang chủ
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-72 overflow-auto">
          {/* Topbar */}
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-16 items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative w-80">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-11 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <svg
                    className="absolute left-4 top-3.5 h-5 w-5 text-slate-400"
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

                {/* Notification */}
                <button className="relative rounded-2xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <svg
                    className="h-5 w-5 text-slate-600 dark:text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* Avatar */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Admin User
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Administrator
                    </p>
                  </div>
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-md">
                    A
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
