// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // src/pages/StripePayment.tsx
// import { useEffect} from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useToast } from "../context/ToastContext";

// export default function StripePayment() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
// //   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const createSession = async () => {
//       try {
//         const res = await api.post(`/orders/${orderId}/stripe`);
//         window.location.href = res.data.url; // redirect to Stripe Checkout
//       } catch (err) {
//         showToast("فشل في توجيه الدفع", "error");
//         navigate("/cart");
//       }
//     };

//     if (orderId) createSession();
//   }, [orderId]);

//   return (
//     <div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">
//       جاري توجيهك لبوابة الدفع...
//     </div>
//   );
// }
