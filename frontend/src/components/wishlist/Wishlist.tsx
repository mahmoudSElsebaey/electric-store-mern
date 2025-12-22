import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import { FaHeart, FaStore, FaTag } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import Footer from "../Footer";
import { useTranslation } from "react-i18next";

export default function Wishlist() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { state } = useStore();

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight flex items-center justify-center gap-4 sm:gap-6">
            <FaHeart className="text-5xl sm:text-6xl md:text-8xl text-red-400" />
            {t("wishlist.hero_title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
            {t("wishlist.hero_subtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-base sm:text-lg md:text-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaHeart className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
              <span>{t("wishlist.save_love")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTag className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("wishlist.exclusive_offers")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTruckFast className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("wishlist.fast_delivery")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaStore className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("wishlist.always_available")}</span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#f9fafb"
              d="M0,0 C300,100 600,0 1440,80 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Wishlist Content */}
      <div
        className="min-h-screen bg-gray-50 py-12 sm:py-16 md:py-20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {state.wishlistLoading ? (
            <div className="text-center py-20 sm:py-32">
              <div className="text-2xl sm:text-3xl text-blue-600 animate-pulse">
                {t("wishlist.loading")}
              </div>
            </div>
          ) : state.wishlist.length === 0 ? (
            <div className="text-center py-20 sm:py-32">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
                {t("wishlist.empty")}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10">
                {t("wishlist.empty_desc")}
              </p>
              <Link
                to="/store"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold transition transform hover:scale-105 shadow-lg"
              >
                {t("wishlist.browse_store")}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800">
                {t("wishlist.count", { count: state.wishlist.length })}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {state.wishlist.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
