/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import api from "../../services/api";
import Footer from "../../components/Footer";
import { FaShieldAlt, FaTags, FaHeadphones } from "react-icons/fa";
import { GoZap } from "react-icons/go";
import { FaTruckFast } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
      {/* Hero Section */}
      <section
        className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 sm:py-28 md:py-32 lg:py-40 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            {t("store.hero.title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto leading-relaxed mb-10 sm:mb-12">
            {t("store.hero.subtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-base sm:text-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <GoZap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("store.hero.price")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTruckFast className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("store.hero.delivery")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaShieldAlt className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("store.hero.warranty")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTags className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("store.hero.offers")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaHeadphones className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("store.hero.support")}</span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#f9fafb"
              d="M0,0 C300,100 600,0 1440,80 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Store Content */}
      <div
        className="min-h-screen bg-gray-50 py-10 sm:py-12 md:py-16"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder={t("store.filters.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-5 py-3.5 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />

              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-5 py-3.5 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              >
                <option value="">{t("store.filters.all_brands")}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-5 py-3.5 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              >
                <option value="">{t("store.filters.all_categories")}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder={t("store.filters.price_from")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-5 py-3.5 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />

              <input
                type="number"
                placeholder={t("store.filters.price_to")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-5 py-3.5 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>

            <p className="mt-6 text-base sm:text-lg text-gray-600 text-center sm:text-left">
              {t("store.filters.showing", {
                from: indexOfFirst + 1,
                to: Math.min(indexOfLast, filtered.length),
                total: filtered.length,
              })}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <p className="mt-6 text-xl sm:text-2xl text-gray-600">
                {t("store.loading")}
              </p>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-32 text-xl sm:text-3xl text-gray-500">
              {t("store.no_products")}
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-3">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center mt-12 sm:mt-16 gap-2 sm:gap-3">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition font-medium text-sm sm:text-base"
                  >
                    {t("store.previous")}
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 sm:px-5 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base min-w-10 ${
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
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition font-medium text-sm sm:text-base"
                  >
                    {t("store.next")}
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
