import { BrowserRouter, Routes, Route } from "react-router";
import DashBoardPage from "./pages/DashBoardPage";
import { Toaster } from "sonner";
import LogInPage from "./pages/LogInPage";
import SignupPage from "./pages/SignupPage";
import OrderListPage from "./pages/OrderListPage";
import ProductManagePage from "./pages/ProductManagePage";
import CustomerPage from "./pages/CustomerPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import { CartProvider } from "./context/CartContext.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* Private User Routes */}
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={<AdminRoute><DashBoardPage /></AdminRoute>} />
            <Route path="/orderList" element={<AdminRoute><OrderListPage /></AdminRoute>} />
            <Route path="/productmanage" element={<AdminRoute><ProductManagePage /></AdminRoute>} />
            <Route path="/customer" element={<AdminRoute><CustomerPage /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
