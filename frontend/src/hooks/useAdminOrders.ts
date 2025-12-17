/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import api from "../services/api";

export type AdminOrder = {
  _id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  orderItems: {
    name: string;
    qty: number;
    price: number;
  }[];
  totalPrice: number;
  isPaid: boolean;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  shippingAddress: {
    fullName: string;
    city: string;
  };
};

export const useAdminOrders = () => {
  const { state } = useStore();
  const { user, isAuthenticated } = state;
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !["admin", "owner"].includes(user?.role || ""))
      return;

    const fetchAdminOrders = async () => {
      try {
        setAdminLoading(true);
        setAdminError(null);
        const res = await api.get("/orders");
        setAdminOrders(res.data.orders || []);
      } catch (error: any) {
        setAdminError(error.response?.data?.message || "فشل جلب طلبات الأدمن");
      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminOrders();
  }, [isAuthenticated, user?.role]);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: AdminOrder["status"]
  ) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      setAdminOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      return { success: true, order: res.data.order };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "فشل تحديث حالة الطلب",
      };
    }
  };

  return {
    adminOrders,
    adminLoading,
    adminError,
    updateOrderStatus,
    userRole: user?.role,
  };
};
