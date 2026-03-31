import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { HomeHeader } from "../components/home/home-header";
import { HomeFooter } from "../components/home/home-footer";
import { User, Mail, Phone, MapPin, Edit, LogOut, Check, X } from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile } from "../services/userService";

interface UserInfo {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  email?: string;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // States for Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const data = res.data?.data || res.data;
        
        const info = {
          id: data.UserID || data.id || 1,
          username: data.Username || data.username || "",
          fullName: data.FullName || data.fullName || "",
          phone: data.Phone || data.phone || "",
          address: data.Address || data.address || "",
          email: data.Email || data.email || "",
        };

        setUserInfo(info);
        setFormData({
          fullName: info.fullName,
          phone: info.phone,
          address: info.address,
          email: info.email
        });

      } catch (error) {
        console.error(error);
        toast.error("Lấy thông tin tài khoản thất bại");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng điền Họ tên hợp lệ");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(formData);
      setUserInfo(prev => prev ? { ...prev, ...formData } : null);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <User size={32} className="text-green-600" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="mb-2">
                  <label className="text-xs text-gray-500 font-semibold mb-1 block">Họ và tên</label>
                  <input 
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full sm:max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập họ tên của bạn..."
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{userInfo.fullName || "User"}</h1>
              )}
              <p className="text-gray-600 font-mono">@{userInfo.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-800">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  {isEditing ? (
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="VD: user@example.com"
                    />
                  ) : (
                    <p className="font-medium">{userInfo.email || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  {isEditing ? (
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="VD: 0912345678"
                    />
                  ) : (
                    <p className="font-medium">{userInfo.phone || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng mặc định</p>
                  {isEditing ? (
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Nhập địa chỉ nhận hàng của bạn..."
                    />
                  ) : (
                    <p className="font-medium leading-relaxed">{userInfo.address || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            {!isEditing ? (
               <>
                <button
                  onClick={() => navigate("/orders")}
                  className="flex-[2] bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  Xem Đơn Hàng Của Tôi
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Edit size={20} />
                  Sửa Thông Tin
                </button>
                <button
                  onClick={handleLogout}
                  className="w-auto border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                </button>
               </>
            ) : (
               <>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {saving ? "Đang lưu..." : "Lưu Thông Tin Mới"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="flex-1 border bg-white text-gray-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Hủy Thao Tác
                </button>
               </>
            )}
            
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default AccountPage;