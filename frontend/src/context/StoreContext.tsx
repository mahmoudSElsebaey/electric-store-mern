/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import api from "../services/api";

export type Brand = { _id: string; name: string };
export type Category = { _id: string; name: string };

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: Brand;
  category: Category;
  countInStock: number;
  quantity?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  additionalInfo?: { [key: string]: string };
  role: "user" | "admin" | "owner";
};

export type Order = {
  _id: string;
  orderItems: Product[];
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
};

type State = {
  products: Product[];
  cart: Product[];
  user: User | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
};

type Action =
  | { type: "FETCH_SUCCESS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QTY"; payload: string }
  | { type: "DECREASE_QTY"; payload: string }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "FETCH_MY_ORDERS_START"; payload: Order[] }
  | { type: "FETCH_MY_ORDERS_SUCCESS"; payload: Order[] }
  | { type: "FETCH_MY_ORDERS_FAIL"; payload: string }
  | { type: "LOGOUT" }
  | { type: "LOAD_CART"; payload: Product[] };

const initialState: State = {
  products: [],
  cart: [],
  user: null,
  isAuthenticated: null,
  loading: true,
  orders: [],
  ordersLoading: false,
  ordersError: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };

    case "ADD_TO_CART": {
      const product = action.payload;
      const exist = state.cart.find((item) => item._id === product._id);

      // لو المنتج مش متوفر أصلاً → مفيش إضافة
      if (product.countInStock <= 0) {
        return state;
      }

      let newCart: Product[];

      if (exist) {
        const newQty = (exist.quantity || 1) + 1;
        // لو الزيادة هتخلي الكمية أكتر من المتاح → مفيش تغيير
        if (newQty > product.countInStock) {
          return state;
        }
        newCart = state.cart.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        // إضافة جديدة → الكمية 1 (وهي أكيد <= countInStock لأن فوق تحققنا)
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "REMOVE_FROM_CART": {
      const newCart = state.cart.filter((p) => p._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "INCREASE_QTY": {
      const newCart = state.cart.map((item) => {
        if (item._id === action.payload) {
          const newQty = (item.quantity || 1) + 1;
          // منع الزيادة لو وصل الحد الأقصى
          if (newQty > item.countInStock) {
            return item; // مفيش تغيير
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "DECREASE_QTY": {
      const newCart = state.cart
        .map((item) =>
          item._id === action.payload
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "LOAD_CART":
      return { ...state, cart: action.payload };

    case "FETCH_MY_ORDERS_START":
      return { ...state, ordersLoading: true, ordersError: null };

    case "FETCH_MY_ORDERS_SUCCESS":
      return { ...state, ordersLoading: false, orders: action.payload };

    case "FETCH_MY_ORDERS_FAIL":
      return { ...state, ordersLoading: false, ordersError: action.payload };

    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isAuthenticated: true };

    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      return { ...state, user: null, isAuthenticated: false, cart: [] };

    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        console.error("فشل جلب المنتجات");
        dispatch({ type: "FETCH_SUCCESS", payload: [] });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
      } catch (err) {
        dispatch({ type: "LOGOUT" });
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
