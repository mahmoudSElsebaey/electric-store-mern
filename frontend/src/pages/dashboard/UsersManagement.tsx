/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import AdminLayout from "../../layouts/AdminLayout";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "owner";
};

export default function UsersManagement() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailToAdmin, setEmailToAdmin] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        showToast("فشل جلب المستخدمين", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleMakeAdmin = async () => {
    if (!emailToAdmin.trim()) return showToast("الإيميل مطلوب!", "error");

    try {
      await api.put("/auth/make-admin", { email: emailToAdmin });
      showToast("تم تحويل المستخدم إلى أدمن بنجاح!", "success");
      setEmailToAdmin("");
      // تحديث القائمة
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err: any) {
      showToast(err.response?.data?.message || "خطأ في التحويل", "error");
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm("متأكد من حذف هذا المستخدم؟")) return;

    try {
      await api.delete(`/auth/users/${email}`);
      showToast("تم حذف المستخدم بنجاح", "success");
      setUsers(users.filter((u) => u.email !== email));
    } catch (err: any) {
      showToast(err.response?.data?.message || "خطأ في الحذف", "error");
    }
  };

  // تصفية المستخدمين
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return (
          <span className="px-4 py-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold">
            المالك
          </span>
        );
      case "admin":
        return (
          <span className="px-4 py-2 rounded-full bg-green-600 text-white font-bold">
            أدمن
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 rounded-full bg-gray-600 text-white">
            مستخدم
          </span>
        );
    }
  };

  return (
    <AdminLayout title="إدارة العملاء">
      {/* نموذج إضافة أدمن */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          إضافة أدمن جديد
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="أدخل إيميل المستخدم"
            value={emailToAdmin}
            onChange={(e) => setEmailToAdmin(e.target.value)}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleMakeAdmin}
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-8 py-3 rounded-xl font-bold transition shadow-lg"
          >
            تحويل إلى أدمن
          </button>
        </div>
      </div>

      {/* البحث */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث بالاسم أو الإيميل..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المستخدمين...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-right">الاسم</th>
                  <th className="px-6 py-4 text-right">الإيميل</th>
                  <th className="px-6 py-4 text-right">الدور</th>
                  <th className="px-6 py-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-right font-medium">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-right">{u.email}</td>
                    <td className="px-6 py-4 text-right">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.role !== "owner" && (
                        <button
                          onClick={() => handleDelete(u.email)}
                          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                        >
                          حذف
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500">
                      لا توجد نتائج مطابقة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                السابق
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-lg transition ${
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
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                التالي
              </button>
            </div>
          )}

          <p className="text-center mt-4 text-gray-600">
            عرض {indexOfFirstUser + 1} -{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} من{" "}
            {filteredUsers.length} مستخدم
          </p>
        </>
      )}
    </AdminLayout>
  );
}
