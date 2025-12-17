import { Link } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Import الصور
import banner1 from "../../assets/banners/1.jpg";
import banner2 from "../../assets/banners/2.jpg";
import banner3 from "../../assets/banners/3.jpg";
import banner4 from "../../assets/banners/4.jpg";

const heroSlides = [
  {
    id: 1,
    title: "أفضل الأجهزة المنزلية بجودة عالية",
    subtitle: "ثلاجات، غسالات، تكييفات من أكبر الماركات بأسعار تنافسية",
    btnText: "تسوق الآن",
    image: banner1,
  },
  {
    id: 2,
    title: "أحدث الأجهزة الكهربائية لمنزلك",
    subtitle: "شحن مجاني للطلبات فوق 500 جنيه + ضمان رسمي",
    btnText: "استكشف العروض",
    image: banner2,
  },
  {
    id: 3,
    title: "عروض خاصة على الأجهزة الصغيرة",
    subtitle: "خلاطات، مكاوي، مكانس، ماكينات قهوة بخصومات تصل إلى 40%",
    btnText: "احجز عرضك",
    image: banner3,
  },
  {
    id: 4,
    title: "توفير كبير على أجهزة المطبخ والمنزل",
    subtitle: "خصومات حصرية على الميكروويف، الفرن، والمدفأة",
    btnText: "تسوق الآن",
    image: banner4,
  },
];

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade" // حركة fade أنيقة جدًا
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true, type: "bullets" }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={1000}
        className="h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />{" "}
              {/* Dark Overlay */}
              <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-3xl mb-10 drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                  <Link
                    to="/store"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl md:text-2xl font-bold transition transform hover:scale-110 shadow-2xl"
                  >
                    {slide.btnText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Arrows */}
        <div className="swiper-button-prev text-white/30! hover:text-white/60! w-12! h-12!  rounded-full" />
        <div className="swiper-button-next text-white/30! hover:text-white/60! w-12! h-12! after:!text-3xl! rounded-full" />
      </Swiper>

      {/* Dots تحت (Swiper بيعملهم تلقائي) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="swiper-pagination" />
      </div>
    </section>
  );
}
