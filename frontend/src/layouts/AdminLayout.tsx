import React from "react";
import AdminSidebar from "../components/AdminSidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = "لوحة التحكم" }) => {
  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Sidebar يمين */}
      <AdminSidebar />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 pr-68 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;