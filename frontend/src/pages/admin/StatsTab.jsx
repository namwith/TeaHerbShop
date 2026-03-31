import React, { useState, useEffect } from "react";
import api from "../../api/axios.js";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatsTab = ({ themeColor, token }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    chartData: [],
    topProducts: [],
  });
  const [filter, setFilter] = useState("week");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      setIsLoading(true); // Bật loading khi bắt đầu đổi bộ lọc
      try {
        const res = await api.get(`/admin/dashboard?filter=${filter}`);
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        // 2. TẮT LOADING SAU KHI TẢI XONG DATA (Rất quan trọng)
        setIsLoading(false);
      }
    };

    if (token) fetchStatsData();
  }, [filter, token]);

  // Format tooltip tiền tệ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-sm rounded border">
          <p className="mb-0 fw-bold">{label}</p>
          <p className="mb-0 text-success">
            Doanh thu: {Math.round(payload[0].value).toLocaleString("vi-VN")} đ
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="text-muted mt-3">Đang tải dữ liệu thống kê...</p>
      </div>
    );

  return (
    <div className="row g-4">
      {/* 3 THẺ TỔNG QUAN QUEN THUỘC */}
      <div className="col-md-4">
        <div
          className="card text-white border-0 shadow-sm p-4"
          style={{ backgroundColor: themeColor, borderRadius: "15px" }}
        >
          <h5 className="opacity-75">💰 Tổng Doanh Thu</h5>
          <h2 className="fw-bold">
            {Math.round(stats.totalRevenue).toLocaleString("vi-VN")} đ
          </h2>
        </div>
      </div>
      <div className="col-md-4">
        <div
          className="card text-white border-0 shadow-sm bg-dark p-4"
          style={{ borderRadius: "15px" }}
        >
          <h5 className="opacity-75">📦 Tổng Đơn Hàng</h5>
          <h2 className="fw-bold">{stats.totalOrders} đơn</h2>
        </div>
      </div>
      <div className="col-md-4">
        <div
          className="card text-white border-0 shadow-sm bg-secondary p-4"
          style={{ borderRadius: "15px" }}
        >
          <h5 className="opacity-75">👥 Khách Hàng</h5>
          <h2 className="fw-bold">{stats.totalUsers} người</h2>
        </div>
      </div>

      {/* BIỂU ĐỒ (Cột Trái 7/12) */}
      <div className="col-lg-7">
        <div
          className="card border-0 shadow-sm p-4 h-100"
          style={{ borderRadius: "15px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Biểu đồ doanh thu</h5>
            <select
              className="form-select form-select-sm w-auto shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="week">7 Ngày qua</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>

          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={themeColor}
                      stopOpacity={0.8}
                    />
                    <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 12 }} />
                <YAxis
                  tickFormatter={(val) => `${val / 1000}k`}
                  tick={{ fill: "#888", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={themeColor}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TOP SẢN PHẨM BÁN CHẠY (Cột Phải 5/12) */}
      <div className="col-lg-5">
        <div
          className="card border-0 shadow-sm p-4 h-100"
          style={{ borderRadius: "15px" }}
        >
          <h5 className="fw-bold mb-4">🏆 Top Sản phẩm bán chạy</h5>
          <div className="list-group list-group-flush">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((p, index) => (
                <div
                  key={p.ProductID}
                  className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3"
                >
                  <div className="d-flex align-items-center">
                    <h4
                      className="fw-bold mb-0 me-3"
                      style={{ color: index < 3 ? themeColor : "#aaa" }}
                    >
                      #{index + 1}
                    </h4>
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "8px",
                        marginRight: "12px",
                        backgroundImage: `url(http://localhost:3000${p.ImageURL})`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div>
                      <h6 className="mb-0 fw-bold">{p.Name}</h6>
                    </div>
                  </div>
                  <span className="badge rounded-pill bg-light text-dark fw-bold fs-6">
                    Đã bán: <span className="text-danger">{p.TotalSold}</span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted mt-4">
                Chưa có dữ liệu bán hàng!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
