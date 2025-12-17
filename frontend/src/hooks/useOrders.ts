/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
 

export const useOrders = () => {
  const { state, dispatch } = useStore();
  const { orders, ordersLoading, ordersError, isAuthenticated } = state;

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMyOrders = async () => {
      try {
        dispatch({ type: "FETCH_MY_ORDERS_START", payload: [] });
        const res = await api.get("/orders/myorders");
        dispatch({ type: "FETCH_MY_ORDERS_SUCCESS", payload: res.data.orders });
      } catch (error: any) {
        dispatch({
          type: "FETCH_MY_ORDERS_FAIL",
          payload: error.response?.data?.message || "فشل جلب الطلبات",
        });
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, dispatch]);

  return { orders, ordersLoading, ordersError };
};