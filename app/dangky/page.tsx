'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

interface FormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function DangKy() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Schema validation cho form đăng ký
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Vui lòng nhập email'),
        password: Yup.string()
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .required('Vui lòng nhập mật khẩu'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
            .required('Vui lòng nhập lại mật khẩu'),
    });

    // Hàm xử lý khi submit form
    const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Gọi API backend để đăng ký
            const response = await fetch('http://localhost:3000/users/register', {
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
                // Xử lý lỗi từ server - Hiển thị lỗi cụ thể như "Email đã tồn tại"
                throw new Error(data.message || 'Đăng ký thất bại');
            }

            // Đăng ký thành công
            setMessage({
                type: 'success',
                text: 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.',
            });
            resetForm();

            // Chuyển hướng đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                window.location.href = '/dangnhap';
            }, 2000);

        } catch (error) {
            // Hiển thị thông báo lỗi màu đỏ
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
    <div className="container mx-auto max-w-sm p-4 ">
        <h2 className="text-2xl font-bold mb-4">Đăng Ký</h2>

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
            initialValues={{ email: '', password: '', confirmPassword: '' }}
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

                    <div className="mb-4">
                        <label className="block mb-1">Nhập lại mật khẩu:</label>
                        <Field name="confirmPassword" type="password" className="w-full p-2 border border-gray-300 rounded" />
                        {errors.confirmPassword && touched.confirmPassword && (
                            <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors mt-4"
                        disabled={isSubmitting || isLoading}
                    >
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </Form>
            )}
        </Formik>

        <p className="mt-4 text-center">
            Đã có tài khoản?{' '}
            <Link href="/dangnhap" className="text-blue-500 hover:underline">
                Đăng nhập ngay
            </Link>
        </p>
    </div>  
  
);
}