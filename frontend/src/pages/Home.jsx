import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
// 1. IMPORT THƯ VIỆN FUSE.JS
import Fuse from "fuse.js";

const Home = () => {
  const [products, setProducts] = useState([]);

  // 2. STATE LƯU TỪ KHÓA TÌM KIẾM
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`🛒 Đã thêm "${product.Name}" vào giỏ hàng!`);
  };
  // THÊM HÀM NÀY ĐỂ BỎ DẤU TIẾNG VIỆT
  const removeAccentsAndSpaces = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D") // Đổi chữ đ
      .replace(/\s+/g, "") // XÓA SẠCH KHOẢNG TRẮNG (VD: "o long" -> "olong")
      .toLowerCase();
  };

  // 2. CẤU HÌNH LẠI BỘ NÃO FUSE
  const fuse = new Fuse(products, {
    keys: ["Name"],
    threshold: 0.15, // Giảm độ mờ xuống 0.3 để tìm chính xác hơn
    ignoreLocation: true,
    getFn: (obj, path) => {
      const value = obj[path[0]];
      return removeAccentsAndSpaces(value); // Ép dữ liệu gốc dính liền lại
    },
  });

  // 3. TÌM KIẾM (Từ khóa gõ vào cũng bị ép dính liền)
  const displayedProducts = searchQuery
    ? fuse
        .search(removeAccentsAndSpaces(searchQuery))
        .map((result) => result.item)
    : products;

  return (
    <div className="container mt-4 mb-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success">
          Chào mừng đến với TeaHerbShop 🌿
        </h1>
        <p className="text-muted">
          Khám phá hương vị trà và thảo mộc tinh tế nhất
        </p>

        {/* 5. THANH TÌM KIẾM SẢN PHẨM */}
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
                placeholder="Tìm kiếm trà, thảo mộc (vd: thai nguyen, o long)..."
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

      <div className="row g-4">
        {products.length === 0 ? (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2 text-muted">Đang pha trà... Vui lòng đợi!</p>
          </div>
        ) : displayedProducts.length > 0 ? (
          displayedProducts.map((p) => (
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
    </div>
  );
};

export default Home;
