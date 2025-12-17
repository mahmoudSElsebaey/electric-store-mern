import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../ProductCard";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoStar } from "react-icons/io5";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: { _id: string; name: string; logo?: string };
  category: { _id: string; name: string };
  countInStock: number;
  rating: number;
  numReviews: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndShuffle = async () => {
      try {
        // نجيب 30 منتج (أو أكتر لو عايز تنويع أكبر)
        const res = await api.get("/products?limit=30");
        const fetchedProducts = res.data.products || res.data || [];

        // نختار 8 منتجات عشوائي
        const shuffled = [...fetchedProducts].sort(() => 0.5 - Math.random());
        const random8 = shuffled.slice(0, 8);

        setProducts(random8);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndShuffle();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-2xl text-gray-600">
        جاري تحميل المنتجات المميزة...
      </div>
    );
  }

  // لو مفيش منتجات كافية (أقل من 8)
  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-2xl text-gray-600">
        لا توجد منتجات متاحة حاليًا
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl text-center font-bold text-gray-800 flex justify-center items-center gap-2">
            <IoStar className="inline-block text-[10px] text-yellow-500" />
            <IoStar className="inline-block text-[20px] text-yellow-500" />
            <IoStar className="inline-block text-[40px] text-yellow-500" />
            المنتجات المميزة
            <IoStar className="inline-block text-[40px] text-yellow-500" />
            <IoStar className="inline-block text-[20px] text-yellow-500" />
            <IoStar className="inline-block text-[10px] text-yellow-500" />
          </h2>
          <Link
            to="/store"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
          >
            عرض الكل
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={-15}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={products.length > 4} // loop بس لو أكتر من 4 عشان ميبقاش غريب
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className=" h-full my-4">
              <div className="px-4 h-full">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
