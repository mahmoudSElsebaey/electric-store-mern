import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
};

export default function CategoriesGrid() {
  const { t, i18n } = useTranslation();
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
      <div className="py-20 text-center text-2xl text-gray-600">
        {t("home.loading_categories", {
          defaultValue: "جاري تحميل التصنيفات...",
        })}
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/store?category=${category._id}`}
              className="group text-center"
            >
              <div className="relative w-full h-48 bg-gray-50 rounded-2xl shadow-md overflow-hidden group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
                <img
                  src={
                    category.image ||
                    "https://via.placeholder.com/300x300?text=No+Icon"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <p className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                {category.name}
              </p>
              {category.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
