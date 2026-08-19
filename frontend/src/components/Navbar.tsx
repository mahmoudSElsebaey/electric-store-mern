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
  FaGlobe,
  FaChevronDown,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import NavbarSearch from "./NavbarSearch";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = state.cart?.length || 0;
  const wishlistCount = state.wishlist?.length || 0;
  const isAuthenticated = state.isAuthenticated;
  const user = state.user;
  const isAuthLoading = isAuthenticated === null;
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "ar" | "en" | null;
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLang;
    }
  }, [i18n]);

  const changeLanguage = (lng: "ar" | "en") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-primary-dark via-primary to-slate-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <button
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer"
        >
          <img src="/logo.svg" alt="Volt Logo" className="w-9 h-9 md:w-10 md:h-10" />
          <h1 className="hidden sm:block text-lg md:text-xl font-extrabold tracking-wide">
            {i18n.language === "ar" ? "فولت" : "Volt"}
          </h1>
        </button>

        <div className="hidden lg:flex items-center gap-8 text-md font-medium">
          {[
            { path: "/", icon: FaHome, label: t("navbar.home") },
            { path: "/store", icon: FaStore, label: t("navbar.store") },
            { path: "/about", icon: FaInfoCircle, label: t("navbar.about") },
            { path: "/contact", icon: FaEnvelope, label: t("navbar.contact") },
          ].map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              className={`flex items-center gap-2 transition cursor-pointer ${
                isActive(path) ? "text-accent font-bold" : "hover:text-accent"
              }`}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <NavbarSearch variant="desktop" />

          <button
            onClick={handleCartClick}
            className={`relative group cursor-pointer ${
              isActive("/cart") ? "text-accent" : ""
            }`}
            aria-label={t("navbar.cart")}
          >
            <FaShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-2.5 -end-2.5 bg-red-600 text-white font-bold text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick("/wishlist")}
            className={`hidden lg:block relative cursor-pointer ${
              isActive("/wishlist") ? "text-accent" : ""
            }`}
          >
            <FaHeart className="text-2xl hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2.5 -end-2.5 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                {wishlistCount}
              </span>
            )}
          </button>

          {isAuthLoading ? (
            <div className="hidden lg:flex items-center gap-2 opacity-70">
              <div className="w-8 h-8 rounded-full bg-primary/50 animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 hover:text-accent transition font-semibold cursor-pointer ${
                  isActive("/my-orders") || isActive("/profile") || isActive("/admin/dashboard")
                    ? "text-accent"
                    : ""
                } ${dropdownOpen ? "text-accent" : ""}`}
              >
                <span className="hidden sm:block">{user?.name?.split(" ")[0] || t("navbar.user")}</span>
                <FaUser className="text-xl" />
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute mt-4 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                    isRTL ? "left-0" : "right-0"
                  }`}
                >
                  <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white text-center">
                    <p className="font-bold text-lg">{user?.name}</p>
                    <p className="text-sm opacity-90">{user?.email}</p>
                  </div>
                  <div className="py-2 text-right">
                    <button onClick={() => handleNavClick("/profile")} className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition w-full text-right">
                      <FaUser /> {t("navbar.profile")}
                    </button>
                    <button onClick={() => handleNavClick("/my-orders")} className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition w-full text-right">
                      <FaShoppingCart /> {t("navbar.my_orders")}
                    </button>
                    {["admin", "owner"].includes(user?.role || "") && (
                      <>
                        <div className="border-t border-gray-200 my-2" />
                        <button onClick={() => handleNavClick("/admin/dashboard")} className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-primary-soft transition font-bold text-primary w-full text-right">
                          <FaUserCog /> {t("navbar.dashboard")}
                        </button>
                      </>
                    )}
                    <div className="border-t border-gray-200 my-2" />
                    <button onClick={handleLogout} className="flex items-center justify-start gap-3 w-full px-6 py-3 hover:bg-red-50 text-red-600 transition font-semibold">
                      <FaSignOutAlt /> {t("navbar.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => handleNavClick("/login")}
                className="bg-white text-primary-dark hover:bg-slate-100 px-6 py-2.5 rounded-full font-bold transition shadow-lg"
              >
                {t("navbar.login")}
              </button>
            </div>
          )}

          <div
            className={`hidden lg:block relative ${
              isRTL ? "border-r border-white/20" : "border-l border-white/20"
            }`}
            ref={langDropdownRef}
          >
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-4 transition cursor-pointer"
            >
              <div className={`flex items-center gap-2 hover:text-accent ${langDropdownOpen ? "text-accent font-bold" : ""}`}>
                <FaGlobe className="text-[14px]" />
                <span className="font-medium text-[14px]">{i18n.language === "ar" ? "EN" : "AR"}</span>
              </div>
              <FaChevronDown className={`text-sm transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {langDropdownOpen && (
              <div className="absolute top-full mt-2 end-0 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[10rem]">
                <button onClick={() => changeLanguage("ar")} className={`w-full text-right px-6 py-3 hover:bg-gray-100 transition flex items-center gap-3 cursor-pointer ${i18n.language === "ar" ? "bg-gray-200 font-bold" : ""}`}>
                  <span className="text-2xl">🇪🇬</span> عربي
                </button>
                <button onClick={() => changeLanguage("en")} className={`w-full text-right px-6 py-3 hover:bg-gray-100 transition flex items-center gap-3 cursor-pointer ${i18n.language === "en" ? "bg-gray-200 font-bold" : ""}`}>
                  <span className="text-2xl">🇬🇧</span> English
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-2xl p-1"
            aria-label="menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-white/10 bg-gradient-to-b from-primary-dark to-slate-900 shadow-2xl"
          ref={mobileMenuRef}
        >
          <div className={`flex flex-col gap-1 px-4 py-5 text-base font-medium ${isRTL ? "text-right" : "text-left"}`}>
            <NavbarSearch variant="mobile" />

            {!isAuthLoading && isAuthenticated && user && (
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-accent text-primary-dark flex items-center justify-center font-bold">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{user.name}</p>
                  <p className="text-xs text-white/70 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {[
              { path: "/", icon: FaHome, label: t("navbar.home") },
              { path: "/store", icon: FaStore, label: t("navbar.store") },
              { path: "/about", icon: FaInfoCircle, label: t("navbar.about") },
              { path: "/contact", icon: FaEnvelope, label: t("navbar.contact") },
            ].map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => handleNavClick(path)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition ${
                  isActive(path) ? "bg-white/15 text-accent font-bold" : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </button>
            ))}

            <button
              onClick={() => handleNavClick("/wishlist")}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-white/90 hover:bg-white/10 transition"
            >
              <span className="flex items-center gap-3">
                <FaHeart className="text-lg" />
                <span>{t("navbar.wishlist", { defaultValue: "المفضلة" })}</span>
              </span>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                changeLanguage(i18n.language === "ar" ? "en" : "ar");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-white/90 hover:bg-white/10 transition"
            >
              <FaGlobe className="text-lg" />
              <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
            </button>

            {!isAuthLoading && isAuthenticated && (
              <>
                <button onClick={() => handleNavClick("/profile")} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-white/90 hover:bg-white/10 transition">
                  <FaUser className="text-lg" />
                  <span>{t("navbar.profile", { defaultValue: "حسابي" })}</span>
                </button>
                <button onClick={() => handleNavClick("/my-orders")} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-white/90 hover:bg-white/10 transition">
                  <FaShoppingCart className="text-lg" />
                  <span>{t("navbar.my_orders")}</span>
                </button>
                {(user?.role === "admin" || user?.role === "owner") && (
                  <button onClick={() => handleNavClick("/admin/dashboard")} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-accent font-bold hover:bg-white/10 transition">
                    <FaUserCog className="text-lg" />
                    <span>{t("navbar.dashboard", { defaultValue: "لوحة التحكم" })}</span>
                  </button>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-red-300 hover:bg-red-500/20 transition"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>{t("navbar.logout", { defaultValue: "تسجيل الخروج" })}</span>
                </button>
              </>
            )}

            {!isAuthLoading && !isAuthenticated && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button onClick={() => handleNavClick("/login")} className="bg-white text-primary-dark py-3.5 rounded-xl text-center font-bold shadow-md">
                  {t("navbar.login")}
                </button>
                <button onClick={() => handleNavClick("/register")} className="bg-accent text-primary-dark py-3.5 rounded-xl text-center font-bold shadow-md">
                  {t("navbar.register")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
