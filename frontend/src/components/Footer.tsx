import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <footer
      className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16 mt-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${
            !isRTL && "lg:grid-flow-col-dense"
          }`}
        >
          <div className={`lg:col-span-1`}>
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-amber-400 text-4xl">⚡</span>
              {t("footer.store_name")}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="bg-teal-600 p-3 rounded-full">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium">
                {t("footer.whatsapp")}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-8 relative inline-block">
              {t("footer.quick_links")}
              <span
                className={`absolute -bottom-2 ${
                  isRTL ? "right-0" : "left-0"
                } w-[50%] h-[3px] bg-amber-400 rounded-full`}
              ></span>
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link to="/" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span>🏠</span> {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span>🛒</span> {t("footer.products")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span>ℹ️</span> {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span>📞</span> {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-8 relative inline-block">
              {t("footer.contact_us")}
              <span
                className={`absolute -bottom-2 ${
                  isRTL ? "right-0" : "left-0"
                } w-[50%] h-[3px] bg-amber-400 rounded-full`}
              ></span>
            </h4>
            <ul className="space-y-5 text-gray-300">
              <li className="flex items-center gap-4">
                <div className="bg-teal-600 p-3 rounded-full">
                  <FaPhoneAlt className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">0100 123 4567</p>
                  <p className="text-sm">{t("footer.hotline")}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-teal-600 p-3 rounded-full">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">support@electrostore.eg</p>
                  <p className="text-sm">{t("footer.support_email")}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-teal-600 p-3 rounded-full">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {isRTL ? "القاهرة - مدينة نصر" : "Cairo - Nasr City"}
                  </p>
                  <p className="text-sm">{t("footer.branches")}</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-8 relative inline-block">
              {t("footer.follow_us")}
              <span
                className={`absolute -bottom-2 ${
                  isRTL ? "right-0" : "left-0"
                } w-[60%] h-[3px] bg-amber-400 rounded-full`}
              ></span>
            </h4>
            <p className="text-gray-300 mb-6">{t("footer.follow_desc")}</p>
            <div className="flex gap-5 text-3xl">
              <a
                href="#"
                className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-gradient-to-r from-teal-600 to-teal-800 rounded-full flex items-center justify-center hover:from-teal-700 hover:to-teal-900 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 ${
              !isRTL && "md:flex-row-reverse"
            }`}
          >
            <p>{t("footer.copyright")}</p>
            <div className="flex gap-8 text-sm">
              <Link to="/privacy" className="hover:text-amber-400 transition">
                {t("footer.privacy")}
              </Link>
              <Link to="/terms" className="hover:text-amber-400 transition">
                {t("footer.terms")}
              </Link>
              <Link to="/returns" className="hover:text-amber-400 transition">
                {t("footer.returns")}
              </Link>
            </div>
            <p className="text-sm">{t("footer.developed_by")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
