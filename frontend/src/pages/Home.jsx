import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import Fuse from "fuse.js";
import api from "../api/axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // 1. STATE DÀNH CHO PHÂN TRANG (PAGINATION)
  // ==========================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số sản phẩm hiển thị trên 1 trang (có thể chỉnh thành 12, 16...)

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Khi người dùng gõ tìm kiếm -> Tự động đưa về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchProducts = async () => {
    // Chỉ cần gọi /products, nó tự hiểu là http://localhost:3000/api/products
    const res = await api.get("/products");
    if (res.data.success) {
      setProducts(res.data.data);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`🛒 Đã thêm "${product.Name}" vào giỏ hàng!`);
  };

  const removeAccentsAndSpaces = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "")
      .toLowerCase();
  };

  const fuse = new Fuse(products, {
    keys: ["Name"],
    threshold: 0.15,
    ignoreLocation: true,
    getFn: (obj, path) => {
      const value = obj[path[0]];
      return removeAccentsAndSpaces(value);
    },
  });

  // TẤT CẢ SẢN PHẨM SAU KHI LỌC TÌM KIẾM
  const displayedProducts = searchQuery
    ? fuse
        .search(removeAccentsAndSpaces(searchQuery))
        .map((result) => result.item)
    : products;

  // ==========================================
  // 2. LOGIC TÍNH TOÁN SẢN PHẨM CHO TRANG HIỆN TẠI
  // ==========================================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Cắt lấy đúng 8 sản phẩm cho trang hiện tại
  const currentItems = displayedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4 mb-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success">
          Chào mừng đến với TeaHerbShop 🌿
        </h1>
        <p className="text-muted">
          Khám phá hương vị trà và thảo mộc tinh tế nhất
        </p>

        {/* THANH TÌM KIẾM */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <div
              className="input-group input-group-lg shadow-sm"
              style={{ borderRadius: "50px", overflow: "hidden" }}
            >
              <span className="input-group-text bg-white border-0 text-success px-4">
                🔍
              </span>
              <input
                type="text"
                className="form-control border-0 bg-white"
                placeholder="Tìm kiếm trà, thảo mộc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ boxShadow: "none" }}
              />
              {searchQuery && (
                <button
                  className="btn btn-light border-0"
                  onClick={() => setSearchQuery("")}
                >
                  ❌
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="text-start mt-2 ms-3 text-muted small">
                Tìm thấy <strong>{displayedProducts.length}</strong> kết quả cho
                "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="row g-4">
        {products.length === 0 ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2 text-muted">Đang pha trà... Vui lòng đợi!</p>
          </div>
        ) : currentItems.length > 0 ? (
          currentItems.map((p) => (
            <div className="col-md-3" key={p.ProductID}>
              <div className="card h-100 shadow-sm border-0 transition-hover">
                {p.ImageURL ? (
                  <img
                    src={`http://localhost:3000${p.ImageURL}`}
                    className="card-img-top"
                    alt={p.Name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "250px" }}
                  >
                    <span className="text-secondary opacity-50 fw-bold fs-5 text-center px-2">
                      {p.Name}
                    </span>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{p.Name}</h5>
                  <span
                    className={`badge mb-3 w-50 ${p.Type === "tea" ? "bg-success" : "bg-warning text-dark"}`}
                  >
                    {p.Type === "tea" ? "🍵 Trà" : "🌿 Thảo mộc"}
                  </span>
                  <p className="card-text text-muted small flex-grow-1">
                    {p.Description}
                  </p>

                  <h5 className="text-danger fw-bold mb-3">
                    {Math.round(p.Price).toLocaleString("vi-VN")} đ
                  </h5>

                  <button
                    className="btn btn-outline-success mt-auto w-100 fw-bold"
                    onClick={() => handleAddToCart(p)}
                  >
                    + Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100 py-5">
            <h4 className="text-muted">
              🧐 Không tìm thấy sản phẩm nào phù hợp!
            </h4>
            <p className="text-muted">
              Thử tìm bằng một từ khóa khác xem sao nhé.
            </p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 3. GIAO DIỆN NÚT CHUYỂN TRANG */}
      {/* ========================================== */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <ul className="pagination shadow-sm">
            {/* Nút Previous */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-success"
                onClick={() => paginate(currentPage - 1)}
              >
                &laquo; Trước
              </button>
            </li>

            {/* Các số trang */}
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className={`page-link ${currentPage === index + 1 ? "bg-success border-success" : "text-success"}`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Nút Next */}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link text-success"
                onClick={() => paginate(currentPage + 1)}
              >
                Sau &raquo;
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
