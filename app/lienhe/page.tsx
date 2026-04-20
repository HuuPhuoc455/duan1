"use client";

import React, { useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function LienHe() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập gửi form (bạn có thể thay bằng API thật sau)
    setTimeout(() => {
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-20 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Liên hệ với Voyage
          </h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong hành trình du
            lịch
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Thông tin liên hệ */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Thông tin liên hệ
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Địa chỉ văn phòng
                    </p>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      123 Nguyễn Huệ, Quận 1<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Hotline hỗ trợ
                    </p>
                    <p className="text-gray-600 mt-1">0123 456 789</p>
                    <p className="text-gray-600">0987 654 321 (Đặt tour)</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600 mt-1">
                      contact@voyagetravel.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Giờ làm việc</p>
                    <p className="text-gray-600 mt-1">
                      Thứ 2 - Chủ nhật: 8:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 bg-gray-200 rounded-3xl h-80 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">
                    📍 Bản đồ sẽ được nhúng tại đây
                  </p>
                  <p className="text-xs text-gray-400">Google Maps / Leaflet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-gray-600 mb-8">
                Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                      placeholder="0123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung tin nhắn
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-y"
                    placeholder="Bạn muốn tư vấn về tour nào? Hoặc có câu hỏi gì cho chúng tôi..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-5 rounded-3xl text-lg transition-all disabled:opacity-70"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
