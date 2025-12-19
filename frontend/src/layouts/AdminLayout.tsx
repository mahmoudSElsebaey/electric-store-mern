import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useTranslation } from "react-i18next";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const pageTitle = title || t("admin.layout.default_title");

  return (
    <div className="flex min-h-screen bg-gray-100" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className={`flex-1 ${isRTL ? "pr-64" : "pl-64"} p-8 transition-all`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">{pageTitle}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
