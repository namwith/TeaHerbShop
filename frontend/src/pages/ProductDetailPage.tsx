import { useParams, useNavigate } from "react-router";
import { HomeHeader } from "@/components/home/home-header";
import { HomeFooter } from "@/components/home/home-footer";
import { Star, ShoppingCart, Heart, ChevronLeft, Minus, Plus, MessageSquare, Filter, UserRound } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { getProductById, getProducts } from "@/services/productService";
import type { Product, Review } from "@/models/productModels";

const getImageUrl = (url?: string) => {
  if (!url) return "https://images.unsplash.com/photo-1597318972195-db2f60637bfe?w=800";
  if (url.startsWith("http")) return url;
  return `http://localhost:3000${url.startsWith("/") ? "" : "/"}${url}`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State cho Comments
  const [reviewFilter, setReviewFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getProductById(id);
        const fetchedProduct = res.data?.data;
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          const allRes = await getProducts();
          const allData = allRes.data?.data || [];
          const related = allData.filter(
            (p: Product) => p.Type === fetchedProduct.Type && p.ProductID !== fetchedProduct.ProductID
          ).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const filteredReviews = useMemo(() => {
    if (!product?.reviews) return [];
    if (reviewFilter === "all") return product.reviews;
    if (reviewFilter === "text") return product.reviews.filter(r => r.Comment && r.Comment.trim() !== "");
    // Lọc theo rating number
    const targetRating = parseInt(reviewFilter);
    return product.reviews.filter(r => Math.floor(r.Rating) === targetRating);
  }, [product?.reviews, reviewFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <HomeHeader />
        <div className="flex-1 flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <HomeHeader />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tìm thấy</h2>
          <button onClick={() => navigate("/")} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Quay lại Trang Chủ
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ id: product.ProductID, name: product.Name, price: Number(product.Price), image: getImageUrl(product.ImageURL) });
    setQuantity(1);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
        addToCart({ id: product.ProductID, name: product.Name, price: Number(product.Price), image: getImageUrl(product.ImageURL) });
    }
    navigate("/checkout");
  };

  const currentRating = product.rating !== undefined ? product.rating : 5;
  const currentReviewCount = product.reviewCount || 0;

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition">
          <ChevronLeft size={20} /> Quay lại
        </button>
      </div>

      {/* THÔNG TIN SẢN PHẨM CHÍNH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 md:h-full min-h-96 border relative">
              <img src={getImageUrl(product.ImageURL)} alt={product.Name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">{product.Type}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 leading-tight">{product.Name}</h1>
            </div>

            {/* Rating Stars DYNAMIC */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className={i < Math.floor(currentRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-300"} />
                ))}
              </div>
              <span className="text-lg font-bold text-gray-900">{currentRating}</span>
              <span className="text-gray-500 underline text-sm cursor-pointer" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                ({currentReviewCount} đánh giá)
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-4xl font-extrabold text-green-600">{Number(product.Price).toLocaleString('vi-VN')}₫</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3 border">
              <h3 className="font-bold text-gray-900">Mô tả sản phẩm</h3>
              <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{product.Description || "... Đang cập nhật ..."}</div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Số lượng</p>
              <div className="flex items-center gap-4 w-fit bg-gray-100 p-1.5 rounded-lg border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-white hover:bg-gray-50 rounded shadow-sm transition">
                  <Minus size={18} />
                </button>
                <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-white hover:bg-gray-50 rounded shadow-sm transition">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={handleBuyNow} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> Mua Ngay
              </button>
              <button onClick={handleAddToCart} className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> Thêm Vào Giỏ
              </button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="py-4 px-6 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition flex items-center justify-center">
                <Heart size={24} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
            
            <div className="bg-blue-50/50 p-4 rounded-lg flex gap-3 text-sm text-blue-800 border border-blue-100">
               <div>ℹ️</div>
               <div>Giao hàng bằng Đơn vị Vận chuyển đối tác hỏa tốc. Miễn phí phí Ship cho mọi hóa đơn trên 200.000₫.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT REVIEWS SECTION */}
      <section id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50/50 border-t border-b">
         <div className="flex flex-col md:flex-row gap-10">
            {/* Cột Tổng quan Điểm đánh giá */}
            <div className="md:w-1/3 flex flex-col items-center justify-center p-8 bg-white border rounded-2xl shadow-sm h-fit">
               <h3 className="text-xl font-bold text-gray-900 mb-2">Đánh Giá Sản Phẩm</h3>
               <div className="text-6xl font-black text-green-600 my-4">{currentRating}<span className="text-3xl text-gray-400 font-medium">/5</span></div>
               <div className="flex gap-1 mb-2">
                 {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={28} className={i < Math.floor(currentRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-300"} />
                 ))}
               </div>
               <div className="text-gray-500">{currentReviewCount} lượt xếp hạng</div>
            </div>

            {/* Cột Bộ Lọc và Danh Sách Comment */}
            <div className="md:w-2/3 flex flex-col gap-6">
               <div className="bg-white p-4 border rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="font-semibold text-gray-700 flex items-center gap-2">
                     <Filter size={18} /> Lọc bình luận:
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {[
                       { value: "all", label: "Tất Cả" },
                       { value: "5", label: "5 Sao" },
                       { value: "4", label: "4 Sao" },
                       { value: "3", label: "3 Sao" },
                       { value: "2", label: "2 Sao" },
                       { value: "1", label: "1 Sao" },
                       { value: "text", label: "Có bình luận" }
                     ].map(f => (
                       <button
                         key={f.value}
                         onClick={() => setReviewFilter(f.value)}
                         className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                            reviewFilter === f.value 
                            ? 'bg-green-600 text-white border-green-600' 
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                         }`}
                       >
                         {f.label}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                 {filteredReviews.length === 0 ? (
                    <div className="text-center py-12 bg-white border rounded-xl text-gray-400 flex flex-col items-center justify-center gap-3">
                       <MessageSquare size={40} className="text-gray-300" />
                       <p>Chưa có đánh giá nào phù hợp với bộ lọc quy đinh.</p>
                    </div>
                 ) : (
                    filteredReviews.map((review: Review) => (
                       <div key={review.ReviewID} className="bg-white p-6 border rounded-xl shadow-sm">
                          <div className="flex items-start gap-4">
                             <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                                <UserRound size={24} className="opacity-50" />
                             </div>
                             <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                                   <div className="font-bold text-gray-900">
                                      {review.FullName || review.Username || "Khách hàng ẩn danh"}
                                   </div>
                                   <div className="text-xs text-gray-400 font-medium">
                                      {new Date(review.CreatedAt).toLocaleDateString("vi-VN", {
                                         year: 'numeric', month: 'long', day: 'numeric',
                                         hour: '2-digit', minute: '2-digit'
                                      })}
                                   </div>
                                </div>
                                <div className="flex gap-0.5 mb-3">
                                   {Array.from({ length: 5 }).map((_, i) => (
                                     <Star key={i} size={14} className={i < review.Rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-300"} />
                                   ))}
                                </div>
                                {review.Comment && (
                                   <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed text-sm">
                                      {review.Comment}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                    ))
                 )}
               </div>
            </div>
         </div>
      </section>

      {/* SẢN PHẨM LIÊN QUAN */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 border-l-4 border-green-600 pl-4">
            Sản Phẩm Cùng Loại
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.ProductID}
                onClick={() => navigate(`/product/${relProduct.ProductID}`)}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  <img src={getImageUrl(relProduct.ImageURL)} alt={relProduct.Name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-green-600 transition">{relProduct.Name}</h4>
                  <p className="text-green-600 font-black text-lg">{Number(relProduct.Price).toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <HomeFooter />
    </div>
  );
};

export default ProductDetailPage;
