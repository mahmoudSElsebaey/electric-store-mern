/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { useEffect, useState } from "react";
import api from "../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "owner";
};

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToAdmin, setEmailToAdmin] = useState("");

  useEffect(() => {
    api.get("/auth/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleMakeAdmin = async () => {
    if (!emailToAdmin) return alert("الإيميل مطلوب!");
    try {
      await api.put("/auth/make-admin", { email: emailToAdmin });
      alert("تم تحويل المستخدم إلى أدمن!");
      setEmailToAdmin("");
      // تحديث القائمة
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      alert("خطأ في التحويل");
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm("متأكد من الحذف؟")) return;
    try {
      await api.delete(`/auth/users/${email}`);
      alert("تم الحذف!");
      setUsers(users.filter(u => u.email !== email));
    } catch (err) {
      alert("خطأ في الحذف");
    }
  };

  if (loading) return <div className="text-center py-20 text-3xl">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          إدارة العملاء
        </h1>

        {/* نموذج إضافة أدمن */}
        <div className="mb-12 bg-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">إضافة أدمن جديد</h2>
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="إيميل المستخدم"
              value={emailToAdmin}
              onChange={(e) => setEmailToAdmin(e.target.value)}
              className="flex-1 p-4 border rounded-xl text-lg"
            />
            <button
              onClick={handleMakeAdmin}
              className="bg-purple-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-purple-700 transition"
            >
              تحويل إلى أدمن
            </button>
          </div>
        </div>

        {/* جدول المستخدمين */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-6 text-left">الاسم</th>
                <th className="p-6 text-left">الإيميل</th>
                <th className="p-6 text-left">الدور</th>
                <th className="p-6 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-6">{u.name}</td>
                  <td className="p-6">{u.email}</td>
                  <td className="p-6">
                    <span className={`px-4 py-2 rounded-full ${
                      u.role === "owner" ? "bg-blue-600 text-white" :
                      u.role === "admin" ? "bg-green-600 text-white" :
                      "bg-gray-600 text-white"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6">
                    {/* {u.role === "user" && (
                      <button
                        onClick={()=>handleMakeAdmin(u.email)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition mr-3"
                      >
                        جعله أدمن
                      </button>
                    )} */}
                    <button
                      onClick={() => handleDelete(u.email)}
                      className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}