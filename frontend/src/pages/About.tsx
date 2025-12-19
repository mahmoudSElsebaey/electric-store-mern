import { FaAward, FaHeadphones, FaShieldAlt, FaUsers } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { GoZap } from "react-icons/go";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { LuAlarmClockCheck } from "react-icons/lu";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            {t("about.hero.title")}
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
            {t("about.hero.subtitle")}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12 text-lg">
            <div className="flex items-center gap-3">
              <GoZap className="w-10 h-10 text-yellow-400" />
              <span>{t("about.hero.quality")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaAward className="w-10 h-10 text-yellow-400" />
              <span>{t("about.hero.warranty")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaTruckFast className="w-10 h-10 text-yellow-400" />
              <span>{t("about.hero.fast_delivery")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="w-10 h-10 text-yellow-400" />
              <span>{t("about.hero.support")}</span>
            </div>
            <div className="flex items-center gap-3">
              <HiWrenchScrewdriver className="w-10 h-10 text-yellow-400" />
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                {t("about.story.title")}
              </h2>
              <p
                className="text-xl text-gray-700 leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: t("about.story.p1") }}
              />
              <p
                className="text-xl text-gray-700 leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: t("about.story.p2") }}
              />
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    +50,000
                  </div>
                  <p className="text-gray-600">
                    {t("about.story.happy_clients")}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    +10,000
                  </div>
                  <p className="text-gray-600">
                    {t("about.story.original_products")}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    15
                  </div>
                  <p className="text-gray-600">{t("about.story.branches")}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-600">
                    {t("about.story.tech_support")}
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="bg-linear-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                  <img
                    src="/api/placeholder/600/700"
                    alt="متجر الأجهزة الكهربائية"
                    className="w-full rounded-2xl shadow-xl"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-2xl shadow-2xl">
                    <p className="text-3xl font-bold">
                      {t("about.story.since")}
                    </p>
                    <p className="text-sm">{t("about.story.building_trust")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            {t("about.why_choose.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition">
                <FaTruckFast className="w-12 h-12 text-blue-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t("about.why_choose.free_fast_delivery")}
              </h3>
              <p className="text-gray-600 text-lg">
                {t("about.why_choose.free_fast_delivery_desc")}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 group-hover:bg-green-600 transition">
                <FaShieldAlt className="w-12 h-12 text-green-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t("about.why_choose.full_warranty")}
              </h3>
              <p className="text-gray-600 text-lg">
                {t("about.why_choose.full_warranty_desc")}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6 group-hover:bg-purple-600 transition">
                <FaHeadphones className="w-12 h-12 text-purple-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t("about.why_choose.specialized_support")}
              </h3>
              <p className="text-gray-600 text-lg">
                {t("about.why_choose.specialized_support_desc")}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6 group-hover:bg-orange-600 transition">
                <HiWrenchScrewdriver className="w-12 h-12 text-orange-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t("about.why_choose.free_installation")}
              </h3>
              <p className="text-gray-600 text-lg">
                {t("about.why_choose.free_installation_desc")}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-600 transition">
                <LuAlarmClockCheck className="w-12 h-12 text-indigo-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t("about.why_choose.interest_free_installments")}
              </h3>
              <p className="text-gray-600 text-lg">
                {t("about.why_choose.interest_free_installments_desc")}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-100 rounded-full mb-6 group-hover:bg-pink-600 transition">
                <FaUsers className="w-12 h-12 text-pink-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t("about.why_choose.large_community")}
              </h3>
              <p className="text-gray-600 text-lg">
                {t("about.why_choose.large_community_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-b from-blue-900 via-blue-800 to-indigo-900 text-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {t("about.cta.title")}
          </h2>
          <p className="text-xl mb-10">{t("about.cta.subtitle")}</p>
          <Link
            to="/store"
            className="bg-yellow-500 px-12 py-5 rounded-full text-2xl font-bold hover:bg-yellow-600 transition transform hover:scale-105 shadow-2xl"
          >
            {t("about.cta.shop_now")}
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
