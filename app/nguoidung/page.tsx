'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserInfo {
    _id: string;
    email: string;
    role: string;
}

export default function NguoiDung() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.');
                    setIsLoading(false);
                    return;
                }

                // Gọi API để lấy thông tin người dùng
                const response = await fetch('http://localhost:3000/users/userinfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Không thể lấy thông tin người dùng');
                }

                setUserInfo(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin người dùng');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
        // Chuyển hướng về trang đăng nhập
        router.push('/dangnhap');
    };

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-2xl p-4">
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-2xl p-4">
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg">
                    <p className="font-semibold">{error}</p>
                    <Link href="/dangnhap" className="text-blue-500 hover:underline mt-2 inline-block">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Thông Tin Người Dùng</h1>
                
                {userInfo && (
                    <div className="space-y-4">
                        <div className="border-b pb-3">
                            <label className="text-sm text-gray-500 font-semibold">User ID:</label>
                            <p className="text-lg text-gray-800 mt-1 font-mono">{userInfo._id}</p>
                        </div>

                        <div className="border-b pb-3">
                            <label className="text-sm text-gray-500 font-semibold">Email:</label>
                            <p className="text-lg text-gray-800 mt-1">{userInfo.email}</p>
                        </div>

                        <div className="border-b pb-3">
                            <label className="text-sm text-gray-500 font-semibold">Vai trò:</label>
                            <p className="text-lg text-gray-800 mt-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    userInfo.role === 'admin' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {userInfo.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                </span>
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Đăng xuất
                            </button>
                            <Link 
                                href="/"
                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors inline-block"
                            >
                                Về trang chủ
                            </Link>
                            {userInfo?.role === 'admin' && (
                                <Link
                                    href="/admin/product"
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors inline-block"
                                >
                                    Vào trang Admin
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
