/* eslint-disable react-hooks/exhaustive-deps */
 
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");

  useEffect(() => {
    if (orderId) {
      // showToast("تم الدفع وإنشاء الطلب بنجاح! ✅", "success");
    } else {
      showToast("حدث خطأ في عرض رقم الطلب", "error");
      navigate("/cart");
    }
  }, []); // ← مرة واحدة بس

  if (!orderId) {
    return null; // هيرجع للسلة تلقائيًا
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg">
        <h1 className="text-5xl font-bold text-green-600 mb-8">
          تم الدفع بنجاح! 🎉
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          شكرًا لتسوقك معنا في{" "}
          <span className="font-bold text-blue-600">
            متجر الأدوات الكهربائية
          </span>
        </p>
        <p className="text-3xl font-bold text-gray-800 mb-10">
          رقم طلبك: <span className="text-blue-600">{orderId}</span>
        </p>
        <p className="text-lg text-gray-600 mb-10">
          هنتواصل معاك قريب جدًا لتأكيد التوصيل  
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-between mt-10">
          <Link to="/store">
            <button className="text-xl text-blue-600 hover:underline cursor-pointer">
             ← العودة للمتجر
            </button>
          </Link>
          <Link to="/">
            <button className="text-xl text-blue-600 hover:underline cursor-pointer">
               ← الصفحة الرئيسية
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
