import { Link } from "react-router-dom";
import type { Product } from "../context/StoreContext";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-600">
              {product.price} ج.م
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.countInStock > 0 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {product.countInStock > 0 ? `متوفر: ${product.countInStock}` : "نفد"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}