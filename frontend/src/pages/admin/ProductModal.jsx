import React from "react";

const ProductModal = ({
  productForm,
  setProductForm,
  handleSaveProduct,
  themeColor,
}) => {
  return (
    <div
      className="modal fade"
      id="adminProductModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content border-0">
          <div
            className="modal-header text-white"
            style={{ backgroundColor: themeColor }}
          >
            <h5 className="modal-title fw-bold">
              {productForm.id ? "✏️ Cập nhật Sản phẩm" : "➕ Thêm Sản phẩm mới"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              id="btnCloseModal"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSaveProduct}>
              <div className="mb-3">
                <label className="form-label fw-bold">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={productForm.Name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, Name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-bold">Phân loại</label>
                  <select
                    className="form-select"
                    value={productForm.Type}
                    onChange={(e) =>
                      setProductForm({ ...productForm, Type: e.target.value })
                    }
                    required
                  >
                    <option value="tea">Trà</option>
                    <option value="herb">Thảo mộc</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productForm.Price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, Price: e.target.value })
                    }
                    min="1000"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Mô tả</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={productForm.Description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      Description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.files[0] })
                  }
                />
                <small className="text-muted italic text-xs">
                  * Chỉ nhận file ảnh (.jpg, .png, .webp)
                </small>
              </div>

              <button
                type="submit"
                className="btn text-white w-100 fw-bold py-2 shadow-sm"
                style={{ backgroundColor: themeColor }}
              >
                {productForm.id ? "Lưu thay đổi" : "Tạo sản phẩm ngay"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
