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
  brand: { _id: string; name: string };
  category: { _id: string; name: string };
  countInStock: number;
};

const PRODUCTS_PER_PAGE = 8;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // جلب كل المنتجات مرة واحدة
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setDisplayedProducts(res.data.slice(0, PRODUCTS_PER_PAGE));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // زرار عرض المزيد
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => { // لإضافة تأثير تحميل بسيط
      const currentLength = displayedProducts.length;
      const moreProducts = products.slice(currentLength, currentLength + PRODUCTS_PER_PAGE);
      setDisplayedProducts([...displayedProducts, ...moreProducts]);
      setLoadingMore(false);
    }, 500);
  };

  const hasMore = displayedProducts.length < products.length;

  return (
    <>
      <h2 className="text-6xl font-bold text-gray-800 text-center my-12">
        أحدث المنتجات ⚡
      </h2>

      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* المنتجات */}
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <p className="mt-6 text-2xl text-gray-600">جاري تحميل المنتجات...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-32 text-3xl text-gray-500">
              لا توجد منتجات متاحة حاليًا
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* زرار عرض المزيد */}
              {hasMore && (
                <div className="text-center mt-16">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold px-12 py-6 rounded-2xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl"
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

              {!hasMore && products.length > PRODUCTS_PER_PAGE && (
                <div className="text-center mt-16 text-2xl text-gray-600">
                  تم عرض كل المنتجات ({products.length} منتج)
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}