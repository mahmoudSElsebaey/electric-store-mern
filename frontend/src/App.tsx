import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/products/ProductDetail";
import Cart from "./pages/products/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/users/UserProfile";
import { useStore } from "./context/StoreContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllProducts from "./pages/products/AllProducts";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductsManagement from "./pages/dashboard/ProductsManagement";
import UsersManagement from "./pages/dashboard/UsersManagement";
import MyOrders from "./pages/orders/MyOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import OrdersManagement from "./pages/dashboard/OrdersManagement";
import ProductForm from "./pages/products/ProductForm";
import Checkout from "./pages/payment/Checkout";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import BrandsManagement from "./pages/dashboard/BrandsManagement";
import CategoriesManagement from "./pages/dashboard/CategoriesManagement";
import Wishlist from "./components/wishlist/Wishlist";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: ("user" | "admin" | "owner")[];
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { state } = useStore();
  if (state.isAuthenticated === null) {
    return (
      <div className="p-10 text-center text-gray-600">
        جارٍ التحقق من تسجيل الدخول...
      </div>
    );
  }

  if (!state.isAuthenticated) return <Navigate to="/login" />;

  if (roles && state.user && !roles.includes(state.user.role)) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        ممنوع - ليس لديك الصلاحية
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* الصفحات العادية */}
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<AllProducts />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Admin & Owner Routes - لازم تيجي قبل /order/:id */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <OrdersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <ProductsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/add"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <BrandsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <CategoriesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["owner"]}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["user", "admin", "owner"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute roles={["user", "admin", "owner"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Order Details - لازم تيجي في الآخر عشان :id متعارضش مع routes تانية */}
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute roles={["user", "admin", "owner"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
