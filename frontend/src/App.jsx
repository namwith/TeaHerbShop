import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import OrderDetails from "./pages/admin/OrderDetails";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";

function App() {
  const { user } = useContext(AuthContext);

  // Component bảo vệ: Nếu không phải admin thì đá văng về trang chủ
  const AdminRoute = ({ element }) => {
    return user && user.role === "admin" ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>

    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    
      {/* Navbar sẽ luôn hiển thị ở mọi trang */}
      <Navbar />

      <Routes>
        {/* Trang dành cho khách mua hàng (Đã thay bằng Component Home thật) */}
        <Route path="/" element={<Home />} />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />

        <Route
          path="/orders"
          element={user ? <OrderHistory /> : <Navigate to="/" />}
        />

        <Route
          path="/orders/:id"
          element={user ? <OrderDetail /> : <Navigate to="/" />}
        />

        <Route
          path="/checkout"
          element={user ? <Checkout /> : <Navigate to="/?login=true" />}
        />

        {/* Trang dành riêng cho Admin (Có lớp bảo vệ AdminRoute) */}
        <Route
          path="/admin"
          element={<AdminRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/admin/orders/:id"
          element={<AdminRoute element={<OrderDetails />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
