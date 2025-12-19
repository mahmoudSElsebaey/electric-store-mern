import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCog,
  FaHome,
  FaStore,
  FaInfoCircle,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaHeart,
  FaGlobe, // أيقونة الكرة الأرضية للغة
  FaChevronDown, // سهم الـ dropdown
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false); // dropdown اللغة
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = state.cart?.length || 0;
  const wishlistCount = state.wishlist?.length || 0;
  const isAuthenticated = state.isAuthenticated;
  const user = state.user;

  // تحميل اللغة من localStorage عند التحميل الأول
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "ar" | "en" | null;
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLang;
    }
  }, [i18n]);

  // دالة تغيير اللغة مع حفظها في localStorage
  const changeLanguage = (lng: "ar" | "en") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); // ← حفظ اللغة
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
    setLangDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout Error:", err);
    }
    dispatch({ type: "LOGOUT" });
    showToast(
      t("navbar.logout_success", { defaultValue: "تم تسجيل الخروج بنجاح!" }),
      "success"
    );
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      showToast(
        t("navbar.login_required_cart", {
          defaultValue: "يجب تسجيل الدخول أولاً للوصول إلى السلة!",
        }),
        "error"
      );
      navigate("/login");
      return;
    }
    navigate("/cart");
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  // إغلاق الـ dropdown عند الكليك خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isAuthenticated === null) {
    return (
      <nav className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-center items-center">
          <span className="text-xl font-medium">
            {t("navbar.loading_auth")}
          </span>
        </div>
      </nav>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl sticky
     top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* اللوجو */}
        <button
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer"
        >
          <span className="text-4xl md:text-2xl">⚡</span>
          <h1 className="hidden sm:block text-xl md:text-[20px] font-extrabold tracking-wide">
            {i18n.language === "ar"
              ? "متجر الأجهزة الكهربائية"
              : "Electrical Store"}
          </h1>
        </button>

        {/* الروابط في الديسكتوب */}
        <div className="hidden lg:flex items-center gap-8 text-md font-medium">
          <button
            onClick={() => handleNavClick("/")}
            className={`flex items-center gap-2 transition cursor-pointer ${
              isActive("/")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaHome /> {t("navbar.home")}
          </button>
          <button
            onClick={() => handleNavClick("/store")}
            className={`flex items-center gap-2 transition cursor-pointer ${
              isActive("/store")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaStore /> {t("navbar.store")}
          </button>
          <button
            onClick={() => handleNavClick("/about")}
            className={`flex items-center gap-2 transition cursor-pointer ${
              isActive("/about")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaInfoCircle /> {t("navbar.about")}
          </button>
          <button
            onClick={() => handleNavClick("/contact")}
            className={`flex items-center gap-2 transition cursor-pointer ${
              isActive("/contact")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaEnvelope /> {t("navbar.contact")}
          </button>
        </div>

        {/* الأزرار الجانبية */}
        <div className="flex items-center gap-6">
          {/* السلة */}
          <button
            onClick={handleCartClick}
            className={`relative group cursor-pointer ${
              isActive("/cart") ? "text-yellow-400" : ""
            }`}
            aria-label={t("navbar.cart")}
          >
            <FaShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white font-bold text-sm rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* المفضلة */}
          <button
            onClick={() => handleNavClick("/wishlist")}
            className={`relative cursor-pointer ${
              isActive("/wishlist") ? "text-yellow-400" : ""
            }`}
          >
            <FaHeart className="text-2xl hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* حساب المستخدم */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 hover:text-yellow-300 transition font-semibold cursor-pointer ${
                  isActive("/my-orders") ||
                  isActive("/profile") ||
                  isActive("/admin/dashboard")
                    ? "text-yellow-400"
                    : ""
                } ${dropdownOpen && "text-yellow-300"}`}
              >
                <span className="hidden sm:block">
                  {user?.name.split(" ")[0] || t("navbar.user")}
                </span>
                <FaUser className="text-xl" />
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute mt-4 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                    i18n.language === "ar" ? "left-0" : "right-0"
                  } `}
                >
                  <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white text-center">
                    <p className="font-bold text-lg">{user?.name}</p>
                    <p className="text-sm opacity-90">{user?.email}</p>
                  </div>

                  <div className="py-2 text-right">
                    <button
                      onClick={() => handleNavClick("/profile")}
                      className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition w-full text-right"
                    >
                      <FaUser /> {t("navbar.profile")}
                    </button>
                    <button
                      onClick={() => handleNavClick("/my-orders")}
                      className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition w-full text-right"
                    >
                      <FaShoppingCart /> {t("navbar.my_orders")}
                    </button>

                    {["admin", "owner"].includes(user?.role || "") && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={() => handleNavClick("/admin/dashboard")}
                          className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-blue-50 transition font-bold text-blue-600 w-full text-right"
                        >
                          <FaUserCog /> {t("navbar.dashboard")}
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-start gap-3 w-full px-6 py-3 hover:bg-red-50 text-red-600 transition font-semibold"
                    >
                      <FaSignOutAlt /> {t("navbar.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => handleNavClick("/login")}
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                {t("navbar.login")}
              </button>
              {/* <button
                onClick={() => handleNavClick("/register")}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                {t("navbar.register")}
              </button> */}
            </div>
          )}

          {/* Dropdown اللغة الجديد */}
          <div
            className={`relative border-gray-100/50 ${
              i18n.language === "ar" ? "border-r" : "border-l"
            } `}
            ref={langDropdownRef}
          >
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-4  transitioncursor-pointer cursor-pointer"
            >
              <div
                className={`flex  items-center gap-2 hover:text-yellow-300 ${
                  langDropdownOpen && "text-yellow-300 font-bold"
                }`}
              >
                <FaGlobe className="text-[14px]" />
                <span className="font-medium text-[14px]">
                  {i18n.language === "ar" ? "EN" : "AR"}
                </span>
              </div>
              <FaChevronDown
                className={`text-sm transition-transform ${
                  langDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langDropdownOpen && (
              <div
                className={`absolute top-full mt-2 right-0 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                  i18n.language === "ar" ? "" : " w-48 "
                }`}
              >
                <button
                  onClick={() => changeLanguage("ar")}
                  className={`w-full text-right px-6 py-3 hover:bg-gray-100 transition flex items-center gap-3  cursor-pointer ${
                    i18n.language === "ar"
                      ? "bg-gray-200 hover:bg-gray-200 font-bold"
                      : ""
                  }`}
                >
                  <span className="text-2xl">🇪🇬</span>
                  عربي
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`w-full text-right px-6 py-3 hover:bg-gray-100 transition flex items-center gap-3  cursor-pointer ${
                    i18n.language === "en"
                      ? "bg-gray-200 hover:bg-gray-200 font-bold"
                      : ""
                  }`}
                >
                  <span className="text-2xl">🇬🇧</span>
                  English
                </button>
              </div>
            )}
          </div>

          {/* زر الموبايل */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-3xl"
            aria-label="قائمة"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 px-6 py-8"
          ref={mobileMenuRef}
        >
          <div className="flex flex-col gap-6 text-lg font-medium text-right">
            {/* dropdown اللغة في الموبايل */}
            {/* <div className="flex justify-center mb-6">
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white/30 transition shadow-lg"
                >
                  <FaGlobe className="text-2xl" />
                  <span>{i18n.language === "ar" ? "عربي" : "English"}</span>
                  <FaChevronDown
                    className={`text-lg transition-transform ${
                      langDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {langDropdownOpen && (
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <button
                      onClick={() => changeLanguage("ar")}
                      className={`w-full px-6 py-4 hover:bg-gray-100 transition flex items-center gap-4 ${
                        i18n.language === "ar" ? "bg-blue-50 font-bold" : ""
                      }`}
                    >
                      <span className="text-3xl">🇪🇬</span> عربي
                    </button>
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`w-full px-6 py-4 hover:bg-gray-100 transition flex items-center gap-4 ${
                        i18n.language === "en" ? "bg-blue-50 font-bold" : ""
                      }`}
                    >
                      <span className="text-3xl">🇬🇧</span> English
                    </button>
                  </div>
                )}
              </div>
            </div> */}

            <button
              onClick={() => handleNavClick("/")}
              className={`flex items-center gap-3 transition ${
                isActive("/")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaHome /> {t("navbar.home")}
            </button>
            <button
              onClick={() => handleNavClick("/store")}
              className={`flex items-center gap-3 transition ${
                isActive("/store")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaStore /> {t("navbar.store")}
            </button>
            <button
              onClick={() => handleNavClick("/about")}
              className={`flex items-center gap-3 transition ${
                isActive("/about")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaInfoCircle /> {t("navbar.about")}
            </button>
            <button
              onClick={() => handleNavClick("/contact")}
              className={`flex items-center gap-3 transition ${
                isActive("/contact")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaEnvelope /> {t("navbar.contact")}
            </button>

            {!isAuthenticated && (
              <>
                <div className="border-t border-gray-700 pt-6 mt-4"></div>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="bg-white text-blue-700 py-3 px-6 rounded-full text-center font-bold"
                >
                  {t("navbar.login")}
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="bg-yellow-500 text-gray-900 py-3 px-6 rounded-full text-center font-bold"
                >
                  {t("navbar.register")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
