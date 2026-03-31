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

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
      />

      {/* Navbar sẽ luôn hiển thị ở mọi trang */}
      <Navbar />

      <Routes>
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

        {/* ======================================= */}
        {/* ROUTES DÀNH RIÊNG CHO ADMIN (Đã tối ưu) */}
        {/* ======================================= */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            user && user.role === "admin" ? (
              <OrderDetails />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
