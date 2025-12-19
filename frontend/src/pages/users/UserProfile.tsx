/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

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

      setIsEditing(false);
      showToast(t("profile.update_success"), "success");
    } catch (err: any) {
      showToast(
        t("profile.update_error", {
          msg: err.response?.data?.message || t("profile.save_failed"),
        }),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const addAdditionalField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      setAdditionalFields({
        ...additionalFields,
        [newFieldKey.trim()]: newFieldValue.trim(),
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
    <>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-gray-50 py-16"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-16 text-gray-800">
            {t("profile.title")}
          </h1>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-10 px-12 text-center">
              <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center text-6xl text-blue-600 font-bold">
                {formData.name.charAt(0).toUpperCase() || "?"}
              </div>
              <h2 className="text-3xl font-bold mt-6">{formData.name}</h2>
              <p className="text-xl opacity-90">{formData.email}</p>
            </div>

            <div className="p-10 lg:p-16">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-8">
                  {/* الحقول الأساسية */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-700">
                        {t("profile.full_name")}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-700">
                        {t("profile.email")}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-700">
                        {t("profile.phone")}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder={t("profile.phone_placeholder")}
                        className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-700">
                        {t("profile.birthdate")}
                      </label>
                      <input
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthdate: e.target.value,
                          })
                        }
                        className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold mb-3 text-gray-700">
                      {t("profile.address")}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder={t("profile.address_placeholder")}
                      className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    />
                  </div>

                  {/* الحقول الإضافية */}
                  <div className="border-t-2 border-gray-200 pt-10">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      {t("profile.additional_info")}
                    </h3>

                    {Object.entries(additionalFields).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl"
                      >
                        <input
                          type="text"
                          value={key}
                          disabled
                          className="flex-1 px-5 py-4 bg-gray-200 rounded-xl text-lg font-medium"
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
                          className="flex-1 px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-blue-100 transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalField(key)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl transition shadow-md"
                        >
                          {t("profile.delete")}
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-4 mt-8">
                      <input
                        type="text"
                        value={newFieldKey}
                        onChange={(e) => setNewFieldKey(e.target.value)}
                        placeholder={t("profile.field_name_placeholder")}
                        className="flex-1 px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-blue-100 transition"
                      />
                      <input
                        type="text"
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                        placeholder={t("profile.field_value_placeholder")}
                        className="flex-1 px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-blue-100 transition"
                      />
                      <button
                        type="button"
                        onClick={addAdditionalField}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl transition shadow-md font-semibold"
                      >
                        {t("profile.add")}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-6 mt-12">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-linear-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 shadow-2xl disabled:opacity-70"
                    >
                      {loading
                        ? t("profile.saving")
                        : t("profile.save_changes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-12 py-5 bg-gray-600 text-white rounded-xl text-xl font-bold hover:bg-gray-700 transition"
                    >
                      {t("profile.cancel")}
                    </button>
                  </div>
                </form>
              ) : (
                /* عرض البيانات */
                <div className="space-y-10 text-lg">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <p className="font-bold text-gray-600 mb-2">
                        {t("profile.full_name")}
                      </p>
                      <p className="text-xl">{formData.name}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <p className="font-bold text-gray-600 mb-2">
                        {t("profile.email")}
                      </p>
                      <p className="text-xl">{formData.email}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <p className="font-bold text-gray-600 mb-2">
                        {t("profile.phone")}
                      </p>
                      <p className="text-xl">
                        {formData.phone || t("profile.not_specified")}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <p className="font-bold text-gray-600 mb-2">
                        {t("profile.address")}
                      </p>
                      <p className="text-xl">
                        {formData.address || t("profile.not_specified")}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <p className="font-bold text-gray-600 mb-2">
                        {t("profile.birthdate")}
                      </p>
                      <p className="text-xl">
                        {formData.birthdate || t("profile.not_specified")}
                      </p>
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  {Object.keys(additionalFields).length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-800">
                        {t("profile.additional_info")}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(additionalFields).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-gray-50 p-6 rounded-2xl"
                            >
                              <p className="font-bold text-gray-600 mb-2">
                                {key}
                              </p>
                              <p className="text-xl">{value}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 shadow-2xl"
                  >
                    {t("profile.edit_profile")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
