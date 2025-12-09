/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import api from "../services/api";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type State = {
  products: Product[];
  cart: Product[];
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
};

type Action =
  | { type: "FETCH_SUCCESS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "LOAD_CART"; payload: Product[] };

const initialState: State = {
  products: [],
  cart: [],
  user: null,
  isAuthenticated: false,
  loading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };

    case "ADD_TO_CART": {
      const newCart = [...state.cart, action.payload];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "REMOVE_FROM_CART": {
      const newCart = state.cart.filter((p) => p._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "LOAD_CART":
      return { ...state, cart: action.payload };

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
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // هنا ممكن نجيب بيانات اليوزر من /api/auth/me
      // لكن دلوقتي هنسيبها لما نعمل الـ login
    }
  }, []);

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