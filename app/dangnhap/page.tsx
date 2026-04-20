'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


interface FormValues {
    email: string;
    password: string;
}


export default function DangNhap() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');


    // Schema validation cho form đăng nhập
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Vui lòng nhập email'),
        password: Yup.string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .required('Vui lòng nhập mật khẩu'),
    });


    // Hàm xử lý khi submit form
    const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });


        try {
            // Gọi API backend để đăng nhập
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });


            const data = await response.json();


            if (!response.ok) {
                // Xử lý lỗi từ server - Hiển thị lỗi cụ thể như "Email hoặc mật khẩu không đúng"
                throw new Error(data.message || 'Đăng nhập thất bại');
            }


            // Đăng nhập thành công - Lưu token vào localStorage VÀ cookie
            // API trả về trực tiếp string token
            localStorage.setItem('token', data);
            
            // Lưu token vào cookie để middleware có thể đọc (server-side)
            document.cookie = `token=${data}; path=/; max-age=86400; SameSite=Strict`;


            // Lấy thông tin user để check role
            const userInfoResponse = await fetch('http://localhost:3000/users/userinfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data}`,
                },
            });


            const userInfo = await userInfoResponse.json();


            setMessage({
                type: 'success',
                text: 'Đăng nhập thành công! Đang chuyển hướng...',
            });
            resetForm();


            // Chuyển hướng dựa vào redirectUrl hoặc role
            setTimeout(() => {
                
if (userInfo.role === 'admin') {
                    window.location.href = '/admin/product';
                } else {
                    window.location.href = '/';
                }
            }, 1000);


        } catch (error) {
            // Hiển thị thông báo lỗi
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Đã xảy ra lỗi. Vui lòng thử lại!',
            });
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };


    return (
        <div className="container mx-auto max-w-sm p-4">
            <h2 className="text-2xl font-bold mb-4">Đăng Nhập</h2>


            {message.text && (
                <div className={`mb-4 p-3 rounded-lg font-semibold ${
                    message.type === 'success' 
                        ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                        : 'bg-red-100 text-red-700 border-2 border-red-500'
                }`}>
                    {message.text}
                </div>
            )}


            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block mb-1">Email:</label>
                            <Field name="email" type="email" className="w-full p-2 border border-gray-300 rounded" />
                            {errors.email && touched.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                            )}
                        </div>


                        <div className="mb-4">
                            <label className="block mb-1">Mật khẩu:</label>
                            <Field name="password" type="password" className="w-full p-2 border border-gray-300 rounded" />
                            {errors.password && touched.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>


                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors mt-4"
                            disabled={isSubmitting || isLoading}
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </Form>
                )}
            </Formik>


            <p className="mt-4 text-center">
                Chưa có tài khoản?{' '}
                <Link href="/dangky" className="text-blue-500 hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
