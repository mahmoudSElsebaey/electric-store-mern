/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function UserProfile() {
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
  });

  const [additionalFields, setAdditionalFields] = useState<{
    [key: string]: string;
  }>({});
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  useEffect(() => {
    if (state.user) {
      setFormData({
        name: state.user.name || "",
        email: state.user.email || "",
        phone: state.user.phone || "",
        address: state.user.address || "",
        birthdate: state.user.birthdate
          ? new Date(state.user.birthdate).toISOString().split("T")[0]
          : "",
      });
      setAdditionalFields(state.user.additionalInfo || {});
    }
  }, [state.user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        address: formData.address || "",
        birthdate: formData.birthdate || null,
        additionalInfo:
          Object.keys(additionalFields).length > 0 ? additionalFields : {},
      };

      const res = await api.put("/auth/profile", dataToSend);

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsEditing(false);
      showToast("تم تحديث البيانات بنجاح! 🎉", "success");
    } catch (err: any) {
      console.error("Update Error:", err.response?.data || err);
      showToast(
        "خطأ: " + (err.response?.data?.message || "فشل في التحديث"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const addAdditionalField = () => {
    if (newFieldKey && newFieldValue) {
      setAdditionalFields({
        ...additionalFields,
        [newFieldKey]: newFieldValue,
      });
      setNewFieldKey("");
      setNewFieldValue("");
    }
  };

  const removeAdditionalField = (key: string) => {
    const newFields = { ...additionalFields };
    delete newFields[key];
    setAdditionalFields(newFields);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          حسابي الشخصي
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* الحقول الأساسية */}
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
              <div>
                <label className="block text-lg font-semibold mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-4 border rounded-xl text-lg"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-4 border rounded-xl text-lg"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                  className="w-full p-4 border rounded-xl text-lg"
                />
              </div>

              {/* الحقول الإضافية */}
              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold mb-4">حقول إضافية</h3>
                {Object.entries(additionalFields).map(([key, value]) => (
                  <div key={key} className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={key}
                      disabled
                      className="flex-1 p-4 border rounded-xl text-lg bg-gray-100"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setAdditionalFields({
                          ...additionalFields,
                          [key]: e.target.value,
                        })
                      }
                      className="flex-1 p-4 border rounded-xl text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalField(key)}
                      className="bg-red-600 text-white px-4 py-4 rounded-xl hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </div>
                ))}

                <div className="flex gap-4 mt-4">
                  <input
                    type="text"
                    value={newFieldKey}
                    onChange={(e) => setNewFieldKey(e.target.value)}
                    className="flex-1 p-4 border rounded-xl text-lg"
                    placeholder="اسم الحقل الجديد (مثل مهنة)"
                  />
                  <input
                    type="text"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    className="flex-1 p-4 border rounded-xl text-lg"
                    placeholder="قيمة الحقل"
                  />
                  <button
                    type="button"
                    onClick={addAdditionalField}
                    className="bg-green-600 text-white px-4 py-4 rounded-xl hover:bg-green-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition"
              >
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-lg">
              <p>
                <span className="font-bold">الاسم:</span> {formData.name}
              </p>
              <p>
                <span className="font-bold">البريد:</span> {formData.email}
              </p>
              <p>
                <span className="font-bold">الهاتف:</span>{" "}
                {formData.phone || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">العنوان:</span>{" "}
                {formData.address || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">تاريخ الميلاد:</span>{" "}
                {formData.birthdate || "غير محدد"}
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">حقول إضافية</h3>
              {Object.entries(additionalFields).length > 0 ? (
                Object.entries(additionalFields).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-bold">{key}:</span> {value}
                  </p>
                ))
              ) : (
                <p>لا توجد حقول إضافية</p>
              )}

              <button
                onClick={() => setIsEditing(true)}
                className="mt-10 w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition"
              >
                تعديل البيانات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
