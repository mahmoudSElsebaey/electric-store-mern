import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { formatPrice } from "../utils/formatPrice";

type ProductHit = {
  _id: string;
  name: string;
  price: number;
  image: string;
  brand?: { name: string };
};

export default function NavbarSearch({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductHit[] | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!allProducts) {
      setLoading(true);
      api
        .get("/products")
        .then((res) => setAllProducts(res.data || []))
        .catch(() => setAllProducts([]))
        .finally(() => setLoading(false));
    }
  }, [open, allProducts]);

  useEffect(() => {
    if (!allProducts) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }
    const hits = allProducts
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      )
      .slice(0, 6);
    setResults(hits);
  }, [query, allProducts]);

  const goToProduct = (id: string) => {
    setOpen(false);
    setQuery("");
    navigate(`/product/${id}`);
  };

  const goToStore = () => {
    const q = query.trim();
    setOpen(false);
    navigate(q ? `/store?search=${encodeURIComponent(q)}` : "/store");
    setQuery("");
  };

  if (variant === "mobile") {
    return (
      <div className="px-4 pb-3" ref={wrapRef}>
        <div className="relative">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 start-3 text-white/50 text-sm" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && goToStore()}
            placeholder={t("navbar.search_placeholder", {
              defaultValue: isRTL ? "ابحث عن منتج..." : "Search products...",
            })}
            className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 py-2.5 ps-9 pe-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        {open && query.trim() && (
          <div className="mt-2 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
            {loading && (
              <p className="px-4 py-3 text-sm text-white/60">
                {t("navbar.searching", { defaultValue: "جاري البحث..." })}
              </p>
            )}
            {!loading && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-white/60">
                {t("navbar.no_results", { defaultValue: "لا توجد نتائج" })}
              </p>
            )}
            {results.map((p) => (
              <button
                key={p._id}
                onClick={() => goToProduct(p._id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 text-start transition"
              >
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-contain bg-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{p.name}</p>
                  <p className="text-xs text-accent font-bold">{formatPrice(p.price, lang)}</p>
                </div>
              </button>
            ))}
            {results.length > 0 && (
              <button
                onClick={goToStore}
                className="w-full text-center text-sm font-semibold text-accent py-2.5 border-t border-white/10 hover:bg-white/5"
              >
                {t("navbar.view_all_results", { defaultValue: "عرض كل النتائج" })}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative hidden md:block" ref={wrapRef}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition"
          aria-label="search"
        >
          <FaSearch className="text-lg" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative">
            <FaSearch className="absolute top-1/2 -translate-y-1/2 start-3 text-white/50 text-xs" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToStore()}
              placeholder={t("navbar.search_placeholder", {
                defaultValue: isRTL ? "ابحث..." : "Search...",
              })}
              className="w-44 lg:w-56 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/50 py-2 ps-8 pe-8 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="absolute top-1/2 -translate-y-1/2 end-2 text-white/50 hover:text-white"
            >
              <FaTimes className="text-xs" />
            </button>

            {query.trim() && (
              <div className="absolute top-full mt-2 start-0 w-72 rounded-2xl bg-white text-ink shadow-2xl border border-primary/10 overflow-hidden z-50">
                {loading && (
                  <p className="px-4 py-3 text-sm text-muted">
                    {t("navbar.searching", { defaultValue: "جاري البحث..." })}
                  </p>
                )}
                {!loading && results.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted">
                    {t("navbar.no_results", { defaultValue: "لا توجد نتائج" })}
                  </p>
                )}
                {results.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => goToProduct(p._id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-soft/50 text-start transition"
                  >
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-contain bg-surface" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-primary font-bold">{formatPrice(p.price, lang)}</p>
                    </div>
                  </button>
                ))}
                {results.length > 0 && (
                  <button
                    onClick={goToStore}
                    className="w-full text-center text-sm font-semibold text-primary py-2.5 border-t border-primary/10 hover:bg-primary-soft/30"
                  >
                    {t("navbar.view_all_results", { defaultValue: "عرض كل النتائج" })}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
