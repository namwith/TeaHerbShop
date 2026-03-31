import React from "react";

const ProductsTab = ({ products, themeColor, openModal, deleteProduct }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold" style={{ color: themeColor }}>
          🌿 Quản lý Sản phẩm
        </h5>
        <button
          className="btn text-white fw-bold"
          style={{ backgroundColor: themeColor }}
          data-bs-toggle="modal"
          data-bs-target="#adminProductModal"
          onClick={() => openModal()}
        >
          + Thêm Sản phẩm
        </button>
      </div>
      <div className="card-body table-responsive p-0">
        <table className="table table-hover align-middle text-center mb-0">
          <thead className="table-light">
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* THÊM KIỂM TRA DỮ LIỆU RỖNG */}
            {products && products.length > 0 ? (
              products.map((p) => (
                <tr key={p.ProductID}>
                  <td>
                    {p.ImageURL ? (
                      <img
                        src={`http://localhost:3000${p.ImageURL}`}
                        alt={p.Name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          display: "inline-block",
                        }}
                      ></div>
                    )}
                  </td>
                  <td>
                    <strong>{p.Name}</strong>
                  </td>
                  <td className="text-danger fw-bold">
                    {Math.round(p.Price).toLocaleString("vi-VN")} đ
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2 fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#adminProductModal"
                      onClick={() => openModal(p)}
                    >
                      <i className="bi bi-pencil-square"></i> Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger fw-bold"
                      onClick={() => deleteProduct(p.ProductID)}
                    >
                      <i className="bi bi-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              /* GIAO DIỆN KHI CHƯA CÓ SẢN PHẨM NÀO */
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  <h5 className="mb-3">🌿 Chưa có sản phẩm nào!</h5>
                  <p>
                    Hãy bấm nút "+ Thêm Sản phẩm" ở góc trên để đưa mặt hàng đầu
                    tiên lên kệ nhé.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTab;
