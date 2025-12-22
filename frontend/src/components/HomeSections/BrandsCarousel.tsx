
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useTranslation } from "react-i18next";

type Brand = {
  _id: string;
  name: string;
  logo?: string;
};

export default function BrandsCarousel() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get("/brands");
        setBrands(res.data.brands || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-xl">
        {t("brands.loading", { defaultValue: "جاري تحميل الماركات..." })}
      </div>
    );
  }

  if (brands.length === 0) {
    return null; // أو رسالة إذا أردت
  }

  // تكرار الماركات للحركة السلسة
  const loopedBrands = [...brands, ...brands, ...brands];

  return (
    <section
      className="py-12 mb-10 md:mb-25 overflow-hidden   bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6  ">
        <Swiper
          key={i18n.language}
          modules={[Autoplay]}
          spaceBetween={100}
          slidesPerView={2}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: isRTL, // في العربي يمشي من اليمين للشمال
          }}
          speed={6000} // حركة بطيئة وأنيقة
          loop={true}
          allowTouchMove={true} // يمنع السحب اليدوي
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 8 },
          }}
          className="mySwiper"
        >
          {loopedBrands.map((brand, index) => (
            <SwiperSlide key={`${brand._id}-${index}`}>
              <Link to={`/store`} className="block text-center">
                <div className="w-44 h-32 mx-auto flex items-center justify-center  transition-all duration-600 grayscale hover:grayscale-0 hover:scale-115 rounded-2xl ">
                  <img
                    src={
                      brand.logo ||
                      "https://via.placeholder.com/200x100?text=Logo"
                    }
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain p-6"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
