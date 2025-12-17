import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useStore();
  const user = state.user;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div
      className="fixed top-0 right-0 w-64 h-full bg-gray-900 text-white p-6 overflow-y-auto z-40 shadow-2xl"
      dir="rtl"
    >
      <div className="text-2xl font-bold text-center mb-12">لوحة التحكم</div>
      <nav className="space-y-4 pt-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
        >
          <svg
            className="w-6 h-6 ml-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          الرئيسية
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
        >
          <svg
            className="w-6 h-6 ml-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          إدارة الطلبات
        </Link>

        <Link
          to="/admin/products"
          className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
        >
          <svg
            className="w-6 h-6 ml-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          إدارة المنتجات
        </Link>

        <Link
          to="/admin/brands"
          className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
        >
          <svg
            className="w-6 h-6 ml-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          إدارة الماركات
        </Link>

        <Link
          to="/admin/categories"
          className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
        >
          <svg
            className="w-6 h-6 ml-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          إدارة التصنيفات
        </Link>
       
        {user?.role === "owner" && (
          <Link
            to="/admin/users"
            className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
          >
            <svg
              className="w-6 h-6 ml-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            إدارة العملاء
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer p-3 bg-red-800 hover:bg-red-900 rounded-xl transition w-full text-right mt-4"
        >
          <svg
            className="w-6 h-6 ml-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          تسجيل الخروج
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
