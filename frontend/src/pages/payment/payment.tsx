
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useToast } from "../context/ToastContext";

// export default function Payment() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const [status, setStatus] = useState<"loading" | "redirecting" | "error">("loading");
//   const [errorMsg, setErrorMsg] = useState("");

//   const orderId = (state as any)?.orderId;

//   useEffect(() => {
//     // 1. لو مفيش orderId → ارجع للسلة فوراً
//     if (!orderId) {
//       showToast("لا يوجد طلب للدفع، جاري إعادة توجيهك...", "error");
//       navigate("/cart");
//       return;
//     }

//     const initiatePayment = async () => {
//       try {
//         setStatus("loading");

//         const res = await api.post(`/orders/${orderId}/pay`);

//         const { paymentUrl } = res.data;

//         if (!paymentUrl) {
//           throw new Error("لم يتم إرجاع رابط الدفع");
//         }

//         // كل الطرق دلوقتي redirect (كارت، فودافون، فوري)
//         setStatus("redirecting");
//         showToast("جاري توجيهك إلى بوابة الدفع...", "success");

//         // تأخير بسيط عشان الـ toast يبان
//         setTimeout(() => {
//           window.location.href = paymentUrl;
//         }, 1500);

//       } catch (err: any) {
//         console.error(err);
//         const msg = err.response?.data?.message || err.message || "فشل في تحميل صفحة الدفع";
//         setErrorMsg(msg);
//         setStatus("error");
//         showToast(msg, "error");

//         // زرار يرجعه للطلبات أو السلة
//       }
//     };

//     initiatePayment();
//   }, [orderId, navigate, showToast]);

//   // UI حسب الـ status
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-600 mx-auto mb-6"></div>
//           <p className="text-3xl text-gray-700">جاري تحميل بوابة الدفع...</p>
//           <p className="text-xl text-gray-500 mt-4">برجاء الانتظار قليلاً</p>
//         </div>
//       </div>
//     );
//   }

//   if (status === "redirecting") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
//           <p className="text-3xl text-gray-700">جاري توجيهك إلى الدفع...</p>
//           <p className="text-xl text-gray-500 mt-4">هتنتقل تلقائياً</p>
//         </div>
//       </div>
//     );
//   }

//   if (status === "error") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-lg">
//           <div className="text-red-600 text-6xl mb-6">⚠️</div>
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">حدث خطأ أثناء الدفع</h1>
//           <p className="text-xl text-gray-600 mb-8">{errorMsg}</p>
//           <div className="space-x-4">
//             <button
//               onClick={() => navigate("/orders")} // لو عندك صفحة الطلبات
//               className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xl hover:bg-blue-700"
//             >
//               طلباتي
//             </button>
//             <button
//               onClick={() => navigate("/cart")}
//               className="bg-gray-600 text-white px-8 py-4 rounded-xl text-xl hover:bg-gray-700"
//             >
//               العودة للسلة
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }