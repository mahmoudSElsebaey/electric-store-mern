/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../services/api";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  brand: { name: string; _id?: string } | string;
  category: { name: string; _id?: string } | string;
  countInStock: number;
  description: string;
  image: string;
};

type Brand = { _id: string; name: string };
type Category = { _id: string; name: string };

export default function ProductsManagement() {
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [searchTerm, setSearchTerm] = useState(""); // حالة البحث
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    brand: "",
    countInStock: 0,
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      dispatch({ type: "FETCH_SUCCESS", payload: res.data });
    } catch (err) {
      console.error("Failed to fetch products:", err);
      showToast("فشل جلب المنتجات من السيرفر", "error");
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        api.get("/brands"),
        api.get("/categories"),
      ]);
      setBrands(brandsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch brands or categories", err);
      showToast("فشل جلب الماركات أو التصنيفات", "error");
    }
  };

  useEffect(() => {
    (async () => {
      setLoadingPage(true);
      await Promise.all([fetchProducts(), fetchBrandsAndCategories()]);
      setLoadingPage(false);
    })();
  }, []);

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    const brandId =
      typeof p.brand === "string"
        ? p.brand
        : (p.brand && (p.brand as any)._id) || "";
    const categoryId =
      typeof p.category === "string"
        ? p.category
        : (p.category && (p.category as any)._id) || "";

    setFormData({
      name: p.name || "",
      price: p.price || 0,
      brand: brandId,
      countInStock: p.countInStock || 0,
      description: p.description || "",
      category: categoryId,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد إنك عايز تحذف المنتج؟")) return;
    try {
      await api.delete(`/products/${id}`);
      showToast("تم حذف المنتج", "success");
      await fetchProducts();
    } catch (err: any) {
      console.error("Delete Error:", err.response?.data || err);
      showToast(err.response?.data?.message || "فشل حذف المنتج", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      brand: "",
      countInStock: 0,
      description: "",
      category: "",
    });
    setImageFile(null);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      if (!formData.name.trim()) {
        showToast("اسم المنتج مطلوب", "error");
        setLoadingSubmit(false);
        return;
      }
      if (!formData.brand) {
        showToast("اختر ماركة", "error");
        setLoadingSubmit(false);
        return;
      }
      if (!formData.category) {
        showToast("اختر تصنيف", "error");
        setLoadingSubmit(false);
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", String(formData.price || 0));
      data.append("brand", formData.brand);
      data.append("countInStock", String(formData.countInStock || 0));
      data.append("description", formData.description);
      data.append("category", formData.category);

      if (imageFile) {
        data.append("image", imageFile);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, config);
        showToast("تم تحديث المنتج بنجاح", "success");
      } else {
        if (!imageFile) {
          showToast("الصورة مطلوبة للمنتج الجديد!", "error");
          setLoadingSubmit(false);
          return;
        }
        await api.post("/products", data, config);
        showToast("تم إضافة المنتج بنجاح", "success");
      }

      await fetchProducts();
      resetForm();
      setShowForm(false);
    } catch (err: any) {
      console.error("Error saving product:", err.response?.data || err);
      const msg = err.response?.data?.message || "خطأ في حفظ المنتج";
      showToast(msg, "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // تصفية المنتجات حسب البحث
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const brandName =
      typeof p.brand === "string"
        ? p.brand
        : p.brand?.name?.toLowerCase() || "";
    const categoryName =
      typeof p.category === "string"
        ? p.category
        : p.category?.name?.toLowerCase() || "";
    return (
      p.name.toLowerCase().includes(term) ||
      brandName.includes(term) ||
      categoryName.includes(term)
    );
  });

  if (
    !state.isAuthenticated ||
    !["admin", "owner"].includes(state.user?.role || "")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-3xl bg-gray-100">
        ممنوع - ليس لديك الصلاحية للوصول إلى لوحة الإدارة
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          لوحة تحكم الإدارة
        </h1>

        <div className="flex justify-between items-center mb-4" dir="rtl">
          <button
            onClick={openAddForm}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-base hover:bg-green-700 transition cursor-pointer"
          >
            + إضافة منتج جديد
          </button>
          <input
            type="text"
            placeholder="ابحث عن المنتج أو الماركة أو التصنيف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg text-sm w-1/3"
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-4 w-full max-w-2xl shadow-2xl"
              dir="rtl"
            >
              <h2 className="text-xl font-bold mb-3 text-center">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>

              {/* الاسم */}
              <div className="mb-2">
                <label className="block mb-1 text-sm font-semibold">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  placeholder="أدخل اسم المنتج"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg text-sm text-right"
                />
              </div>

              {/* السعر والكمية في صف واحد */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    السعر
                  </label>
                  <input
                    type="number"
                    placeholder="أدخل سعر المنتج"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: +e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm text-right"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    الكمية المتاحة
                  </label>
                  <input
                    type="number"
                    placeholder="أدخل الكمية المتاحة"
                    required
                    value={formData.countInStock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        countInStock: +e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg text-sm text-right"
                  />
                </div>
              </div>

              {/* الماركة والتصنيف في صف واحد */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    الماركة
                  </label>
                  <select
                    required
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm text-right"
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
                  <label className="block mb-1 text-sm font-semibold">
                    التصنيف
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm text-right"
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* الصورة */}
              <div className="mb-2">
                <label className="block mb-1 text-sm font-semibold">
                  صورة المنتج {editingProduct ? "(اختياري)" : "(مطلوب)"}
                </label>
                <div className="w-full h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 relative">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="معاينة الصورة"
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      اضغط لرفع الصورة
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setImageFile(e.target.files[0])
                    }
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* الوصف */}
              <div className="mb-2">
                <label className="block mb-1 text-sm font-semibold">
                  وصف المنتج
                </label>
                <textarea
                  placeholder="أدخل وصف المنتج"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg text-sm text-right min-h-15"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loadingSubmit
                    ? "جاري الحفظ..."
                    : editingProduct
                    ? "حفظ التعديلات"
                    : "إضافة المنتج"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-700"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* جدول المنتجات */}
        {loadingPage ? (
          <div className="text-center py-10 text-gray-500">
            جاري تحميل المنتجات...
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden mt-4"
            dir="rtl"
          >
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-right">الصورة</th>
                  <th className="p-3 text-right">الاسم</th>
                  <th className="p-3 text-right">الماركة</th>
                  <th className="p-3 text-right">التصنيف</th>
                  <th className="p-3 text-right">السعر</th>
                  <th className="p-3 text-right">المخزون</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                    </td>
                    <td className="p-2 text-right font-bold">{p.name}</td>
                    <td className="p-2 text-right">
                      {typeof p.brand === "string" ? p.brand : p.brand?.name}
                    </td>
                    <td className="p-2 text-right">
                      {typeof p.category === "string"
                        ? p.category
                        : p.category?.name}
                    </td>
                    <td className="p-2 text-right text-blue-600 font-semibold">
                      {p.price} ج.م
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.countInStock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.countInStock}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => startEdit(p)}
                        className="bg-yellow-600 text-white px-3 py-2 rounded-md m-1 hover:bg-yellow-700 transition text-xs cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-xs cursor-pointer"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-4 text-gray-500 text-sm"
                    >
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
