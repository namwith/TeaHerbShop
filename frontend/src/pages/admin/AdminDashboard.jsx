import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

// Import các Sub-Components
import StatsTab from "./StatsTab";
import OrdersTab from "./OrdersTab";
import ProductsTab from "./ProductsTab";
import UsersTab from "./UsersTab";
import ProductModal from "./ProductModal";
import InventoryTab from "./InventoryTab";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const themeColor = "#f97316"; // Màu cam chủ đạo

  // --- STATE DỮ LIỆU ---
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
    Description: "",
    image: null,
  });

  // --- QUẢN LÝ GỌI API ---
  useEffect(() => {
    if (!token) return;
    if (activeTab === "dashboard") fetchStats();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, token]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch stats", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch orders", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch products", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error("Lỗi fetch users", err);
    }
  };

  // --- HÀNH ĐỘNG (LOGIC) ---
  const updateOrderStatus = async (id, status) => {
    if (!window.confirm(`Chuyển đơn #${id} sang "${status}"?`)) return;
    try {
      await axios.put(
        `http://localhost:3000/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchOrders();
    } catch (err) {
      alert("Lỗi cập nhật đơn hàng");
    }
  };

  // ✅ HÀM XÓA USER ĐÃ ĐƯỢC TÁCH RA ĐỘC LẬP
  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "❗ CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản này? Thao tác này không thể hoàn tác!",
      )
    )
      return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        alert(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  };

  const updateUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    if (!window.confirm(`Xác nhận thay đổi trạng thái người dùng?`)) return;
    try {
      await axios.put(
        `http://localhost:3000/api/admin/users/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchUsers();
    } catch (err) {
      alert("Lỗi cập nhật người dùng");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Lỗi xóa sản phẩm");
    }
  };

  const openModal = (prod = null) => {
    if (prod) {
      setProductForm({
        id: prod.ProductID,
        Name: prod.Name,
        Type: prod.Type,
        Price: prod.Price,
        Description: prod.Description || "",
        image: null,
      });
    } else {
      setProductForm({
        id: "",
        Name: "",
        Type: "tea",
        Price: "",
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
    const url = `http://localhost:3000/api/admin/products${productForm.id ? `/${productForm.id}` : ""}`;

    try {
      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        document.getElementById("btnCloseModal").click();
        fetchProducts();
      }
    } catch (err) {
      alert("Lỗi lưu sản phẩm");
    }
  };

  // --- GIAO DIỆN ---
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
        {/* Sidebar Menu */}
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

        {/* Main Content Area */}
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

            {/* ĐÃ TRUYỀN HÀM XÓA XUỐNG USERSTAB */}
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
                      const res = await axios.put(
                        `http://localhost:3000/api/admin/products/${id}/stock`,
                        { stock: parseInt(newStock) },
                        { headers: { Authorization: `Bearer ${token}` } },
                      );
                      if (res.data.success) {
                        toast.success("📦 Đã cập nhật số lượng kho!");
                        fetchProducts(); // Tải lại danh sách để thanh Progress Bar chạy lại
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
                    const res = await axios.put(
                      `http://localhost:3000/api/admin/products/${id}/status`,
                      { status: newStatus },
                      { headers: { Authorization: `Bearer ${token}` } },
                    );
                    if (res.data.success) {
                      toast.success(
                        "👁️ Cập nhật trạng thái hiển thị thành công!",
                      );
                      fetchProducts(); // Tải lại danh sách
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
