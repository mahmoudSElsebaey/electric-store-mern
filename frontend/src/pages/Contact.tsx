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
        className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            {t("contact.hero.title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
            {t("contact.hero.subtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 text-base sm:text-lg md:text-xl">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
              <span>{t("contact.hero.whatsapp")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
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
      <section
        className="py-16 sm:py-20 md:py-24 bg-gray-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 order-1 lg:order-2 h-fit">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                {t("contact.form.title")}
              </h2>

              <form className="space-y-6 sm:space-y-8">
                <div>
                  <label className="block text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("contact.form.name_placeholder")}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-base sm:text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("contact.form.email_placeholder")}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-base sm:text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                    {t("contact.form.phone")}
                  </label>
                  <input
                    type="tel"
                    placeholder={t("contact.form.phone_placeholder")}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-base sm:text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    placeholder={t("contact.form.message_placeholder")}
                    rows={6}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-base sm:text-lg resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white py-4 sm:py-5 rounded-xl text-lg sm:text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-[1.02] shadow-lg"
                >
                  {t("contact.form.submit")}
                </button>
              </form>
            </div>

            {/* Contact Info + Map */}
            <div className="space-y-10 sm:space-y-12 order-2 lg:order-1">
              {/* معلومات التواصل */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                  {t("contact.info.title")}
                </h3>

                <div className="space-y-6 sm:space-y-8 text-base sm:text-lg">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="bg-blue-100 p-3 sm:p-4 rounded-full shrink-0">
                      <FaPhoneAlt className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <div dir="ltr">
                      <p className="font-bold text-lg sm:text-xl">
                        0100 123 4567
                      </p>
                      <p className="text-gray-600">{t("contact.info.phone")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="bg-green-100 p-3 sm:p-4 rounded-full shrink-0">
                      <FaWhatsapp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <div dir="ltr">
                      <p className="font-bold text-lg sm:text-xl">
                        0100 123 4567
                      </p>
                      <p className="text-gray-600">
                        {t("contact.info.whatsapp")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="bg-red-100 p-3 sm:p-4 rounded-full shrink-0">
                      <FaEnvelope className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                    </div>
                    <div dir="ltr">
                      <p className="font-bold text-lg sm:text-xl">
                        support@electrostore.eg
                      </p>
                      <p className="text-gray-600">{t("contact.info.email")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="bg-purple-100 p-3 sm:p-4 rounded-full shrink-0">
                      <FaMapMarkerAlt className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg sm:text-xl">
                        {isRTL ? "القاهرة - مدينة نصر" : "Cairo - Nasr City"}
                      </p>
                      <p className="text-gray-600">
                        {t("contact.info.address")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="bg-yellow-100 p-3 sm:p-4 rounded-full shrink-0">
                      <FaClock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg sm:text-xl">
                        {isRTL ? "من 9 صباحًا إلى 11 مساءً" : "9 AM to 11 PM"}
                      </p>
                      <p className="text-gray-600">{t("contact.info.hours")}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-10 sm:mt-12">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                    {t("contact.info.social_title")}
                  </h4>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <a
                      href="#"
                      className="bg-blue-600 p-3 sm:p-4 rounded-full text-white hover:bg-blue-700 hover:-translate-y-1 transition shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF className="w-6 h-6 sm:w-8 sm:h-8" />
                    </a>
                    <a
                      href="#"
                      className="bg-linear-to-r from-purple-600 to-pink-600 p-3 sm:p-4 rounded-full text-white hover:from-purple-700 hover:to-pink-700 hover:-translate-y-1 transition shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="w-6 h-6 sm:w-8 sm:h-8" />
                    </a>
                    <a
                      href="#"
                      className="bg-sky-500 p-3 sm:p-4 rounded-full text-white hover:bg-sky-600 hover:-translate-y-1 transition shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter className="w-6 h-6 sm:w-8 sm:h-8" />
                    </a>
                    <a
                      href="#"
                      className="bg-red-600 p-3 sm:p-4 rounded-full text-white hover:bg-red-700 hover:-translate-y-1 transition shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube className="w-6 h-6 sm:w-8 sm:h-8" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden h-80 sm:h-96 lg:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.250788096!2d31.343!3d30.050!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f!2sNasr%20City%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1698765432100"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع المتجر"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
