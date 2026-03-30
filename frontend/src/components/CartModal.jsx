import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// 1. IMPORT TOAST
import { toast } from "react-toastify";

const CartModal = () => {
  // 2. NHẬN THÊM HÀM updateQuantity
  const { cart, removeFromCart, cartTotal, updateQuantity } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3. HÀM CHUẨN HÓA TIỀN TỆ (Cắt đuôi .00)
  const formatPrice = (amount) => {
    return Math.round(amount).toLocaleString("vi-VN");
  };

  const handleGoToCheckout = () => {
    if (!user) {
      // 4. THAY THẾ ALERT BẰNG TOAST THÔNG BÁO TỰ TẮT
      toast.warning("Vui lòng đăng nhập để thanh toán!");
      document.getElementById("btnCloseCart").click();
      document.querySelector('[data-bs-target="#authModal"]').click();
      return;
    }

    if (cart.length === 0) {
      toast.info("Giỏ hàng của bạn đang trống!");
      return;
    }

    document.getElementById("btnCloseCart").click();
    setTimeout(() => {
      navigate("/checkout");
    }, 150);
  };

  return (
    <div className="modal fade" id="cartModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div
            className="modal-header text-white"
            style={{ backgroundColor: "#f97316" }}
          >
            <h5 className="modal-title fw-bold">🛒 Giỏ hàng của bạn</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              id="btnCloseCart"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body p-0">
            {cart.length === 0 ? (
              <p className="text-center text-muted my-5">
                Giỏ hàng đang trống. Hãy chọn vài món trà nhé!
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th className="text-center">Số lượng</th>
                      <th>Thành tiền</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.ProductID}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center">
                            {item.ImageURL && (
                              <img
                                src={`http://localhost:3000${item.ImageURL}`}
                                alt={item.Name}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  marginRight: "12px",
                                }}
                              />
                            )}
                            <strong className="text-dark">{item.Name}</strong>
                          </div>
                        </td>

                        <td className="text-muted">
                          {formatPrice(item.Price)} đ
                        </td>

                        {/* CỘT SỐ LƯỢNG MỚI (CÓ NÚT TĂNG GIẢM) */}
                        <td style={{ width: "120px" }}>
                          <div className="input-group input-group-sm">
                            <button
                              className="btn btn-outline-secondary px-2"
                              onClick={() =>
                                updateQuantity(
                                  item.ProductID,
                                  item.quantity - 1,
                                )
                              }
                            >
                              {" "}
                              -{" "}
                            </button>
                            <input
                              type="text"
                              className="form-control text-center fw-bold px-0"
                              value={item.quantity}
                              readOnly
                              style={{ backgroundColor: "white" }}
                            />
                            <button
                              className="btn btn-outline-secondary px-2"
                              onClick={() =>
                                updateQuantity(
                                  item.ProductID,
                                  item.quantity + 1,
                                )
                              }
                            >
                              {" "}
                              +{" "}
                            </button>
                          </div>
                        </td>

                        <td className="text-danger fw-bold">
                          {formatPrice(item.Price * item.quantity)} đ
                        </td>

                        <td className="text-end pe-3">
                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => removeFromCart(item.ProductID)}
                            title="Xóa sản phẩm"
                          >
                            <i className="bi bi-trash fs-5"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer d-flex justify-content-between bg-light py-3 border-top-0">
            <h5 className="mb-0 text-dark">
              Tổng tiền:{" "}
              <span className="text-danger fw-bold ms-2 fs-4">
                {formatPrice(cartTotal)} đ
              </span>
            </h5>
            <button
              className="btn text-white fw-bold px-4 py-2"
              style={{ backgroundColor: "#f97316", borderRadius: "8px" }}
              onClick={handleGoToCheckout}
              disabled={cart.length === 0}
            >
              💳 Tiến hành Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
