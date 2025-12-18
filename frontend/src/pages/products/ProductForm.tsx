/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../services/api";
// import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

type Brand = { _id: string; name: string };
type Category = { _id: string; name: string };

export default function ProductForm() {
//   const { state } = useStore();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>(); // لو في id يبقى تعديل

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    brand: "",
    countInStock: 0,
    description: "",
    category: "",
  });

  const isEdit = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          api.get("/brands"),
          api.get("/categories"),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);

        if (isEdit) {
          const res = await api.get(`/products/${id}`);
          const p = res.data;
          setFormData({
            name: p.name,
            price: p.price,
            brand: typeof p.brand === "string" ? p.brand : p.brand._id,
            countInStock: p.countInStock,
            description: p.description,
            category:
              typeof p.category === "string" ? p.category : p.category._id,
          });
        }
      } catch (err) {
        showToast("فشل تحميل البيانات", "error");
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", String(formData.price));
      data.append("brand", formData.brand);
      data.append("countInStock", String(formData.countInStock));
      data.append("description", formData.description);
      data.append("category", formData.category);
      if (imageFile) data.append("image", imageFile);

      if (isEdit) {
        await api.put(`/products/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("تم تحديث المنتج بنجاح", "success");
      } else {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("تم إضافة المنتج بنجاح", "success");
      }
      navigate("/products-management");
    } catch (err: any) {
      showToast(err.response?.data?.message || "فشل في الحفظ", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}>
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
          dir="rtl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">اسم المنتج</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">السعر</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: +e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">الكمية المتاحة</label>
              <input
                type="number"
                required
                value={formData.countInStock}
                onChange={(e) =>
                  setFormData({ ...formData, countInStock: +e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">الماركة</label>
              <select
                required
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الماركة</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">التصنيف</label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">
                صورة المنتج {isEdit ? "(اختياري)" : ""}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setImageFile(e.target.files[0])
                }
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">وصف المنتج</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 cursor-pointer text-white py-3 rounded-lg font-bold transition disabled:opacity-60"
            >
              {loading
                ? "جاري الحفظ..."
                : isEdit
                ? "حفظ التعديلات"
                : "إضافة المنتج"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/products-management")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
