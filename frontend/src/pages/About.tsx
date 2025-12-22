import { FaAward, FaHeadphones, FaShieldAlt, FaUsers } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { GoZap } from "react-icons/go";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { LuAlarmClockCheck } from "react-icons/lu";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            {t("about.hero.title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-3xl mx-auto leading-relaxed mb-10 sm:mb-12">
            {t("about.hero.subtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-base sm:text-lg md:text-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <GoZap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("about.hero.quality")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaAward className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("about.hero.warranty")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTruckFast className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("about.hero.fast_delivery")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaShieldAlt className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("about.hero.support")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <HiWrenchScrewdriver className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("about.hero.installation")}</span>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#f9fafb"
              d="M0,0 C300,100 600,0 1440,80 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Story Section */}
      <section
        className="py-16 sm:py-20 md:py-24 bg-gray-50"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center lg:text-start text-gray-800 mb-6 md:mb-8">
                {t("about.story.title")}
              </h2>

              <div className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center lg:text-start max-w-4xl mx-auto">
                <p className="mb-6">
                  {i18n.language === "ar" ? (
                    <>
                      تأسس{" "}
                      <strong className="text-blue-700 font-bold">
                        {t("about.story.store_name")}
                      </strong>{" "}
                      في عام{" "}
                      <span dir="ltr" className="font-bold">
                        2025
                      </span>
                      ، بهدف واحد: توفير أفضل الأجهزة المنزلية الكهربائية لكل
                      بيت مصري بجودة لا تُضاهى وأسعار تنافسية.
                    </>
                  ) : (
                    <>
                      <strong className="text-blue-700 font-bold">
                        {t("about.story.store_name")}
                      </strong>{" "}
                      was founded in{" "}
                      <span dir="ltr" className="font-bold">
                        2025
                      </span>{" "}
                      with one goal: providing the best home electrical
                      appliances to every Egyptian home with unmatched quality
                      and competitive prices.
                    </>
                  )}
                </p>

                <p className="mb-10">
                  {i18n.language === "ar" ? (
                    <>
                      نعمل مع أكبر العلامات التجارية العالمية مثل{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        LG
                      </span>
                      ،{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Samsung
                      </span>
                      ،{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Bosch
                      </span>
                      ،{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Toshiba
                      </span>
                      ،{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Whirlpool
                      </span>
                      ، وغيرها، لنقدم لكم تشكيلة واسعة من الثلاجات، الغسالات،
                      التكييفات، البوتاجازات، والأجهزة الصغيرة.
                    </>
                  ) : (
                    <>
                      We partner with the world's largest brands such as{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        LG
                      </span>
                      ,{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Samsung
                      </span>
                      ,{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Bosch
                      </span>
                      ,{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Toshiba
                      </span>
                      ,{" "}
                      <span dir="ltr" className="font-bold text-indigo-700">
                        Whirlpool
                      </span>
                      , and more, to offer you a wide selection of
                      refrigerators, washing machines, air conditioners, stoves,
                      and small appliances.
                    </>
                  )}
                </p>
              </div>

              {/* Stats - تظهر بشكل متجاوب */}
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {t("about.story.tech_support")}
                  </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    15
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {t("about.story.branches")}
                  </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    10,000+
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {t("about.story.original_products")}
                  </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    50,000+
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {t("about.story.happy_clients")}
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90"
                    alt={t("about.story.image_alt")}
                    className="w-full rounded-2xl shadow-xl object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-blue-600 text-white p-5 sm:p-6 rounded-2xl shadow-2xl">
                    <p className="text-2xl sm:text-3xl font-bold">
                      {t("about.story.since")}
                    </p>
                    <p className="text-sm sm:text-base">
                      {t("about.story.building_trust")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 md:mb-16">
            {t("about.why_choose.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: FaTruckFast,
                title: "about.why_choose.free_fast_delivery",
                desc: "about.why_choose.free_fast_delivery_desc",
                color: "blue",
              },
              {
                icon: FaShieldAlt,
                title: "about.why_choose.full_warranty",
                desc: "about.why_choose.full_warranty_desc",
                color: "green",
              },
              {
                icon: FaHeadphones,
                title: "about.why_choose.specialized_support",
                desc: "about.why_choose.specialized_support_desc",
                color: "purple",
              },
              {
                icon: HiWrenchScrewdriver,
                title: "about.why_choose.free_installation",
                desc: "about.why_choose.free_installation_desc",
                color: "orange",
              },
              {
                icon: LuAlarmClockCheck,
                title: "about.why_choose.interest_free_installments",
                desc: "about.why_choose.interest_free_installments_desc",
                color: "indigo",
              },
              {
                icon: FaUsers,
                title: "about.why_choose.large_community",
                desc: "about.why_choose.large_community_desc",
                color: "pink",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-${feature.color}-100 rounded-full mb-6 group-hover:bg-${feature.color}-600 transition`}
                >
                  <feature.icon
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-${feature.color}-600 group-hover:text-white transition`}
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                  {t(feature.title)}
                </h3>
                <p className="text-base sm:text-lg text-gray-600">
                  {t(feature.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-linear-to-b from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
            {t("about.cta.title")}
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10">
            {t("about.cta.subtitle")}
          </p>
          <Link
            to="/store"
            className="inline-block bg-yellow-500 px-10 sm:px-12 py-4 sm:py-5 rounded-full text-xl sm:text-2xl font-bold hover:bg-yellow-600 transition transform hover:scale-105 shadow-2xl"
          >
            {t("about.cta.shop_now")}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
