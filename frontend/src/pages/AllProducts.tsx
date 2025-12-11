/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: { _id: string; name: string };
  category: { _id: string; name: string };
  countInStock: number;
};

const PRODUCTS_PER_PAGE = 8;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [displayed, setDisplayed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // حالات الفلاتر
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // جلب المنتجات
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setDisplayed(res.data.slice(0, PRODUCTS_PER_PAGE));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand) {
      result = result.filter((p) => p.brand.name === brand);
    }

    if (category) {
      result = result.filter((p) => p.category.name === category);
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    setFiltered(result);
    setDisplayed(result.slice(0, PRODUCTS_PER_PAGE)); // عرض أول 8 بعد كل فلترة
  }, [search, brand, category, minPrice, maxPrice, products]);

  // زرار عرض المزيد
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = displayed.length;
      const more = filtered.slice(
        currentLength,
        currentLength + PRODUCTS_PER_PAGE
      );
      setDisplayed([...displayed, ...more]);
      setLoadingMore(false);
    }, 500);
  };

  const hasMore = displayed.length < filtered.length;

  // استخراج الماركات والتصنيفات
  const brands = [...new Set(products.map((p) => p.brand.name))];
  const categories = [...new Set(products.map((p) => p.category.name))];

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* شريط الفلاتر */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الماركة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              />

              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              >
                <option value="">كل الماركات</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg"
              >
                <option value="">كل التصنيفات</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

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

            <p className="text-right mt-4 text-xl text-gray-600">
              عرض {displayed.length} من {filtered.length} منتج
            </p>
          </div>

          {/* المنتجات */}
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <p className="mt-6 text-2xl text-gray-600">
                جاري تحميل المنتجات...
              </p>
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-32 text-3xl text-gray-500">
              لا توجد منتجات تطابق البحث
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayed.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* زرار عرض المزيد */}
              {hasMore && (
                <div className="text-center mt-16">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold px-12 py-6 rounded-2xl transition transform hover:scale-105 disabled:opacity-70 shadow-xl"
                  >
                    {loadingMore ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-white mr-4"></span>
                        جاري التحميل...
                      </>
                    ) : (
                      "عرض المزيد"
                    )}
                  </button>
                </div>
              )}

              {!hasMore && filtered.length > PRODUCTS_PER_PAGE && (
                <div className="text-center mt-16 text-2xl text-gray-600">
                  تم عرض كل المنتجات المتاحة ({filtered.length})
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
