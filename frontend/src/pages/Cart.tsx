import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Cart() {
  const { state, dispatch } = useStore();
  const { cart } = state;

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">
            السلة فارغة 🛒
          </h1>
          <Link
            to="/"
            className="text-2xl bg-blue-600 text-white px-10 py-5 rounded-xl hover:bg-blue-700 transition"
          >
            تصفح المنتجات
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          سلة التسوق 🛒
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-6 py-6 border-b last:border-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <p className="text-gray-600">{item.brand}</p>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {item.price} ج.م
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition text-xl"
              >
                حذف
              </button>
            </div>
          ))}

          <div className="mt-12 text-right">
            <div className="text-4xl font-bold text-gray-800 mb-8">
              الإجمالي: <span className="text-blue-600">{totalPrice} ج.م</span>
            </div>
            <button className="bg-green-600 text-white text-3xl px-16 py-6 rounded-2xl hover:bg-green-700 transition font-bold">
              إتمام الشراء 💳
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="text-2xl text-blue-600 hover:underline">
            ← استمر في التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
