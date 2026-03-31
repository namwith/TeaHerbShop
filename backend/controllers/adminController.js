const adminService = require("../services/adminService");

const getDashboardStats = async (req, res) => {
  try {
    const { filter = "week" } = req.query;
    const data = await adminService.getDashboardStats(filter);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getChartData = async (req, res) => {
  try {
    const { filter } = req.query;
    const data = await adminService.getChartData(filter);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu biểu đồ:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { getDashboardStats, getChartData };
