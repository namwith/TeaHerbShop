import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Search, Eye, X, Package } from "lucide-react";
import { toast } from "sonner";
import { getAllOrders, updateOrderStatus, getOrderDetails } from "../services/adminService";

interface Order {
  OrderID: number;
  UserID: number | null;
  Username?: string;
  OrderDate: string;
  Status: string;
  TotalAmount: number;
  DeliveryAddress: string;
}

const OrderListPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal Chi tiết Đơn
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tải được dữ liệu đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, currentStatus: string, newStatus: string) => {
    if (currentStatus === newStatus) return;
    if (!window.confirm(`Xác nhận đổi trạng thái đơn #${orderId} thành "${newStatus}"?`)) return;

    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Đã cập nhật trạng thái vận đơn!");
      fetchOrders();
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleViewDetails = async (orderId: number) => {
    setModalOpen(true);
    setLoadingDetails(true);
    setSelectedOrderDetails(null);
    try {
      const res = await getOrderDetails(orderId);
      if (res.data?.success) {
        setSelectedOrderDetails(res.data.data);
      }
    } catch (err) {
      toast.error("Lỗi tải chi tiết đơn hàng");
      setModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.OrderID.toString().includes(search) || 
    (o.Username && o.Username.toLowerCase().includes(search.toLowerCase())) ||
    o.DeliveryAddress?.toLowerCase().includes(search.toLowerCase())
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
                <h2 className="text-2xl font-bold text-gray-800">📦 Quản lý Đơn hàng</h2>
                <div className="flex w-full sm:w-auto items-center gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm theo Mã đơn, Khách hàng..."
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
                        <th className="p-4 font-semibold w-24">Mã Đơn</th>
                        <th className="p-4 font-semibold">Tài khoản đặt</th>
                        <th className="p-4 font-semibold text-right">Tổng Tiền</th>
                        <th className="p-4 font-semibold">Ngày Đặt Hàng</th>
                        <th className="p-4 font-semibold text-center w-56">Cập Nhật Trạng Thái</th>
                        <th className="p-4 font-semibold text-right">Chi Tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10">
                            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent flex rounded-full mx-auto mb-2"></div>
                            Đang xử lý dữ liệu...
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-gray-500">
                            Không tìm thấy hóa đơn nào phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o.OrderID} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-bold text-gray-900">
                              #{o.OrderID}
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-gray-800">{o.Username || "Khách Vãng Lai"}</div>
                              <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{o.DeliveryAddress}</div>
                            </td>
                            <td className="p-4 text-right font-bold text-green-600">
                              {Number(o.TotalAmount).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {new Date(o.OrderDate).toLocaleString('vi-VN')}
                            </td>
                            <td className="p-4 text-center">
                              <select 
                                value={o.Status}
                                onChange={(e) => handleStatusChange(o.OrderID, o.Status, e.target.value)}
                                disabled={o.Status === 'Đã hủy' || o.Status === 'Đã hoàn thành'}
                                className={`w-full py-1.5 px-2 text-sm font-bold border rounded outline-none transition
                                  ${o.Status === 'Đã hủy' ? 'bg-red-100 text-red-700 border-red-200' : 
                                    o.Status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700 border-green-200' :
                                    o.Status === 'Đang vận chuyển' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                    o.Status === 'Đã xác nhận' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200 cursor-pointer'} 
                                `}
                              >
                                <option value="Chờ xác nhận">⏳ Chờ xác nhận</option>
                                <option value="Đã xác nhận">📦 Đã xác nhận</option>
                                <option value="Đang vận chuyển">🚚 Đang vận chuyển</option>
                                <option value="Đã hoàn thành">✅ Đã hoàn thành</option>
                                <option value="Đã hủy">❌ Đã hủy</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                               <button 
                                 onClick={() => handleViewDetails(o.OrderID)}
                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition text-sm"
                               >
                                 <Eye size={16} /> Xem
                               </button>
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

      {/* CHI TIẾT ĐƠN HÀNG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package size={24} className="text-green-600" /> Chi Tiết Đơn Hàng
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50/50">
               {loadingDetails ? (
                 <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                    <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent flex rounded-full mb-3"></div>
                    Đang bóc tách dữ liệu đơn hàng...
                 </div>
               ) : selectedOrderDetails ? (
                 <div className="space-y-6">
                    {/* Header thông tin khách */}
                    <div className="bg-white p-5 rounded-lg border shadow-sm">
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Mã Bưu Kiện</p>
                            <p className="font-bold text-lg text-gray-900">#{selectedOrderDetails.OrderID}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Khách Hàng</p>
                            <p className="font-bold text-gray-900">{selectedOrderDetails.UserFullName || selectedOrderDetails.Username || "Khách ẩn danh"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500 mb-1">Thông tin liên hệ</p>
                            <p className="font-medium text-gray-800">{selectedOrderDetails.UserPhone || "Không có SĐT"} • {selectedOrderDetails.DeliveryAddress}</p>
                          </div>
                       </div>
                    </div>

                    {/* Danh sách SP */}
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                       <div className="px-5 py-3 bg-gray-50 border-b font-semibold text-gray-700">Mặt Hàng Đã Đặt</div>
                       <ul className="divide-y">
                          {selectedOrderDetails.items?.map((item: any, idx: number) => (
                             <li key={idx} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition">
                                <img 
                                  src={item.ImageURL && !item.ImageURL.startsWith('http') ? `http://localhost:3000${item.ImageURL}` : item.ImageURL} 
                                  className="w-16 h-16 rounded object-cover border"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'; }}
                                  alt="Product"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-base">{item.Name}</h4>
                                  <p className="text-gray-500 text-sm mt-1">
                                    Đơn giá: {Number(item.Price).toLocaleString('vi-VN')}đ x <span className="font-bold text-black border px-2 py-0.5 rounded bg-white">{item.Quantity}</span>
                                  </p>
                                </div>
                                <div className="text-right font-bold text-green-700 text-lg">
                                  {Number(item.Price * item.Quantity).toLocaleString('vi-VN')}đ
                                </div>
                             </li>
                          ))}
                       </ul>
                       <div className="p-5 bg-gray-50 border-t flex justify-between items-center">
                          <span className="font-semibold text-gray-600 uppercase tracking-widest text-sm">Tổng Cộng Giỏ Hàng</span>
                          <span className="font-black text-2xl text-red-600">{Number(selectedOrderDetails.TotalAmount).toLocaleString('vi-VN')}đ</span>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="py-20 text-center text-gray-500">Lỗi không tìm thấy chi tiết đơn.</div>
               )}
            </div>

          </div>
        </div>
      )}
    </TooltipProvider>
  );
};

export default OrderListPage;
