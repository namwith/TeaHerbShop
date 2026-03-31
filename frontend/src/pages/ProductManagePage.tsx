import { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Edit, Trash2, Plus, X, ImageIcon, Search } from "lucide-react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "../services/adminService";

interface Product {
  ProductID: number;
  Name: string;
  Type: string;
  Price: number;
  Stock: number;
  ImageURL: string;
  Status: string;
  Description?: string;
}

const ProductManagePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    Name: "",
    Type: "tea",
    Price: "",
    Stock: "",
    Description: "",
    Status: "active"
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProducts();
      if (res.data?.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.ProductID);
      setForm({
        Name: product.Name,
        Type: product.Type,
        Price: product.Price.toString(),
        Stock: product.Stock ? product.Stock.toString() : "0",
        Description: product.Description || "",
        Status: product.Status || "active"
      });
      setPreviewImage(
        product.ImageURL.startsWith('http') 
          ? product.ImageURL 
          : `http://localhost:3000${product.ImageURL}`
      );
    } else {
      setEditingId(null);
      setForm({
        Name: "",
        Type: "tea",
        Price: "",
        Stock: "0",
        Description: "",
        Status: "active"
      });
      setPreviewImage("");
    }
    setSelectedImage(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này có thể ảnh hưởng đến lịch sử đơn hàng.")) return;
    try {
      await deleteProduct(id);
      toast.success("Đã xóa sản phẩm!");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi xóa sản phẩm");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Name || !form.Price) {
      toast.error("Vui lòng điền đủ Tên và Giá sản phẩm");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("Name", form.Name);
    formData.append("Type", form.Type);
    formData.append("Price", form.Price);
    formData.append("Stock", form.Stock);
    formData.append("Description", form.Description);
    formData.append("Status", form.Status);
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(formData);
        toast.success("Thêm mới sản phẩm thành công!");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => p.Name.toLowerCase().includes(search.toLowerCase()));

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
                <h2 className="text-2xl font-bold text-gray-800">📦 Quản lý Sản phẩm</h2>
                <div className="flex w-full sm:w-auto items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm tên sản phẩm..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => handleOpenModal()}
                    className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                  >
                    <Plus size={20} /> <span className="hidden sm:inline">Thêm Mới</span>
                  </button>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100/50 text-gray-600 text-sm uppercase tracking-wider border-b">
                        <th className="p-4 font-semibold w-16">ID</th>
                        <th className="p-4 font-semibold">Sản phẩm</th>
                        <th className="p-4 font-semibold">Phân Loại</th>
                        <th className="p-4 font-semibold text-right">Giá Phiên</th>
                        <th className="p-4 font-semibold text-center">Tồn Kho</th>
                        <th className="p-4 font-semibold text-center">Hiển Thị</th>
                        <th className="p-4 font-semibold text-center">Hành Động</th>
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
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-gray-500">
                            Chưa có sản phẩm nào
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.ProductID} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-mono text-gray-500">#{p.ProductID}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={p.ImageURL && !p.ImageURL.startsWith('http') ? `http://localhost:3000${p.ImageURL}` : p.ImageURL} 
                                  alt={p.Name} 
                                  className="w-12 h-12 object-cover rounded-md border"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'; }}
                                />
                                <div className="font-semibold text-gray-900 line-clamp-2">{p.Name}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full capitalize">
                                {p.Type === 'tea' ? 'Trà Đạo' : p.Type === 'herb' ? 'Thảo Dược' : p.Type}
                              </span>
                            </td>
                            <td className="p-4 text-right font-bold text-gray-800">
                              {Number(p.Price).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="p-4 text-center">
                              {p.Stock > 10 ? (
                                <span className="text-gray-700">{p.Stock}</span>
                              ) : p.Stock > 0 ? (
                                <span className="text-orange-600 font-bold">{p.Stock} (Sắp hết)</span>
                              ) : (
                                <span className="text-red-600 font-bold bg-red-100 px-2.5 py-1 rounded-full text-xs">Hết hàng</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 text-xs font-bold rounded ${p.Status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                {p.Status === 'active' ? 'Công khai' : 'Đã ẩn'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleOpenModal(p)}
                                  className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(p.ProductID)}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                                  title="Xóa"
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

      {/* PRODUCT MODAL OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Ảnh sản phẩm */}
                <div className="flex flex-col items-center gap-3">
                  <div 
                    className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon size={32} className="mx-auto mb-1" />
                        <span className="text-xs">Tải ảnh lên</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>

                {/* Các trường dữ liệu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Tên sản phẩm *</label>
                    <input 
                      type="text" required
                      value={form.Name} onChange={e => setForm({...form, Name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Phân loại</label>
                    <select 
                      value={form.Type} onChange={e => setForm({...form, Type: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="tea">Trà đạo</option>
                      <option value="herb">Thảo dược</option>
                      <option value="teaware">Trà cụ</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Giá bán (VNĐ) *</label>
                    <input 
                      type="number" required min="0"
                      value={form.Price} onChange={e => setForm({...form, Price: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Số lượng kho</label>
                    <input 
                      type="number" min="0"
                      value={form.Stock} onChange={e => setForm({...form, Stock: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Trạng thái hiển thị</label>
                  <select 
                    value={form.Status} onChange={e => setForm({...form, Status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="active">Công khai (Khách thấy)</option>
                    <option value="hidden">Ẩn (Bản nháp / Tạm ngưng)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Mô tả sản phẩm</label>
                  <textarea 
                    rows={4}
                    value={form.Description} onChange={e => setForm({...form, Description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 font-medium bg-white border rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button 
                type="submit"
                form="product-form"
                disabled={saving}
                className="px-5 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition"
              >
                {saving ? "Đang lưu..." : "Lưu Sản Phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};

export default ProductManagePage;
