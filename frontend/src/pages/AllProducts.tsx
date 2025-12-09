// src/pages/AllProducts.tsx
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

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب المنتجات
  useEffect(() => {
    api.get("/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          جميع المنتجات
        </h1>

        {/* المنتجات */}
        {loading ? (
          <div className="text-center py-20 text-3xl text-blue-600">جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-3xl text-gray-500">لا توجد منتجات</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
