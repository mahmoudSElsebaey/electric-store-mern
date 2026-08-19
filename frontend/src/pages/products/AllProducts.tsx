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
      <section
        className="relative bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white py-12 sm:py-16 md:py-20 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight">
            {t("store.hero.title")}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 text-white/90">
            {t("store.hero.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-base">
            <div className="flex items-center gap-2">
              <GoZap className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              <span>{t("store.hero.price")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTruckFast className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              <span>{t("store.hero.delivery")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              <span>{t("store.hero.warranty")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTags className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              <span>{t("store.hero.offers")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeadphones className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
              <span>{t("store.hero.support")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-surface py-6 sm:py-10" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              <input type="text" placeholder={t("store.filters.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:border-primary transition" />
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:border-primary transition">
                <option value="">{t("store.filters.all_brands")}</option>
                {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:border-primary transition">
                <option value="">{t("store.filters.all_categories")}</option>
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <input type="number" placeholder={t("store.filters.price_from")} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:border-primary transition" />
              <input type="number" placeholder={t("store.filters.price_to")} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-primary-light focus:border-primary transition" />
            </div>
            <p className="mt-4 text-sm text-muted text-center sm:text-start">
              {t("store.filters.showing", {
                from: filtered.length === 0 ? 0 : indexOfFirst + 1,
                to: Math.min(indexOfLast, filtered.length),
                total: filtered.length,
              })}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
              <p className="mt-4 text-muted">{t("store.loading")}</p>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-20 text-muted">{t("store.no_products")}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center mt-10 gap-2">
                  <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300 transition text-sm">
                    {t("store.previous")}
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)} className={`px-3.5 py-2 rounded-xl text-sm min-w-9 transition ${currentPage === i + 1 ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300 transition text-sm">
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
