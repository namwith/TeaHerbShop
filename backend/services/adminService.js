const { pool } = require("../config/db");

const adminService = {
  getDashboardStats: async (filter) => {
    const [[revenueResult]] = await pool.query(
      "SELECT SUM(TotalAmount) AS total FROM Orders WHERE Status IN ('Đã giao', 'Đã hoàn thành')",
    );
    const [[ordersResult]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Orders",
    );
    const [[usersResult]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Users WHERE Role = 'user'",
    );

    let chartQuery = "";
    if (filter === "week") {
      chartQuery = `
        SELECT name, SUM(revenue) as revenue FROM (
          SELECT DATE_FORMAT(OrderDate, '%a') AS name, DATE(OrderDate) as d, SUM(TotalAmount) AS revenue 
          FROM Orders 
          WHERE OrderDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
          AND Status IN ('Đã giao', 'Đã hoàn thành') 
          GROUP BY d, name
        ) t GROUP BY d, name ORDER BY d ASC`;
    } else if (filter === "month") {
      chartQuery = `
        SELECT name, SUM(revenue) as revenue FROM (
          SELECT CONCAT('Tuần ', CEIL(DAY(OrderDate)/7)) AS name, MIN(OrderDate) as d, SUM(TotalAmount) AS revenue 
          FROM Orders 
          WHERE MONTH(OrderDate) = MONTH(CURDATE()) AND YEAR(OrderDate) = YEAR(CURDATE()) 
          AND Status IN ('Đã giao', 'Đã hoàn thành') 
          GROUP BY name
        ) t GROUP BY name ORDER BY d ASC`;
    } else if (filter === "year") {
      chartQuery = `
        SELECT name, SUM(revenue) as revenue FROM (
          SELECT DATE_FORMAT(OrderDate, 'Tháng %c') AS name, MONTH(OrderDate) as m, SUM(TotalAmount) AS revenue 
          FROM Orders 
          WHERE YEAR(OrderDate) = YEAR(CURDATE()) 
          AND Status IN ('Đã giao', 'Đã hoàn thành') 
          GROUP BY m, name
        ) t GROUP BY m, name ORDER BY m ASC`;
    }

    const [chartData] = await pool.query(chartQuery);
    const [topProducts] = await pool.query(`
      SELECT p.ProductID, p.Name, p.ImageURL, SUM(od.Quantity) AS TotalSold
      FROM OrderDetails od 
      JOIN Orders o ON od.OrderID = o.OrderID 
      JOIN Products p ON od.ProductID = p.ProductID
      WHERE o.Status IN ('Đã giao', 'Đã hoàn thành') 
      GROUP BY p.ProductID, p.Name, p.ImageURL 
      ORDER BY TotalSold DESC LIMIT 5
    `);

    return {
      totalRevenue: revenueResult.total || 0,
      totalOrders: ordersResult.total || 0,
      totalUsers: usersResult.total || 0,
      chartData:
        chartData.length > 0
          ? chartData
          : [{ name: "Chưa có dữ liệu", revenue: 0 }],
      topProducts,
    };
  },

  getChartData: async (filter) => {
    let startDate = new Date();
    if (filter === "7days") startDate.setDate(startDate.getDate() - 7);
    else if (filter === "30days") startDate.setDate(startDate.getDate() - 30);
    else if (filter === "3months") startDate.setMonth(startDate.getMonth() - 3);
    else if (filter === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setDate(startDate.getDate() - 7);

    const formattedDate = startDate.toISOString().split("T")[0];
    const query = `SELECT DATE_FORMAT(OrderDate, '%d/%m') as date, COUNT(OrderID) as orders, SUM(TotalAmount) as revenue 
                   FROM Orders 
                   WHERE OrderDate >= ? AND Status NOT IN ('Đã hủy') 
                   GROUP BY DATE_FORMAT(OrderDate, '%d/%m'), DATE(OrderDate)
                   ORDER BY DATE(OrderDate) ASC`;
    const [rows] = await pool.query(query, [formattedDate]);
    return rows;
  },
};

module.exports = adminService;
