// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

export default function Navbar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = state.cart?.length || 0;
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
    setMobileMenuOpen(false);
  };

  // إغلاق الدروداون والمينو عند الكليك خارج
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
        className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-center items-center">
          <span className="text-xl font-medium">
            جارٍ التحقق من تسجيل الدخول...
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav
      dir="rtl"
      className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* اللوجو */}
        <Link
          to="/"
          className="flex items-center gap-4 hover:opacity-90 transition"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="text-5xl">⚡</span>
          <h1 className="hidden sm:block text-2xl md:text-3xl font-extrabold tracking-wide">
            متجر الأجهزة الكهربائية
          </h1>
        </Link>

        {/* الروابط في الديسكتوب */}
        <div className="hidden lg:flex items-center gap-5 text-lg font-medium">
          <Link
            to="/"
            className="hover:text-yellow-300 transition flex items-center gap-2"
          >
            <FaHome />
            الرئيسية
          </Link>
          <Link
            to="/store"
            className="hover:text-yellow-300 transition flex items-center gap-2"
          >
            <FaStore />
            المتجر
          </Link>
          <Link
            to="/about"
            className="hover:text-yellow-300 transition flex items-center gap-2"
          >
            <FaInfoCircle />
            من نحن
          </Link>
          <Link
            to="/contact"
            className="hover:text-yellow-300 transition flex items-center gap-2"
          >
            <FaEnvelope />
            تواصل معنا
          </Link>
        </div>

        {/* الأزرار اليمين (في RTL هتكون على اليسار فعليًا) */}
        <div className="flex items-center gap-6">
          {/* السلة */}
          <button
            onClick={handleCartClick}
            className="relative group"
            aria-label="السلة"
          >
            <FaShoppingCart className="text-3xl group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* حساب المستخدم أو تسجيل الدخول */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:text-yellow-300 transition font-semibold text-lg"
              >
                <span className="hidden sm:block">
                  {user?.name.split(" ")[0] || "مستخدم"}
                </span>
                <FaUser className="text-2xl" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-4 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
                    <p className="font-bold text-lg">{user?.name}</p>
                    <p className="text-sm opacity-90">{user?.email}</p>
                  </div>

                  <div className="py-2 text-right">
                    <Link
                      to="/profile"
                      className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser />
                      حسابي الشخصي 
                    </Link>

                    <Link
                      to="/my-orders"
                      className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaShoppingCart />
                      طلباتي 
                    </Link>

                    {["admin", "owner"].includes(user?.role || "") && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center justify-start gap-3 px-6 py-3 hover:bg-blue-50 transition font-bold text-blue-600"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaUserCog />
                          لوحة التحكم 
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-start gap-3 w-full px-6 py-3 hover:bg-red-50 text-red-600 transition font-semibold cursor-pointer"
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
              <Link
                to="/login"
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-full font-bold transition shadow-lg"
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          {/* زر الموبايل مينو */}
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
          className="lg:hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900  px-6 py-8"
          ref={mobileMenuRef}
        >
          <div className="flex flex-col gap-6 text-lg font-medium text-right">
            <Link
              to="/"
              className="hover:text-yellow-300 transition flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHome />
              الرئيسية
            </Link>
            <Link
              to="/store"
              className="hover:text-yellow-300 transition flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaStore />
              المتجر
            </Link>
            <Link
              to="/about"
              className="hover:text-yellow-300 transition flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaInfoCircle />
              من نحن
            </Link>
            <Link
              to="/contact"
              className="hover:text-yellow-300 transition flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaEnvelope />
              تواصل معنا
            </Link>

            {!isAuthenticated && (
              <>
                <div className="border-t border-gray-700 pt-6 mt-4"></div>
                <Link
                  to="/login"
                  className="bg-white text-blue-700 py-3 px-6 rounded-full text-center font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 text-gray-900 py-3 px-6 rounded-full text-center font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
