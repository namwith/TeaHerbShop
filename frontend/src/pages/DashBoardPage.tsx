import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getDashboardStats, getChartData } from "@/services/adminService";

const DashBoardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [chartFilter, setChartFilter] = useState("7days");
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await getDashboardStats();
        if (res.data?.success) {
          setStats({
            totalRevenue: res.data.data.totalRevenue,
            totalOrders: res.data.data.totalOrders,
            totalUsers: res.data.data.totalUsers,
          });
        }
      } catch (err) {
        console.error("Lỗi lấy tổng quan stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await getChartData(`?filter=${chartFilter}`);
        if (res.data?.success) {
          setChartData(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu biểu đồ:", err);
      }
    };
    fetchChart();
  }, [chartFilter]);

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2 p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 pl-2">Tổng Quan Admin</h2>
              <div className="flex flex-col gap-4 md:gap-6">
                {loadingStats ? (
                  <div className="h-32 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <SectionCards data={stats} />
                )}
                
                <div className="w-full">
                  <ChartAreaInteractive 
                    chartData={chartData} 
                    filter={chartFilter} 
                    setFilter={setChartFilter} 
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashBoardPage;
