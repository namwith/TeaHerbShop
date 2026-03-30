import React, { useState, useEffect } from "react";
import axios from "axios";

const CheckoutForm = ({ formData, setFormData, handlePlaceOrder }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // 1. Tải danh sách Tỉnh/Thành phố khi mở trang
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=3",
        );
        setProvinces(res.data);
      } catch (error) {
        console.error("Lỗi tải API địa giới hành chính:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Xử lý khi chọn Tỉnh/Thành
  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setFormData({
      ...formData,
      Province: provinceName,
      District: "",
      Ward: "",
    });

    const selectedProv = provinces.find((p) => p.name === provinceName);
    if (selectedProv) {
      setDistricts(selectedProv.districts);
      setWards([]); // Xóa phường/xã cũ
    }
  };

  // Xử lý khi chọn Quận/Huyện
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData({ ...formData, District: districtName, Ward: "" });

    const selectedDist = districts.find((d) => d.name === districtName);
    if (selectedDist) {
      setWards(selectedDist.wards);
    }
  };

  // 2. Validate SĐT (Chỉ cho phép gõ số)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Xóa ký tự không phải số
    setFormData({ ...formData, Phone: value });
  };

  return (
    <div className="card shadow-sm border-0 mb-4 p-4">
      <h5 className="fw-bold mb-3 border-bottom pb-2">
        📍 Thông tin giao hàng
      </h5>

      <form id="checkout-form" onSubmit={handlePlaceOrder}>
        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label fw-bold">Họ và Tên</label>
            <input
              type="text"
              className="form-control"
              value={formData.FullName}
              onChange={(e) =>
                setFormData({ ...formData, FullName: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              value={formData.Phone}
              onChange={handlePhoneChange}
              pattern="[0][0-9]{9}"
              maxLength="10"
              title="Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"
              placeholder="VD: 0912345678"
              required
            />
          </div>
        </div>

        {/* KHU VỰC ĐỊA CHỈ 3 CẤP */}
        <label className="form-label fw-bold">Địa chỉ nhận hàng</label>
        <div className="row mb-3">
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={formData.Province}
              onChange={handleProvinceChange}
              required
            >
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={formData.District}
              onChange={handleDistrictChange}
              required
              disabled={!formData.Province}
            >
              <option value="">-- Chọn Quận/Huyện --</option>
              {districts.map((d) => (
                <option key={d.code} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={formData.Ward}
              onChange={(e) =>
                setFormData({ ...formData, Ward: e.target.value })
              }
              required
              disabled={!formData.District}
            >
              <option value="">-- Chọn Phường/Xã --</option>
              {wards.map((w) => (
                <option key={w.code} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Số nhà, Tên đường..."
            value={formData.Street}
            onChange={(e) =>
              setFormData({ ...formData, Street: e.target.value })
            }
            required
          />
        </div>

        <h5 className="fw-bold mb-3 border-bottom pb-2">
          💳 Phương thức thanh toán
        </h5>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="cod"
            value="COD"
            checked={formData.PaymentMethod === "COD"}
            onChange={(e) =>
              setFormData({ ...formData, PaymentMethod: e.target.value })
            }
          />
          <label className="form-check-label fw-bold" htmlFor="cod">
            Thanh toán khi nhận hàng (COD)
          </label>
        </div>
        <div className="form-check mb-2 text-muted">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            value="VNPay"
            disabled
          />
          <label className="form-check-label">
            Thanh toán VNPay (Sắp ra mắt)
          </label>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
