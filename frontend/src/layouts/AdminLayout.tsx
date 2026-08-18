import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useTranslation } from "react-i18next";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = title || t("admin.layout.default_title");

  return (
    <div className="flex min-h-screen bg-surface" dir={isRTL ? "rtl" : "ltr"}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`flex-1 ${
          isRTL ? "lg:pr-64" : "lg:pl-64"
        } transition-all duration-300`}
      >
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20 lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-primary-soft transition"
            >
              <svg
                className="w-7 h-7 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-primary">{pageTitle}</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="hidden lg:block text-4xl font-bold text-ink mb-2 text-center">
              {pageTitle}
            </h1>
            <div className="hidden lg:block w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-8" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
