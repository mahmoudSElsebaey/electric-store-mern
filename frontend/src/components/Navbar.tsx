// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const cartCount = state.cart?.length || 0;
  const isAuthenticated = state.isAuthenticated;
  const user = state.user;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    alert("تم تسجيل الخروج بنجاح!");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* اللوجو */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <span className="text-5xl">⚡</span>
          <h1 className="text-2xl md:text-3xl font-bold hidden sm:block">
            متجر الأدوات الكهربائية
          </h1>
        </Link>

        {/* الروابط الرئيسية */}
        <div className="hidden md:flex items-center gap-6 text-lg">
          <Link to="/" className="hover:text-yellow-300 transition">
            الرئيسية
          </Link>
          <Link to="/all-products" className="hover:text-yellow-300 transition">
            جميع المنتجات
          </Link>
          <Link to="/about" className="hover:text-yellow-300 transition">
            عن الموقع
          </Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">
            تواصل معنا
          </Link>
        </div>

        {/* الجانب الأيمن: السلة + الحساب */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* أيقونة السلة */}
          <Link to="/cart" className="relative group">
            <span className="text-4xl group-hover:scale-110 transition-transform">
              🛒
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* إذا مسجل دخول */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-lg font-semibold">
                مرحباً، {user?.name.split(" ")[0] || "مستخدم"}
              </span>

              {/* إذا كان Admin */}
              {user?.isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full text-sm font-bold transition hidden sm:block"
                  >
                    لوحة الإدارة
                  </Link>
                  <Link
                    to="/admin-profile"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-5 py-2 rounded-full text-sm font-bold transition"
                  >
                    لوحة المدير
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className="hover:text-yellow-300 transition text-lg"
              >
                حسابي
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-sm font-bold transition"
              >
                تسجيل خروج
              </button>
            </div>
          ) : (
            /* إذا مش مسجل دخول */
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
