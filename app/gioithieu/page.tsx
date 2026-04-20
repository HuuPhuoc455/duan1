import React from "react";
import Link from "next/link";

export default function GioiThieu() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-6">
            <span className="text-2xl">✈️</span>
            <span className="text-white font-medium tracking-widest">
              SINCE 2020
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter leading-none mb-6">
            Chúng tôi là <span className="text-amber-400">Voyage</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Mang đến những hành trình đáng nhớ và trải nghiệm du lịch tuyệt vời
            nhất cho mọi người
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center">
          <p className="text-xs tracking-widest mb-2">KHÁM PHÁ THÊM</p>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20 pb-20">
        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Hành trình bắt đầu
                <br />
                từ niềm đam mê du lịch
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Được thành lập vào năm 2020, Voyage Travel ra đời từ niềm đam
                  mê khám phá thế giới và mong muốn mang những chuyến đi tuyệt
                  vời đến gần hơn với mọi người.
                </p>
                <p>
                  Chúng tôi không chỉ bán tour du lịch — chúng tôi tạo ra những
                  kỷ niệm, những trải nghiệm đáng nhớ và những câu chuyện để bạn
                  mang về nhà.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070"
                alt="Voyage Travel Team"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-4xl font-bold text-amber-600">4+</div>
                <div className="text-sm text-gray-500">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white rounded-3xl p-10 shadow-xl">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
              🎯
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Mang đến những hành trình du lịch chất lượng cao, an toàn và đáng
              nhớ với mức giá hợp lý nhất. Chúng tôi cam kết đồng hành cùng bạn
              trên mọi chặng đường khám phá.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
              🌍
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Trở thành thương hiệu du lịch hàng đầu Việt Nam, nơi mọi người
              nghĩ đến đầu tiên khi muốn khám phá thế giới và những vẻ đẹp của
              đất nước mình.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Voyage?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Chúng tôi không chỉ bán tour, chúng tôi tạo nên những trải nghiệm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛫",
                title: "Tour chất lượng cao",
                desc: "Hợp tác với các đối tác uy tín, khách sạn 4-5 sao và hướng dẫn viên chuyên nghiệp",
              },
              {
                icon: "❤️",
                title: "Tận tâm từ trái tim",
                desc: "Đội ngũ hỗ trợ 24/7, luôn sẵn sàng lắng nghe và giải quyết mọi vấn đề của bạn",
              },
              {
                icon: "💰",
                title: "Giá trị tốt nhất",
                desc: "Cam kết giá tốt nhất thị trường cùng nhiều chương trình khuyến mãi hấp dẫn",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">
                  {item.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-20 mt-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng cho chuyến đi tiếp theo của bạn?
          </h2>
          <p className="text-white/90 text-xl mb-10">
            Hãy để Voyage Travel đồng hành cùng bạn khám phá thế giới rộng lớn
            này
          </p>
          <Link
            href="/sanpham"
            className="inline-block bg-white text-amber-600 hover:bg-amber-50 font-semibold text-xl px-12 py-5 rounded-3xl transition-all hover:scale-105"
          >
            Khám phá các tour ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
