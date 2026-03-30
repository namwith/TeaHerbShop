import React from "react";

const UsersTab = ({ users, themeColor, updateUserStatus, deleteUser }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold" style={{ color: themeColor }}>
          👥 Quản lý Khách hàng
        </h5>
      </div>
      <div className="card-body table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Tài khoản</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.UserID}>
                <td>{u.UserID}</td>
                <td>
                  <strong>{u.Username}</strong>
                </td>
                <td>{u.FullName || "Chưa cập nhật"}</td>
                <td>
                  <span
                    className={`badge ${u.Status === "active" ? "bg-success" : "bg-danger"}`}
                  >
                    {u.Status === "active" ? "Hoạt động" : "Bị Khóa"}
                  </span>
                </td>
                <td>
                  {/* Nút Khóa/Mở (đã có) */}
                  <button
                    className={`btn btn-sm ${u.Status === "active" ? "btn-outline-danger" : "btn-success"} me-2`}
                    onClick={() => updateUserStatus(u.UserID, u.Status)}
                  >
                    {u.Status === "active" ? "🔒 Khóa" : "🔓 Mở"}
                  </button>

                  {/* NÚT XÓA MỚI THÊM */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(u.UserID)}
                    title="Xóa vĩnh viễn"
                  >
                    <i className="bi bi-trash"></i> Xóa
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

export default UsersTab;
