/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useOrderDetails.ts
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export type OrderDetailsType = {
  _id: string;
  orderItems: {
    _id: string;
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export const useOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order); // بافتراض إن الـ response { success: true, order }
      } catch (err: any) {
        setError(err.response?.data?.message || "فشل جلب تفاصيل الطلب");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, loading, error };
};
