import React from "react";

const InventoryTab = ({
  products,
  themeColor,
  handleUpdateStock,
  handleToggleVisibility,
}) => {
  const MAX_CAPACITY = 1000; // Sức chứa tối đa của mỗi sản phẩm trong kho

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold" style={{ color: themeColor }}>
          🏭 Quản lý Kho hàng (Inventory)
        </h5>
      </div>
      <div className="card-body table-responsive p-0">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">Sản phẩm</th>
              <th style={{ width: "25%" }}>
                Dung lượng kho (Tối đa: {MAX_CAPACITY})
              </th>
              <th className="text-center">Tồn kho</th>
              <th className="text-center">Trạng thái</th>
              <th className="pe-4 text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* THÊM KIỂM TRA DỮ LIỆU RỖNG */}
            {products && products.length > 0 ? (
              products.map((p) => {
                // Logic tính toán phần trăm và cảnh báo
                const percentage = Math.min(
                  (p.Stock / MAX_CAPACITY) * 100,
                  100,
                );
                const isLowStock = percentage < 30; // Dưới 30% là báo động đỏ

                return (
                  <tr key={p.ProductID}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        {p.ImageURL && (
                          <img
                            src={`http://localhost:3000${p.ImageURL}`}
                            alt={p.Name}
                            style={{
                              width: "45px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginRight: "12px",
                            }}
                          />
                        )}
                        <div>
                          <strong className="d-block text-dark">
                            {p.Name}
                          </strong>
                          <small className="text-muted">
                            {p.Type === "tea" ? "🍵 Trà" : "🌿 Thảo mộc"}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* THANH DUNG LƯỢNG KHO */}
                    <td>
                      <div
                        className="progress mb-1"
                        style={{ height: "12px", backgroundColor: "#e9ecef" }}
                      >
                        <div
                          className={`progress-bar ${isLowStock ? "bg-danger progress-bar-striped progress-bar-animated" : "bg-success"}`}
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      {isLowStock ? (
                        <small className="text-danger fw-bold">
                          <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                          Sắp hết hàng!
                        </small>
                      ) : (
                        <small className="text-success">Mức an toàn</small>
                      )}
                    </td>

                    <td className="text-center fw-bold fs-5 text-dark">
                      {p.Stock}
                    </td>

                    {/* TRẠNG THÁI ẨN / HIỆN */}
                    <td className="text-center">
                      <span
                        className={`badge ${p.Status === "hidden" ? "bg-secondary" : "bg-primary"}`}
                      >
                        {p.Status === "hidden" ? "Đã ẩn" : "Đang bán"}
                      </span>
                    </td>

                    {/* NÚT HÀNH ĐỘNG */}
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-dark me-2 fw-bold"
                        onClick={() => handleUpdateStock(p.ProductID, p.Stock)}
                        title="Nhập thêm hàng"
                      >
                        <i className="bi bi-box-arrow-in-down"></i> Nhập kho
                      </button>
                      <button
                        className={`btn btn-sm fw-bold ${p.Status === "hidden" ? "btn-success" : "btn-warning"}`}
                        onClick={() =>
                          handleToggleVisibility(p.ProductID, p.Status)
                        }
                      >
                        {p.Status === "hidden" ? "Hiện SP" : "Ẩn SP"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* GIAO DIỆN KHI CHƯA CÓ SẢN PHẨM NÀO */
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <h5 className="mb-3">🏭 Kho hàng đang trống!</h5>
                  <p>
                    Hãy sang tab Sản phẩm để thêm các mặt hàng mới vào hệ thống
                    nhé.
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

export default InventoryTab;
