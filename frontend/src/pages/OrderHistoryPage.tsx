import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { HomeHeader } from "../components/home/home-header";
import { HomeFooter } from "../components/home/home-footer";
import { Package, Clock, CheckCircle, Truck, CheckCircle2, Star, X, XCircle } from "lucide-react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { submitReview } from "../services/productService";
import { toast } from "sonner";

interface Order {
  id: number;
  date: string;
  status: "Tất cả" | "Chờ xác nhận" | "Đã xác nhận" | "Đang vận chuyển" | "Đã hoàn thành" | "Đã hủy";
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>("Tất cả");
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{
    orderId: number;
    productId: number;
    productName: string;
    rating: number;
    comment: string;
  } | null>(null);

  const statuses: Order["status"][] = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đang vận chuyển", "Đã hoàn thành", "Đã hủy"];

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      const data = res.data?.data || res.data;
      const mappedOrders: Order[] = data.map((order: any) => ({
        id: order.OrderID || order.id,
        date: order.OrderDate || order.date || "",
        status: order.Status || "Chờ xác nhận",
        total: order.TotalAmount || order.total || 0,
        items:
          (order.items ?? order.OrderDetails ?? []).map((item: any) => {
             const imageUrl = item.ImageURL || item.image;
             return {
               id: item.ProductID || item.id,
               name: item.Name || item.name || "",
               quantity: item.Quantity || item.quantity || 1,
               price: item.Price || item.price || 0,
               image: imageUrl && !imageUrl.startsWith('http') ? `http://localhost:3000${imageUrl}` : (imageUrl || "/api/placeholder/100/100"),
             }
          }) || [],
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (selectedStatus === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  }, [selectedStatus, orders]);

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.")) {
      try {
        await cancelOrder(orderId);
        toast.success("Hủy đơn hàng thành công!");
        fetchOrders(); // Refresh order list
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
      }
    }
  };

  const handleOpenReview = (orderId: number, product: any) => {
    setReviewData({
      orderId,
      productId: product.id,
      productName: product.name,
      rating: 5, // Mặc định 5 sao
      comment: ""
    });
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewData) return;
    try {
      await submitReview({
        orderId: reviewData.orderId,
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      setReviewModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá");
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Chờ xác nhận":
        return <Clock className="text-yellow-500" size={20} />;
      case "Đã xác nhận":
        return <CheckCircle className="text-blue-500" size={20} />;
      case "Đang vận chuyển":
        return <Truck className="text-orange-500" size={20} />;
      case "Đã hoàn thành":
        return <CheckCircle2 className="text-green-500" size={20} />;
      case "Đã hủy":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Chờ xác nhận":
        return "text-yellow-600 bg-yellow-100";
      case "Đã xác nhận":
        return "text-blue-600 bg-blue-100";
      case "Đang vận chuyển":
        return "text-orange-600 bg-orange-100";
      case "Đã hoàn thành":
        return "text-green-600 bg-green-100";
      case "Đã hủy":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lịch Sử Đơn Hàng</h1>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  selectedStatus === status
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {getStatusIcon(status)}
                {status}
                {status !== "Tất cả" && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {orders.filter(order => order.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong trạng thái này.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Đơn hàng #{order.id} • {order.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {Number(order.total).toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} sản phẩm
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 p-3 border rounded-lg hover:border-green-200 transition">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500 mb-1">
                              {item.quantity} x {Number(item.price).toLocaleString('vi-VN')}đ
                            </p>
                            {/* Nút Đánh giá (chỉ hiện khi Đã hoàn thành) */}
                            {order.status === "Đã hoàn thành" && (
                              <button 
                                onClick={() => handleOpenReview(order.id, item)}
                                className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md transition"
                              >
                                Đánh giá sản phẩm
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                  {order.status === "Chờ xác nhận" && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-medium transition"
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                  {order.status === "Đã hoàn thành" && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                      Mua Lại
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HomeFooter />

      {/* RATING MODAL */}
      {reviewModalOpen && reviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Đánh giá Sản phẩm</h3>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="font-medium text-gray-700 mb-4 truncate text-center">
                {reviewData.productName}
              </p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`focus:outline-none transition-transform hover:scale-110 ${
                      star <= reviewData.rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    <Star size={36} fill={star <= reviewData.rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bình luận về sản phẩm (Tùy chọn)
                </label>
                <textarea
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Chia sẻ cảm nhận của bạn về chất lượng trà..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleSubmitReview}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition shadow-sm"
              >
                Gửi Đánh Giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
