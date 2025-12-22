/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import AdminLayout from "../../layouts/AdminLayout";
import { useTranslation } from "react-i18next";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "owner";
};

export default function UsersManagement() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  // const lang = i18n.language;

  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailToAdmin, setEmailToAdmin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        showToast(
          t("admin_users.error_load", { defaultValue: "فشل جلب المستخدمين" }),
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleMakeAdmin = async () => {
    if (!emailToAdmin.trim())
      return showToast(
        t("admin_users.email_required", { defaultValue: "الإيميل مطلوب!" }),
        "error"
      );

    try {
      await api.put("/auth/make-admin", { email: emailToAdmin });
      showToast(t("admin_users.make_admin_success"), "success");
      setEmailToAdmin("");
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("admin_users.make_admin_error", { defaultValue: "خطأ في التحويل" }),
        "error"
      );
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(t("admin_users.confirm_delete"))) return;

    try {
      await api.delete(`/auth/users/${email}`);
      showToast(t("admin_users.delete_success"), "success");
      setUsers(users.filter((u) => u.email !== email));
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("admin_users.delete_error", { defaultValue: "خطأ في الحذف" }),
        "error"
      );
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getRoleBadge = (role: string) => {
    const roles = {
      owner: { label: t("admin_users.owner"), color: "purple-600" },
      admin: { label: t("admin_users.admin"), color: "green-600" },
      user: { label: t("admin_users.user"), color: "gray-600" },
    };
    const { label, color } = roles[role as keyof typeof roles] || roles.user;
    return (
      <span
        className={`px-4 py-1.5 rounded-full bg-${color} text-white font-medium text-sm`}
      >
        {label}
      </span>
    );
  };

  return (
    <AdminLayout title={t("admin_users.title")}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* إضافة أدمن */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {t("admin_users.add_admin")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder={t("admin_users.admin_email")}
              value={emailToAdmin}
              onChange={(e) => setEmailToAdmin(e.target.value)}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleMakeAdmin}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition"
            >
              {t("admin_users.make_admin")}
            </button>
          </div>
        </div>

        {/* البحث */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t("admin_users.search")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* الجدول - شاشات كبيرة */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-right">
                      {t("admin_users.user_name")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_users.user_email")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_users.role")}
                    </th>
                    <th className="px-6 py-4 text-center">
                      {t("admin_users.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                      <td className="px-6 py-4 text-center">
                        {u.role !== "owner" && (
                          <button
                            onClick={() => handleDelete(u.email)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                          >
                            {t("admin_users.delete")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* البطاقات - شاشات صغيرة */}
            <div className="lg:hidden space-y-5">
              {currentUsers.map((u) => (
                <div
                  key={u._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-lg">{u.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{u.email}</p>
                  </div>

                  <div className="mb-4  flex items-center justify-between">
                    <p className="text-gray-500 mb-1">
                      {t("admin_users.role")}
                    </p>
                    {getRoleBadge(u.role)}
                  </div>

                  {u.role !== "owner" && (
                    <button
                      onClick={() => handleDelete(u.email)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition"
                    >
                      {t("admin_users.delete")}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center mt-10 gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  {t("admin_users.previous")}
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2.5 rounded-lg transition min-w-10 ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  {t("admin_users.next")}
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              {t("admin_users.showing", {
                from: indexOfFirstUser + 1,
                to: Math.min(indexOfLastUser, filteredUsers.length),
                total: filteredUsers.length,
              })}
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
