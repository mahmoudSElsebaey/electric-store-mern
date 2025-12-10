/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../services/api";
import { useStore } from "../context/StoreContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  brand: string;
  countInStock: number;
  image: string;
};

export default function Admin() {
  const { dispatch } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
    const res = await api.get("/products");
    setProducts(res.data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // ملء البيانات العادية
    data.append("name", formData.name);
    data.append("price", formData.price.toString());
    data.append("brand", formData.brand);
    data.append("countInStock", formData.countInStock.toString());
    data.append("description", formData.description);
    data.append("category", formData.category);

    // المهم: الصورة بس لو موجودة فعلاً
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingProduct) {
        // للتعديل: لو مفيش صورة جديدة، خلّي الصورة القديمة زي ما هي
        if (!imageFile) {
          data.append("image", editingProduct.image); // الصورة القديمة
        }
        await api.put(`/products/${editingProduct._id}`, data);
      } else {
        // للإضافة: الصورة مطلوبة
        if (!imageFile) {
          alert("الصورة مطلوبة للمنتج الجديد!");
          return;
        }
        await api.post("/products", data);
      }

      fetchProducts();
      dispatch({
        type: "FETCH_SUCCESS",
        payload: await (await api.get("/products")).data,
      });
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        price: 0,
        brand: "",
        countInStock: 0,
        description: "",
        category: "",
      });
      setImageFile(null);
      alert("تم الحفظ بنجاح! ✅");
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      alert(
        `خطأ في الحفظ: ${err.response?.data?.message || "مشكلة في السيرفر"}`
      );
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("متأكد إنك عايز تحذف المنتج؟")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
    dispatch({
      type: "FETCH_SUCCESS",
      payload: await (await api.get("/products")).data,
    });
  };
  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.price,
      brand: p.brand,
      countInStock: p.countInStock,
      description: "",
      category: "",
    });
    setShowForm(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
            لوحة تحكم الإدارة
          </h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingProduct(null);
            }}
            className="mb-8 bg-green-600 text-white px-10 py-5 rounded-xl text-2xl hover:bg-green-700 transition"
          >
            + إضافة منتج جديد
          </button>

          {/* نموذج الإضافة/التعديل */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-10 w-full max-w-2xl shadow-2xl"
              >
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h2>
                <input
                  type="text"
                  placeholder="اسم المنتج"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-4 mb-4 border rounded-xl text-xl"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: +e.target.value })
                  }
                  className="w-full p-4 mb-4 border rounded-xl text-xl"
                />
                <input
                  type="text"
                  placeholder="الماركة"
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full p-4 mb-4 border rounded-xl text-xl"
                />
                <input
                  type="number"
                  placeholder="الكمية المتاحة"
                  required
                  value={formData.countInStock}
                  onChange={(e) =>
                    setFormData({ ...formData, countInStock: +e.target.value })
                  }
                  className="w-full p-4 mb-4 border rounded-xl text-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setImageFile(e.target.files[0])
                  }
                  className="w-full p-4 mb-6 border rounded-xl text-xl"
                  placeholder={
                    editingProduct
                      ? "اختيار صورة جديدة (اختياري)"
                      : "اختيار صورة (مطلوب)"
                  }
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-5 rounded-xl text-2xl hover:bg-blue-700 transition"
                  >
                    {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-600 text-white py-5 rounded-xl text-2xl hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* جدول المنتجات */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-6 text-right">الصورة</th>
                  <th className="p-6 text-right">الاسم</th>
                  <th className="p-6 text-right">الماركة</th>
                  <th className="p-6 text-right">السعر</th>
                  <th className="p-6 text-right">المخزون</th>
                  <th className="p-6 text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-6 text-center">
                      <img
                        src={p.image}
                        alt=""
                        className="w-20 h-20 object-cover rounded-xl mx-auto"
                      />
                    </td>
                    <td className="p-6 text-right font-bold">{p.name}</td>
                    <td className="p-6 text-right">{p.brand}</td>
                    <td className="p-6 text-right text-xl font-bold text-blue-600">
                      {p.price} ج.م
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-2 rounded-full ${
                          p.countInStock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.countInStock}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => startEdit(p)}
                        className="bg-yellow-600 text-white px-6 py-3 rounded-xl mr-3 hover:bg-yellow-700 transition"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
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
    </>
  );
}
