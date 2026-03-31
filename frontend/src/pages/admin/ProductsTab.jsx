import React from "react";

const ProductsTab = ({ products, themeColor, openModal, deleteProduct }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold" style={{ color: themeColor }}>
          🌿 quản lý Sản phẩm
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
      <div className="card-body table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.ProductID}>
                <td>
                  <img
                    src={`http://localhost:3000${p.ImageURL}`}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>
                <td>
                  <strong>{p.Name}</strong>
                </td>
                <td className="text-danger fw-bold">
                  {Math.round(p.Price).toLocaleString("vi-VN")} đ
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#adminProductModal"
                    onClick={() => openModal(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteProduct(p.ProductID)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTab;
