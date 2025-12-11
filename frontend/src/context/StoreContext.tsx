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
  brand: { name: string };
  category: { name: string };
  countInStock: number;
  quantity?: number; // للسلة فقط
};
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  additionalInfo?: { [key: string]: string };
  isAdmin: boolean;
};

type State = {
  products: Product[];
  cart: Product[];
  user: User | null;
  isAuthenticated: boolean | null; // null أول ما نبدأ
  loading: boolean;
};

type Action =
  | { type: "FETCH_SUCCESS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QTY"; payload: string }
  | { type: "DECREASE_QTY"; payload: string }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "LOAD_CART"; payload: Product[] };

const initialState: State = {
  products: [],
  cart: [],
  user: null,
  isAuthenticated: null, // null بدل false
  loading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };

    case "ADD_TO_CART": {
      const exist = state.cart.find((item) => item._id === action.payload._id);
      let newCart;
      if (exist) {
        newCart = state.cart.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
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
      const newCart = state.cart.map((item) =>
        item._id === action.payload
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
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

    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };

    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      localStorage.removeItem("user");
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

  // جلب المنتجات
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

  // تحميل السلة من localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  // تحميل اليوزر من التوكن (اختياري)
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // هنا ممكن نجيب بيانات اليوزر من /api/auth/me لو عايز
  //     // لكن حاليًا الـ login بيحدث الـ state
  //   }
  // }, []);

  // تحقق اذا كان المستخدم مسجل دخول
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me"); // يستخدم الكوكي تلقائي
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
      } catch (err) {
        dispatch({ type: "LOGOUT" }); // مهم: لو مفيش توكن نشيل كل حاجة
        console.log("غير مسجل دخول");
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
