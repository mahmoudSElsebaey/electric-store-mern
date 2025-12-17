// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // src/pages/PaypalPayment.tsx
// import { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useToast } from "../context/ToastContext";

// export default function PaypalPayment() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   useEffect(() => {
//     const initPaypal = async () => {
//       try {
//         const res = await api.post(`/orders/${orderId}/paypal`);
//         window.location.href = res.data.approveUrl; // redirect to PayPal
//       } catch (err) {
//         showToast("فشل في توجيه PayPal", "error");
//         navigate("/cart");
//       }
//     };

//     if (orderId) initPaypal();
//   }, [orderId]);

//   return (
//     <div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">
//       جاري توجيهك إلى PayPal...
//     </div>
//   );
// }
