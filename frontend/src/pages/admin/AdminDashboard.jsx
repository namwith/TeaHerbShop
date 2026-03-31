import React, { useState, useEffect, useContext } from "react";
// 1. IMPORT API
import api from "../../api/axios.js";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

import StatsTab from "./StatsTab";
import OrdersTab from "./OrdersTab";
import ProductsTab from "./ProductsTab";
import UsersTab from "./UsersTab";
import ProductModal from "./ProductModal";
import InventoryTab from "./InventoryTab";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const themeColor = "#f97316";

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState({
    id: "",
    Name: "",
    Type: "tea",
    Price: "",
    Stock: "",
    Description: "",
    image: null,
  });

  useEffect(() => {
    if (!token) return;
    if (activeTab === "dashboard") fetchStats();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, token]);

  // 2. GỌI API TẤT CẢ ĐỀU NGẮN GỌN
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch stats", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch orders", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch products", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch users", err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    if (!window.confirm(`Chuyển đơn #${id} sang "${status}"?`)) return;
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success("Cập nhật trạng thái thành công!");
      fetchOrders();
    } catch (err) {
      toast.error("Lỗi cập nhật đơn hàng");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("❗ CẢNH BÁO: Xóa VĨNH VIỄN tài khoản này?")) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  };

  const updateUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    if (!window.confirm(`Xác nhận thay đổi trạng thái người dùng?`)) return;
    try {
      await api.put(`/admin/users/${id}/status`, { status: newStatus });
      toast.success("Cập nhật người dùng thành công!");
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi cập nhật người dùng");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      toast.error("Lỗi xóa sản phẩm");
    }
  };

  const openModal = (prod = null) => {
    if (prod) {
      setProductForm({
        id: prod.ProductID,
        Name: prod.Name,
        Type: prod.Type,
        Price: prod.Price,
        Stock: prod.Stock,
        Description: prod.Description || "",
        image: null,
      });
    } else {
      setProductForm({
        id: "",
        Name: "",
        Type: "tea",
        Price: "",
        Stock: 100, // Default stock
        Description: "",
        image: null,
      });
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productForm).forEach((key) => {
      if (key === "image" && productForm[key])
        formData.append(key, productForm[key]);
      else if (key !== "image") formData.append(key, productForm[key]);
    });

    const method = productForm.id ? "put" : "post";
    const url = `/admin/products${productForm.id ? `/${productForm.id}` : ""}`;

    try {
      const res = await api[method](url, formData);
      if (res.data.success) {
        document.getElementById("btnCloseModal").click();
        toast.success("Lưu sản phẩm thành công!");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Lỗi lưu sản phẩm");
    }
  };

  return (
    <div
      className="container-fluid px-4 py-4 mb-5"
      style={{ minHeight: "90vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0" style={{ color: themeColor }}>
          ⚙️ Admin Control Panel
        </h3>
      </div>

      <div className="row">
        <div className="col-md-2 mb-4">
          <div
            className="list-group shadow-sm border-0 sticky-top"
            style={{ top: "20px" }}
          >
            {[
              { id: "dashboard", label: "📊 Thống kê" },
              { id: "orders", label: "📦 Đơn hàng" },
              { id: "products", label: "🌿 Sản phẩm" },
              { id: "inventory", label: "🏭 Kho hàng" },
              { id: "users", label: "👥 Khách hàng" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`list-group-item list-group-item-action border-0 fw-bold py-3 transition-all ${activeTab === tab.id ? "shadow-sm" : ""}`}
                style={
                  activeTab === tab.id
                    ? { backgroundColor: themeColor, color: "white" }
                    : { color: "#555" }
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-10">
          <div className="tab-content transition-fade">
            {activeTab === "dashboard" && (
              <StatsTab themeColor={themeColor} token={token} />
            )}
            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                themeColor={themeColor}
                updateOrderStatus={updateOrderStatus}
              />
            )}
            {activeTab === "products" && (
              <ProductsTab
                products={products}
                themeColor={themeColor}
                openModal={openModal}
                deleteProduct={deleteProduct}
              />
            )}
            {activeTab === "users" && (
              <UsersTab
                users={users}
                themeColor={themeColor}
                updateUserStatus={updateUserStatus}
                deleteUser={deleteUser}
              />
            )}
            {activeTab === "inventory" && (
              <InventoryTab
                products={products}
                themeColor={themeColor}
                handleUpdateStock={async (id, currentStock) => {
                  const newStock = prompt(
                    `Nhập số lượng kho mới cho sản phẩm (Hiện tại: ${currentStock}):`,
                    currentStock,
                  );
                  if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
                    try {
                      const res = await api.put(`/admin/products/${id}/stock`, {
                        stock: parseInt(newStock),
                      });
                      if (res.data.success) {
                        toast.success("📦 Đã cập nhật số lượng kho!");
                        fetchProducts();
                      }
                    } catch (error) {
                      toast.error("Lỗi khi cập nhật kho!");
                    }
                  }
                }}
                handleToggleVisibility={async (id, currentStatus) => {
                  const newStatus =
                    currentStatus === "hidden" ? "active" : "hidden";
                  try {
                    const res = await api.put(`/admin/products/${id}/status`, {
                      status: newStatus,
                    });
                    if (res.data.success) {
                      toast.success(
                        "👁️ Cập nhật trạng thái hiển thị thành công!",
                      );
                      fetchProducts();
                    }
                  } catch (error) {
                    toast.error("Lỗi khi cập nhật trạng thái!");
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
      <ProductModal
        productForm={productForm}
        setProductForm={setProductForm}
        handleSaveProduct={handleSaveProduct}
        themeColor={themeColor}
      />
    </div>
  );
};

export default AdminDashboard;
