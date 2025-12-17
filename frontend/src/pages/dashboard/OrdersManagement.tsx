/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import { useAdminOrders, type AdminOrder } from "../../hooks/useAdminOrders";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useToast } from "../../context/ToastContext";

const ORDERS_PER_PAGE = 10;

const OrdersManagement: React.FC = () => {
  const { showToast } = useToast();
  const { adminOrders, adminLoading, adminError, updateOrderStatus, userRole } =
    useAdminOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);

  const statusOptions = [
    { value: "Pending", label: "قيد الانتظار" },
    { value: "Processing", label: "جاري التجهيز" },
    { value: "Shipped", label: "تم الشحن" },
    { value: "Delivered", label: "تم التوصيل" },
    { value: "Cancelled", label: "ملغي" },
  ];

  // تصفية الطلبات حسب البحث
  useEffect(() => {
    const filtered = adminOrders.filter((order) => {
      const term = searchTerm.toLowerCase();
      const orderId = order._id.toLowerCase();
      const customerName = order.user.name.toLowerCase();
      const customerEmail = order.user.email.toLowerCase();

      return (
        orderId.includes(term) ||
        customerName.includes(term) ||
        customerEmail.includes(term)
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1); // رجوع للصفحة الأولى عند البحث
  }, [adminOrders, searchTerm]);

  // Pagination
  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const result = await updateOrderStatus(
      orderId,
      newStatus as AdminOrder["status"]
    );

    if (result.success) {
      showToast("تم تحديث حالة الطلب بنجاح", "success");
    } else {
      showToast(result.error || "فشل في تحديث حالة الطلب", "error");
    }
    setUpdatingOrder(null);
  };

  // تحقق الصلاحيات
  if (!["admin", "owner"].includes(userRole || "")) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          غير مصرح بالوصول لهذه الصفحة
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="إدارة الطلبات">
      <div className="max-w-7xl mx-auto p-6">

        {/* العنوان + عدد الطلبات + بحث */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">إدارة الطلبات</h2>
            <p className="text-xl text-gray-600 mt-2">
              إجمالي الطلبات: {filteredOrders.length} طلب
            </p>
          </div>

          <input
            type="text"
            placeholder="ابحث برقم الطلب أو اسم العميل أو الإيميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 text-right"
          />
        </div>

        {/* Loading */}
        {adminLoading && (
          <div className="flex flex-col items-center my-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-6 text-xl text-gray-600">جاري تحميل الطلبات...</p>
          </div>
        )}

        {/* Error */}
        {adminError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
            {adminError}
          </div>
        )}

        {/* Orders Table */}
        {!adminLoading && !adminError && currentOrders.length > 0 && (
          <>
            <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-right">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">رقم الطلب</th>
                    <th className="px-6 py-4 text-sm font-semibold">العميل</th>
                    <th className="px-6 py-4 text-sm font-semibold">الإجمالي</th>
                    <th className="px-6 py-4 text-sm font-semibold">الدفع</th>
                    <th className="px-6 py-4 text-sm font-semibold">الحالة</th>
                    <th className="px-6 py-4 text-sm font-semibold">التاريخ</th>
                    <th className="px-6 py-4 text-sm font-semibold">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {order.totalPrice.toLocaleString("ar-EG")} جنيه
                      </td>
                      <td className="px-6 py-4">
                        {order.isPaid ? (
                          <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-200 rounded-full">
                            مدفوع
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-200 rounded-full">
                            غير مدفوع
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {updatingOrder === order._id ? (
                          <div className="flex items-center space-x-reverse space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                            <span className="text-xs text-gray-500">جاري التحديث...</span>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                          عرض التفاصيل
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-3">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                >
                  السابق
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-5 py-3 rounded-lg transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                >
                  التالي
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              عرض {indexOfFirst + 1} - {Math.min(indexOfLast, filteredOrders.length)} من {filteredOrders.length} طلب
            </p>
          </>
        )}

        {/* No Orders */}
        {!adminLoading && !adminError && filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-2xl text-gray-500">
              {searchTerm ? "لا توجد طلبات مطابقة للبحث" : "لا توجد طلبات حاليًا"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;