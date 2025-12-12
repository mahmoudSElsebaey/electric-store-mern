// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/UserProfile";
import { useStore } from "./context/StoreContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllProducts from "./pages/AllProducts";
import Dashboard from "./pages/Dashboard";
import ProductsManagement from "./pages/ProductsManagement";
import UsersManagement from "./pages/UsersManagement";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: ("user" | "admin" | "owner")[]; // الصلاحيات المسموحة
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

  if (roles && (!state.user || !roles.includes(state.user.role))) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        ممنوع - ليس لديك الصلاحية
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<AllProducts />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["user", "admin", "owner"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products-management"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <ProductsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users-management"
          element={
            <ProtectedRoute roles={["owner"]}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["owner"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
