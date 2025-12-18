/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import api from "../../services/api";
import Footer from "../../components/Footer";
import { FaShieldAlt, FaTags, FaHeadphones } from "react-icons/fa";
import { GoZap } from "react-icons/go";
import { FaTruckFast } from "react-icons/fa6";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: { _id: string; name: string };
  category: { _id: string; name: string };
  countInStock: number;
  rating?: number | null;
  numReviews?: number;
};

const PRODUCTS_PER_PAGE = 12;

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand) result = result.filter((p) => p.brand.name === brand);
    if (category) result = result.filter((p) => p.category.name === category);
    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    setFiltered(result);
    setCurrentPage(1);
  }, [search, brand, category, minPrice, maxPrice, products]);

  const indexOfLast = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirst = indexOfLast - PRODUCTS_PER_PAGE;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const brands = [...new Set(products.map((p) => p.brand.name))];
  const categories = [...new Set(products.map((p) => p.category.name))];

  return (
    <>
      {/* ==================== Hero Section ==================== */}
      <section className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            اكتشف أحدث الأجهزة الكهربائية
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed mb-12">
            تشكيلة واسعة من الأجهزة المنزلية الأصلية بأفضل الأسعار وأقوى العروض
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-lg">
            <div className="flex items-center gap-3">
              <GoZap className="w-10 h-10 text-yellow-400" />
              <span>أسعار تنافسية</span>
            </div>
            <div className="flex items-center gap-3">
              <FaTruckFast className="w-10 h-10 text-yellow-400" />
              <span>توصيل سريع</span>
            </div>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="w-10 h-10 text-yellow-400" />
              <span>ضمان أصلي</span>
            </div>
            <div className="flex items-center gap-3">
              <FaTags className="w-10 h-10 text-yellow-400" />
              <span>عروض يومية</span>
            </div>
            <div className="flex items-center gap-3">
              <FaHeadphones className="w-10 h-10 text-yellow-400" />
              <span>دعم 24/7</span>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#f9fafb"
              d="M0,0 C300,100 600,0 1440,80 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* ==================== محتوى المتجر ==================== */}
      <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          {/* شريط الفلاتر */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الماركة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg focus:ring-4 focus:ring-blue-300"
              />

              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg focus:ring-4 focus:ring-blue-300"
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
                className="px-6 py-4 rounded-xl border text-lg focus:ring-4 focus:ring-blue-300"
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
                className="px-6 py-4 rounded-xl border text-lg focus:ring-4 focus:ring-blue-300"
              />

              <input
                type="number"
                placeholder="السعر إلى"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-6 py-4 rounded-xl border text-lg focus:ring-4 focus:ring-blue-300"
              />
            </div>

            <p className="text-right mt-6 text-xl text-gray-600">
              عرض {indexOfFirst + 1} - {Math.min(indexOfLast, filtered.length)}{" "}
              من {filtered.length} منتج
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
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-32 text-3xl text-gray-500">
              لا توجد منتجات تطابق البحث
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-3">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition font-semibold"
                  >
                    السابق
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-6 py-3 rounded-xl font-semibold transition ${
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
                    className="px-6 py-3 bg-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition font-semibold"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
