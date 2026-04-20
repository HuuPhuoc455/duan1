import ProductCard from "./component/ProductCard";
import { Product } from "./types/product";
import Link from "next/link";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể tải dữ liệu");
  }

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  const getCategoryName = (product: Product) =>
    typeof product.categoryId === "string"
      ? product.categoryId
      : product.categoryId?.name || "";

  const productHot = products.filter((product: Product) => product.hot === 1);
  const productTourTrongNuoc = products.filter(
    (product: Product) => getCategoryName(product) === "Du Lịch Trong Nước",
  );
  const productTourNuocNgoai = products.filter(
    (product: Product) => getCategoryName(product) === "Du Lịch Quốc Tế",
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Hiện đại & ấn tượng */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
            Khám Phá <span className="text-amber-400">Thế Giới</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10">
            Những hành trình đáng nhớ • Trải nghiệm tuyệt vời • Kỷ niệm không
            quên
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sanpham"
              className="bg-white text-gray-900 hover:bg-amber-400 hover:text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl"
            >
              Khám phá ngay
            </Link>
            <Link
              href="#featured"
              className="border-2 border-white/80 text-white hover:bg-white/10 font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-300"
            >
              Xem tour nổi bật
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center">
          <p className="text-sm tracking-widest mb-2">SCROLL</p>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Tour nổi bật */}
        <section id="featured" className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-600 font-medium mb-2">
                <span className="text-2xl">★</span> HOT TOUR
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Tour nổi bật</h2>
            </div>
            <Link
              href="/sanpham"
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 group"
            >
              Xem tất cả
              <span className="group-hover:translate-x-1 transition">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productHot.slice(0, 4).map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Tour trong nước */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trong nước
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Khám phá những vẻ đẹp thiên nhiên và văn hóa đặc sắc của Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productTourTrongNuoc.slice(0, 4).map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/sanpham?category=Du%20Lịch%20Trong%20Nước"
              className="inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300"
            >
              Xem tất cả tour trong nước
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Tour nước ngoài */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">✈️</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Du lịch quốc tế
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Những điểm đến mơ ước trên toàn thế giới đang chờ bạn khám phá
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productTourNuocNgoai.slice(0, 4).map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/sanpham?category=Du%20Lịch%20Quốc%20Tế"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
            >
              Khám phá tour quốc tế
              <span>🌍</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
