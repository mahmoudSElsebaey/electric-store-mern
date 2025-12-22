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
      <div className="py-16 sm:py-20 text-center text-xl sm:text-2xl text-gray-600">
        {t("featured.loading", {
          defaultValue: "جاري تحميل المنتجات المميزة...",
        })}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 sm:py-20 text-center text-xl sm:text-2xl text-gray-600">
        {t("featured.no_products", {
          defaultValue: "لا توجد منتجات متاحة حاليًا",
        })}
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          {t("home_sections.featured.title")}
        </h2>

        <Swiper
          key={i18n.language}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={products.length > 4}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 28 },
            1280: { slidesPerView: 5, spaceBetween: 32 },
          }}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto! pb-10">
              <div className="px-2 sm:px-3 h-full">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}