import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";

type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string; // جديد: url الصورة من Cloudinary
};

export default function CategoriesGrid() {
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
        جاري تحميل التصنيفات...
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          تسوق حسب التصنيف
        </h2> */}
        <h2 className="text-4xl font-bold text-gray-800 flex justify-center items-center gap-2 mb-12">
          <IoStar className="inline-block text-[10px] text-yellow-500" />
          <IoStar className="inline-block text-[20px] text-yellow-500" />
          <IoStar className="inline-block text-[40px] text-yellow-500" />
          التصنيفات
          <IoStar className="inline-block text-[40px] text-yellow-500" />
          <IoStar className="inline-block text-[20px] text-yellow-500" />
          <IoStar className="inline-block text-[10px] text-yellow-500" />
        </h2>
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
                  className="w-full h-full  "
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
