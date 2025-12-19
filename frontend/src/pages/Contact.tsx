import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-32 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
            {t("contact.hero.title")}
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
            {t("contact.hero.subtitle")}
          </p>
          <div className="mt-12 flex justify-center gap-25 text-2xl flex-wrap">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="w-10 h-10 text-green-400" />
              <span>{t("contact.hero.whatsapp")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="w-10 h-10 text-yellow-400" />
              <span>{t("contact.hero.hotline")}</span>
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

      {/* Main Content */}
      <section className="py-20 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`grid lg:grid-cols-2 gap-16 items-start ${
              !isRTL &&
              "lg:grid-cols-2 lg:[&>div:nth-child(1)]:order-2 lg:[&>div:nth-child(2)]:order-1"
            }`}
          >
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-8">
                {t("contact.form.title")}
              </h2>
              <form className="space-y-8">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("contact.form.name_placeholder")}
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("contact.form.email_placeholder")}
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t("contact.form.phone")}
                  </label>
                  <input
                    type="tel"
                    placeholder={t("contact.form.phone_placeholder")}
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    placeholder={t("contact.form.message_placeholder")}
                    rows={7}
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 shadow-2xl"
                >
                  {t("contact.form.submit")}
                </button>
              </form>
            </div>

            {/* Contact Info + Map */}
            <div className="space-y-12">
              {/* معلومات التواصل */}
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-10">
                  {t("contact.info.title")}
                </h3>
                <div className="space-y-8 text-lg">
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <FaPhoneAlt className="w-8 h-8 text-blue-600" />
                    </div>
                    <div dir="ltr">
                      <p className="font-bold text-xl">0100 123 4567</p>
                      <p className="text-gray-600">{t("contact.info.phone")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-green-100 p-4 rounded-full">
                      <FaWhatsapp className="w-8 h-8 text-green-600" />
                    </div>
                    <div dir="ltr">
                      <p className="font-bold text-xl">0100 123 4567</p>
                      <p className="text-gray-600">
                        {t("contact.info.whatsapp")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-red-100 p-4 rounded-full">
                      <FaEnvelope className="w-8 h-8 text-red-600" />
                    </div>
                    <div dir="ltr">
                      <p className="font-bold text-xl">
                        support@electrostore.eg
                      </p>
                      <p className="text-gray-600">{t("contact.info.email")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <FaMapMarkerAlt className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">
                        {isRTL ? "القاهرة - مدينة نصر" : "Cairo - Nasr City"}
                      </p>
                      <p className="text-gray-600">
                        {t("contact.info.address")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-yellow-100 p-4 rounded-full">
                      <FaClock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">
                        {isRTL ? "من 9 صباحًا إلى 11 مساءً" : "9 AM to 11 PM"}
                      </p>
                      <p className="text-gray-600">{t("contact.info.hours")}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6">
                    {t("contact.info.social_title")}
                  </h4>
                  <div className="flex gap-6 text-4xl text-white">
                    <a
                      href="#"
                      className="bg-blue-600 p-4 rounded-full hover:bg-blue-700 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="#"
                      className="bg-linear-to-r from-purple-600 to-pink-600 p-4 rounded-full hover:from-purple-700 hover:to-pink-700 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="#"
                      className="bg-sky-500 p-4 rounded-full hover:bg-sky-600 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="#"
                      className="bg-red-600 p-4 rounded-full hover:bg-red-700 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaYoutube />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-full h-96 flex items-center justify-center">
                <p className="text-3xl text-gray-500">
                  {t("contact.info.map")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
