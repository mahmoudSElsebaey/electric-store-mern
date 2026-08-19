import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
};

export default function CategoriesGrid() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-7xl mx-auto px-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-primary-soft/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-primary-soft/30" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/store?category=${category._id}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-primary-soft/50">
                <img
                  src={
                    category.image ||
                    "https://via.placeholder.com/400x300?text=Category"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-accent text-primary-dark flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  {isRTL ? (
                    <FaArrowLeft className="text-xs" />
                  ) : (
                    <FaArrowRight className="text-xs" />
                  )}
                </div>
              </div>

              <div className="p-3 sm:p-4 text-center">
                <h3 className="text-sm sm:text-base font-bold text-ink group-hover:text-primary transition-colors line-clamp-1">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-xs text-muted line-clamp-2 hidden sm:block">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
