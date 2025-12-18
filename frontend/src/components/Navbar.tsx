// src/components/Navbar.tsx
import { useLocation, useNavigate } from "react-router-dom"; // ← أضفنا useLocation
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
} from "react-icons/fa";
import { LiaQuestionSolid } from "react-icons/lia";

export default function Navbar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation(); // ← جديد: عشان نعرف الصفحة الحالية
  const { showToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = state.cart?.length || 0;
  const wishlistCount = state.wishlist?.length || 0;
  const isAuthenticated = state.isAuthenticated;
  const user = state.user;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout Error:", err);
    }
    dispatch({ type: "LOGOUT" });
    showToast("تم تسجيل الخروج بنجاح!", "success");
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً للوصول إلى السلة!", "error");
      navigate("/login");
      return;
    }
    navigate("/cart");
    window.scrollTo(0, 0); // ← جديد: scroll to top
    setMobileMenuOpen(false);
  };

  // دالة عامة للتنقل + scroll to top
  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0); // ← scroll من أول الصفحة
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  // إغلاق عند الكليك خارج
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
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
      <nav
        dir="rtl"
        className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-center items-center">
          <span className="text-xl font-medium">
            جارٍ التحقق من تسجيل الدخول...
          </span>
        </div>
      </nav>
    );
  }

  // دالة مساعدة عشان نتحقق إذا الروت نشط
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      dir="rtl"
      className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* اللوجو */}
        <button
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-4 hover:opacity-90 transition cursor-pointer"
        >
          <span className="text-5xl">⚡</span>
          <h1 className="hidden sm:block text-2xl md:text-3xl font-extrabold tracking-wide">
            متجر الأجهزة الكهربائية
          </h1>
        </button>

        {/* الروابط في الديسكتوب */}
        <div className="hidden lg:flex items-center gap-8 text-lg font-medium">
          <button
            onClick={() => handleNavClick("/")}
            className={`flex items-center gap-2 transition cursor-pointer ${
              isActive("/")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaHome />
            الرئيسية
          </button>
          <button
            onClick={() => handleNavClick("/store")}
            className={`flex items-center gap-2 transition  cursor-pointer ${
              isActive("/store")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaStore />
            المتجر
          </button>

          <button
            onClick={() => handleNavClick("/contact")}
            className={`flex items-center gap-2 transition  cursor-pointer ${
              isActive("/contact")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            <FaEnvelope />
            تواصل معنا
          </button>
          <button
            onClick={() => handleNavClick("/about")}
            className={`flex items-center gap-1 transition  cursor-pointer ${
              isActive("/about")
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
            }`}
          >
            من نحن
            <LiaQuestionSolid className="rotate-y-180 " />
          </button>
        </div>

        {/* الأزرار اليمين */}
        <div className="flex items-center gap-6">
          {/* السلة */}
          <button
            onClick={handleCartClick}
            className={`relative group cursor-pointer ${
              isActive("/cart") ? "text-yellow-400" : ""
            }`}
            aria-label="السلة"
          >
            <FaShoppingCart className="text-3xl group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* المفضلة */}
          <button
            onClick={() => handleNavClick("/wishlist")}
            className={`relative  cursor-pointer ${
              isActive("/wishlist") ? "text-yellow-400" : ""
            }`}
          >
            <FaHeart className="text-3xl hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* حساب المستخدم */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`relative flex items-center gap-3 hover:text-yellow-300 transition font-semibold text-lg  cursor-pointer ${
                  isActive("/my-orders") ||
                  isActive("/profile") ||
                  isActive("/admin/dashboard")
                    ? "text-yellow-400"
                    : ""
                }`}
              >
                <span className="hidden sm:block">
                  {user?.name.split(" ")[0] || "مستخدم"}
                </span>
                <FaUser className="text-2xl" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-4 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white text-center">
                    <p className="font-bold text-lg">{user?.name}</p>
                    <p className="text-sm opacity-90">{user?.email}</p>
                  </div>

                  <div className="py-2 text-right">
                    <button
                      onClick={() => handleNavClick("/profile")}
                      className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition w-full text-right"
                    >
                      <FaUser />
                      حسابي الشخصي
                    </button>

                    <button
                      onClick={() => handleNavClick("/my-orders")}
                      className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition w-full text-right"
                    >
                      <FaShoppingCart />
                      طلباتي
                    </button>

                    {["admin", "owner"].includes(user?.role || "") && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={() => handleNavClick("/admin/dashboard")}
                          className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-blue-50 transition font-bold text-blue-600 w-full text-right"
                        >
                          <FaUserCog />
                          لوحة التحكم
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-start gap-3 w-full px-6 py-3 hover:bg-red-50 text-red-600 transition font-semibold"
                    >
                      <FaSignOutAlt />
                      تسجيل الخروج
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
                تسجيل الدخول
              </button>
              <button
                onClick={() => handleNavClick("/register")}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                إنشاء حساب
              </button>
            </div>
          )}

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
          dir="rtl"
          className="lg:hidden bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 px-6 py-8"
          ref={mobileMenuRef}
        >
          <div className="flex flex-col gap-6 text-lg font-medium text-right">
            <button
              onClick={() => handleNavClick("/")}
              className={`flex items-center gap-3 transition ${
                isActive("/")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaHome />
              الرئيسية
            </button>
            <button
              onClick={() => handleNavClick("/store")}
              className={`flex items-center gap-3 transition ${
                isActive("/store")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaStore />
              المتجر
            </button>
            <button
              onClick={() => handleNavClick("/about")}
              className={`flex items-center gap-3 transition ${
                isActive("/about")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaInfoCircle />
              من نحن
            </button>
            <button
              onClick={() => handleNavClick("/contact")}
              className={`flex items-center gap-3 transition ${
                isActive("/contact")
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
            >
              <FaEnvelope />
              تواصل معنا
            </button>

            {!isAuthenticated && (
              <>
                <div className="border-t border-gray-700 pt-6 mt-4"></div>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="bg-white text-blue-700 py-3 px-6 rounded-full text-center font-bold"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="bg-yellow-500 text-gray-900 py-3 px-6 rounded-full text-center font-bold"
                >
                  إنشاء حساب
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
