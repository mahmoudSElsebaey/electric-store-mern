import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper CSS (بدون navigation و pagination)
import "swiper/css";
import { IoStar } from "react-icons/io5";

type Brand = {
  _id: string;
  name: string;
  logo?: string;
};

export default function BrandsCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get("/brands");
        setBrands(res.data);
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
      <div className="py-16 text-center text-xl">جاري تحميل الماركات...</div>
    );
  }

  // نكرر الماركات عشان الـ loop يبقى سلس أكتر (اختياري بس مفيد)
  const loopedBrands = [...brands, ...brands];

  return (
    <section className="py-12  overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          تسوق حسب الماركة
        </h2> */}

        <h2 className="text-4xl font-bold text-gray-800 flex justify-center items-center gap-2 mb-12">
          <IoStar className="inline-block text-[10px] text-yellow-500" />
          <IoStar className="inline-block text-[20px] text-yellow-500" />
          <IoStar className="inline-block text-[40px] text-yellow-500" />
          الماركات
          <IoStar className="inline-block text-[40px] text-yellow-500" />
          <IoStar className="inline-block text-[20px] text-yellow-500" />
          <IoStar className="inline-block text-[10px] text-yellow-500" />
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={160}
          slidesPerView={2}
          autoplay={{
            delay: 0, // مهم جدًا: 0 عشان يبقى حركة مستمرة بدون توقف
            disableOnInteraction: false,
            reverseDirection: false, // لو عايز يمشي من اليمين للشمال غير لـ true
          }}
          speed={5000} // سرعة الحركة (كل ما أكبر = أبطأ وأنعم)
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
              {/* <Link to={`/store?brand=${brand._id}`} className="block text-center"> */}
              <Link to={`/store`} className="block text-center">
                <div className="w-44 h-32 mx-auto flex items-center justify-center hover:shadow-2xl transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110">
                  <img
                    src={
                      brand.logo ||
                      "https://via.placeholder.com/200x100?text=Logo"
                    }
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain p-6"
                  />
                </div>
                {/* <p className="mt-4 text-lg font-semibold text-gray-700">
                  {brand.name}
                </p> */}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
