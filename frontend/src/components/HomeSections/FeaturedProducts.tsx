import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndShuffle = async () => {
      try {
        const res = await api.get("/products?limit=30");
        const fetchedProducts = res.data.products || res.data || [];

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
        {t("featured.loading", {
          defaultValue: "جاري تحميل المنتجات المميزة...",
        })}
      </div>
    );
  }

  // لو مفيش منتجات كافية (أقل من 8)
  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-2xl text-gray-600">
        {t("featured.no_products", {
          defaultValue: "لا توجد منتجات متاحة حاليًا",
        })}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6">
        <Swiper
          key={i18n.language}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={-15}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={products.length > 4}
          allowTouchMove={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className=" h-full my-10 pb-6">
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
