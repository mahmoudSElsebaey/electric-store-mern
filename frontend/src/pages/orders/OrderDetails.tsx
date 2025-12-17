import React from "react";
import { Link } from "react-router-dom";
import {
  useOrderDetails,
  type OrderDetailsType,
} from "../../hooks/useOrderDetails";
import { useStore } from "../../context/StoreContext";
import AdminLayout from "../../layouts/AdminLayout";

const OrderDetailsContent: React.FC<{ order: OrderDetailsType }> = ({
  order,
}) => {
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

  const getPaymentBadge = (isPaid: boolean, paidAt?: string) => {
    return isPaid ? (
      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full">
        مدفوع بتاريخ{" "}
        {paidAt ? new Date(paidAt).toLocaleDateString("ar-EG") : "غير معروف"}
      </span>
    ) : (
      <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-200 rounded-full">
        غير مدفوع
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/my-orders"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          العودة إلى طلباتي
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">
          تفاصيل الطلب #{order._id.substring(order._id.length - 8)}
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              معلومات الشحن
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">الاسم:</span>{" "}
                {order.shippingAddress.fullName}
              </p>
              <p>
                <span className="font-medium">الهاتف:</span>{" "}
                {order.shippingAddress.phone}
              </p>
              <p>
                <span className="font-medium">العنوان:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              حالة الطلب
            </h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">الحالة الحالية</p>
                {getStatusBadge(order.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">تاريخ الطلب</p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              المنتجات في الطلب
            </h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 space-x-reverse border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      الكمية: {item.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {(item.qty * item.price).toLocaleString("ar-EG")} جنيه
                    </p>
                    <p className="text-sm text-gray-500">
                      × {item.price.toLocaleString("ar-EG")} جنيه
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              حالة الدفع
            </h3>
            <div className="text-center py-4">
              {getPaymentBadge(order.isPaid, order.paidAt)}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">طريقة الدفع</p>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ملخص الطلب
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">سعر المنتجات</span>
                <span>{order.itemsPrice.toLocaleString("ar-EG")} جنيه</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الشحن</span>
                <span>{order.shippingPrice.toLocaleString("ar-EG")} جنيه</span>
              </div>
              <div className="h-px bg-gray-200 my-3"></div>
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>الإجمالي</span>
                <span>{order.totalPrice.toLocaleString("ar-EG")} جنيه</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Link
              to="/my-orders"
              className="block w-full text-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
            >
              العودة إلى طلباتي
            </Link>
            {order.status === "Pending" && (
              <button className="block w-full mt-3 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium">
                إلغاء الطلب
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetails: React.FC = () => {
  const { order, loading, error } = useOrderDetails();
  const { state } = useStore();
  const isAdminOrOwner = ["admin", "owner"].includes(state.user?.role || "");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
          الطلب غير موجود
        </div>
      </div>
    );
  }

  // لو أدمن أو owner → مع Sidebar
  if (isAdminOrOwner) {
    return (
      <AdminLayout
        title={`تفاصيل الطلب #${order._id.substring(order._id.length - 8)}`}
      >
        <OrderDetailsContent order={order} />
      </AdminLayout>
    );
  }

  // لو مستخدم عادي → بدون Sidebar
  return <OrderDetailsContent order={order} />;
};

export default OrderDetails;
