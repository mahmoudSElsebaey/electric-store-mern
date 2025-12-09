/* eslint-disable react-hooks/set-state-in-effect */
// src/pages/Home.tsx
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات الفلاتر
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // جلب المنتجات
  useEffect(() => {
    api.get("/products")
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  

  // تطبيق الفلاتر
  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand) {
      result = result.filter(p => p.brand === brand);
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    setFiltered(result);
  }, [search, brand, category, minPrice, maxPrice, products]);

  // استخراج الماركات والتصنيفات الفريدة
  const brands = [...new Set(products.map(p => p.brand))];
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <>
      

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">

          {/* شريط البحث والفلاتر */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

              {/* البحث */}
              <input
                type="text"
                placeholder="ابحث بالاسم أو الماركة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              />

              {/* فلتر الماركة */}
              <select 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              >
                <option value="">كل الماركات</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {/* فلتر التصنيف */}
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              >
                <option value="">كل التصنيفات</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* فلتر السعر */}
              <input
                type="number"
                placeholder="السعر من"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              />

              <input
                type="number"
                placeholder="السعر إلى"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              />
            </div>

            {/* عدد النتائج */}
            <p className="text-right mt-4 text-xl text-gray-600">
              عرض {filtered.length} من {products.length} منتج
            </p>
          </div>

          {/* المنتجات */}
          {loading ? (
            <div className="text-center py-20 text-3xl text-blue-600">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-3xl text-gray-500">لا توجد منتجات</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}