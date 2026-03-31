import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Search, ShieldAlert, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getAllUsers, updateUserStatus, deleteUser } from "../services/adminService";

interface User {
  UserID: number;
  Username: string;
  FullName: string;
  Phone: string;
  Status: string;
  CreatedAt: string;
}

const CustomerPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    const actionName = newStatus === "banned" ? "khóa" : "mở khóa";
    
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản này không?`)) return;

    try {
      await updateUserStatus(id, newStatus);
      toast.success(`Đã ${actionName} người dùng thành công!`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("CẢNH BÁO: Xóa người dùng là hành động vĩnh viễn và không thể khôi phục! Bạn có thực sự muốn xóa?")) return;

    try {
      await deleteUser(id);
      toast.success("Đã xóa tài khoản vĩnh viễn!");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa. Người dùng này có thể đang bị ràng buộc bởi Dữ liệu Đơn Hàng.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.Username.toLowerCase().includes(search.toLowerCase()) || 
    (u.FullName && u.FullName.toLowerCase().includes(search.toLowerCase())) ||
    (u.Phone && u.Phone.includes(search))
  );

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
            <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">👥 Quản lý Khách Hàng</h2>
                <div className="flex w-full sm:w-auto items-center gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm Tên, Username hoặc Số điện thoại..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100/50 text-gray-600 text-sm uppercase tracking-wider border-b">
                        <th className="p-4 font-semibold w-16">ID</th>
                        <th className="p-4 font-semibold">Tên truy cập</th>
                        <th className="p-4 font-semibold">Danh tính</th>
                        <th className="p-4 font-semibold">Liên hệ</th>
                        <th className="p-4 font-semibold text-center">Trạng Thái</th>
                        <th className="p-4 font-semibold">Ngày Đăng Ký</th>
                        <th className="p-4 font-semibold text-center w-36">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10">
                            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent flex rounded-full mx-auto mb-2"></div>
                            Đang tải dữ liệu...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-gray-500">
                            Không tìm thấy người dùng nào
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.UserID} className={`transition ${u.Status === 'banned' ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                            <td className="p-4 font-mono text-gray-500">#{u.UserID}</td>
                            <td className="p-4 font-bold text-gray-900 border-l-4 border-l-transparent data-[banned=true]:border-l-red-500" data-banned={u.Status === 'banned'}>
                               @{u.Username}
                            </td>
                            <td className="p-4 font-medium text-gray-800">
                               {u.FullName || <span className="text-gray-400 italic">Chưa khai báo</span>}
                            </td>
                            <td className="p-4 font-mono text-gray-600">
                               {u.Phone || <span className="text-gray-400 italic">N/A</span>}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${u.Status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                {u.Status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                              {new Date(u.CreatedAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleToggleStatus(u.UserID, u.Status)}
                                  className={`p-1.5 rounded transition hover:opacity-80
                                    ${u.Status === 'active' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}
                                  `}
                                  title={u.Status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                >
                                  {u.Status === 'active' ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                                </button>
                                <button 
                                  onClick={() => handleDelete(u.UserID)}
                                  className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition"
                                  title="Xóa vĩnh viễn"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default CustomerPage;
