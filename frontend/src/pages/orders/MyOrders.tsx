import React from "react";
import { useOrders } from "../../hooks/useOrders";
import { Link } from "react-router-dom";

const MyOrders: React.FC = () => {
  const { orders, ordersLoading, ordersError } = useOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-full">
            قيد الانتظار
          </span>
        );
      case "Processing":
        return (
          <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-200 rounded-full">
            جاري التجهيز
          </span>
        );
      case "Shipped":
        return (
          <span className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-200 rounded-full">
            تم الشحن
          </span>
        );
      case "Delivered":
        return (
          <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full">
            تم التوصيل
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-200 rounded-full">
            ملغي
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full">
        مدفوع
      </span>
    ) : (
      <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-200 rounded-full">
        غير مدفوع
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        طلباتي
      </h2>

      {/* Loading Spinner */}
      {ordersLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      )}

      {/* Error Message */}
      {ordersError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
          {ordersError}
        </div>
      )}

      {/* No Orders */}
      {!ordersLoading && !ordersError && orders.length === 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-8 rounded-lg text-center text-xl">
          لم تقم بإنشاء أي طلبات حتى الآن
        </div>
      )}

      {/* Orders Table */}
      {!ordersLoading && !ordersError && orders.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="w-full text-right bg-white">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">رقم الطلب</th>
                <th className="px-6 py-4 text-sm font-semibold">التاريخ</th>
                <th className="px-6 py-4 text-sm font-semibold">الإجمالي</th>
                <th className="px-6 py-4 text-sm font-semibold">الدفع</th>
                <th className="px-6 py-4 text-sm font-semibold">الحالة</th>
                <th className="px-6 py-4 text-sm font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{order._id.substring(order._id.length - 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {order.totalPrice.toLocaleString("ar-EG")} جنيه
                  </td>
                  <td className="px-6 py-4">{getPaymentBadge(order.isPaid)}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/order/${order._id}`}
                      className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      تفاصيل الطلب
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
