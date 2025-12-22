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
      className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Swiper
        key={i18n.language}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        loop
        speed={1200}
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
                className="w-full h-full object-cover brightness-75"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 sm:px-8">
                <div className="max-w-4xl w-full">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                    {t(`home_sections.hero.${slide.key}.title`)}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-10 drop-shadow-xl">
                    {t(`home_sections.hero.${slide.key}.subtitle`)}
                  </p>

                  <Link
                    to="/store"
                    className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full text-lg sm:text-xl md:text-2xl transition transform hover:scale-105 shadow-2xl"
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