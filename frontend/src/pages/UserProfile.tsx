/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function UserProfile() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "",
    // address: "",
  });

  // جلب البيانات من الـ Store عند التحميل
  useEffect(() => {
    if (state.user) {
      setFormData({
        name: state.user.name || "",
        email: state.user.email || "",
        // phone: state.user.phone || "",
        // address: state.user.address || "",
      });
    }
  }, [state.user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/auth/profile", formData);

      // تحديث اليوزر في الـ Store
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      setIsEditing(false);
      alert("تم تحديث بياناتك بنجاح! 🎉");
    } catch (err: any) {
      alert("خطأ في التحديث: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!state.isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
            حسابي الشخصي
          </h1>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-12 text-white text-center">
              <div className="w-32 h-32 bg-white/20 rounded-full mx-auto flex items-center justify-center text-6xl font-bold mb-4">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-4xl font-bold">
                {formData.name || "مستخدم"}
              </h2>
              <p className="text-xl opacity-90 mt-2">{formData.email}</p>
            </div>


            <div className="p-10">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      الاسم
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-4 border rounded-xl text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-4 border rounded-xl text-lg"
                      required
                    />
                  </div>
                  {/* <div>
                    <label className="block text-lg font-semibold mb-2">رقم الهاتف</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 border rounded-xl text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2">العنوان</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-4 border rounded-xl text-lg"
                    />
                  </div> */}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-green-700 transition"
                    >
                      {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-700 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-6 text-lg">
                    <p>
                      <span className="font-bold">الاسم:</span> {formData.name}
                    </p>
                    <p>
                      <span className="font-bold">البريد:</span>{" "}
                      {formData.email}
                    </p>
                    {/* <p><span className="font-bold">الهاتف:</span> {formData.phone || "غير محدد"}</p>
                    <p><span className="font-bold">العنوان:</span> {formData.address || "غير محدد"}</p> */}
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-10 w-full bg-blue-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-blue-700 transition"
                  >
                    تعديل بياناتي
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
