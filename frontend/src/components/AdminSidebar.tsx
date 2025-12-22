import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { dispatch, state } = useStore();
  const user = state.user;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const activeClassName =
    "flex items-center p-3 bg-blue-600 text-white rounded-xl transition shadow-lg font-bold";
  const inactiveClassName =
    "flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition";

  return (
    <>
      {/* Overlay للموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          isRTL ? "right-0" : "left-0"
        } h-full w-64 bg-gray-900 text-white p-6 overflow-y-auto z-40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-2xl font-bold text-center mb-12 text-blue-400">
          {t("admin.sidebar.title")}
        </div>

        <nav className="space-y-4">
          <NavLink
            to="/admin/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? activeClassName : inactiveClassName
            }
          >
            <svg
              className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
            {t("admin.sidebar.dashboard")}
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? activeClassName : inactiveClassName
            }
          >
            <svg
              className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
            {t("admin.sidebar.orders")}
          </NavLink>

          {/* لينك المنتجات صحيح دلوقتي */}
          <NavLink
            to="/admin/products"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? activeClassName : inactiveClassName
            }
          >
            <svg
              className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
            {t("admin.sidebar.products")}
          </NavLink>

          <NavLink
            to="/admin/brands"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? activeClassName : inactiveClassName
            }
          >
            <svg
              className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
            {t("admin.sidebar.brands")}
          </NavLink>

          <NavLink
            to="/admin/categories"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? activeClassName : inactiveClassName
            }
          >
            <svg
              className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
            {t("admin.sidebar.categories")}
          </NavLink>

          {user?.role === "owner" && (
            <NavLink
              to="/admin/users"
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? activeClassName : inactiveClassName
              }
            >
              <svg
                className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
              {t("admin.sidebar.users")}
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer p-3 bg-red-800 hover:bg-red-900 rounded-xl transition w-full shadow-lg mt-8"
          >
            <svg
              className={`w-6 h-6 ${isRTL ? "ml-4" : "mr-4"}`}
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
            {t("admin.sidebar.logout")}
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;