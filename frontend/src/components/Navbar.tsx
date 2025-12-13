// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    navigate("/login");
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً للوصول إلى السلة!", "error");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isAuthenticated === null) {
    return (
      <nav className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-center items-center">
          <span className="text-xl">جارٍ التحقق من تسجيل الدخول...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <span className="text-5xl">⚡</span>
          <h1 className="text-2xl md:text-3xl font-bold hidden sm:block">
            متجر الأدوات الكهربائية
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-lg">
          <Link to="/" className="hover:text-yellow-300 transition">
            الرئيسية
          </Link>
          <Link to="/store" className="hover:text-yellow-300 transition">
            المتجر
          </Link>
          <Link to="/about" className="hover:text-yellow-300 transition">
            عن الموقع
          </Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">
            تواصل معنا
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={handleCartClick} className="relative group">
            <span className="text-4xl group-hover:scale-110 transition-transform">
              🛒
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:text-yellow-300 transition text-lg font-semibold"
              >
                {user?.name.split(" ")[0] || "مستخدم"} ▼
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl py-2 z-50">
                  {/* كل المستخدمين يشوفوا البروفايل */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    حسابي
                  </Link>

                  {/* Owner فقط يشوف Dashboard */}
                  {user?.role === "owner" && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      لوحة التحكم (Owner)
                    </Link>
                  )}

                  {/* Admin و Owner يشوفوا إدارة المنتجات */}
                  {(user?.role === "admin" || user?.role === "owner") && (
                    <Link
                      to="/products-management"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      إدارة المنتجات
                    </Link>
                  )}

                  {/* Owner فقط يشوف إدارة المستخدمين */}
                  {user?.role === "owner" && (
                    <Link
                      to="/users-management"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      إدارة المستخدمين
                    </Link>
                  )}

                  {/* تسجيل الخروج */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    تسجيل خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-bold transition"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
