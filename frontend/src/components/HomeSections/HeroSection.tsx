import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import banner1 from "../../assets/banners/1.jpg";
import banner2 from "../../assets/banners/2.jpg";
import banner3 from "../../assets/banners/3.jpg";
import banner4 from "../../assets/banners/4.jpg";
import { useTranslation } from "react-i18next";

const heroSlides = [
  { id: 1, image: banner1, key: "slide1" },
  { id: 2, image: banner2, key: "slide2" },
  { id: 3, image: banner3, key: "slide3" },
  { id: 4, image: banner4, key: "slide4" },
];

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section
      className="relative h-[60vh] md:h-[80vh] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Swiper
        key={i18n.language}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        loop
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        dir={isRTL ? "rtl" : "ltr"}
        className="h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={t(`home_sections.hero.${slide.key}.title`)}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                    {t(`home_sections.hero.${slide.key}.title`)}
                  </h1>

                  <p className="text-xl md:text-3xl mb-10">
                    {t(`home_sections.hero.${slide.key}.subtitle`)}
                  </p>

                  <Link
                    to="/store"
                    className="inline-block bg-yellow-600 hover:bg-yellow-500 px-10 py-5 rounded-2xl text-xl md:text-2xl font-bold transition hover:scale-110"
                  >
                    {t(`home_sections.hero.${slide.key}.btn`)}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
