import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useCart } from "../../hooks/useCart";
import type { Product } from "@/models/productModels";

interface ProductSectionProps {
  products: Product[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ProductSection({ products, currentPage, totalPages, onPageChange }: ProductSectionProps) {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t("home.featured_products")}
        </h2>
        <div className="w-16 h-1 bg-green-600 rounded-full"></div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {t("home.no_products_found")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.ProductID}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
              >
                {/* Image Section */}
                <div
                  onClick={() => navigate(`/product/${product.ProductID}`)}
                  className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.ImageURL && !product.ImageURL.startsWith('http') ? `http://localhost:3000${product.ImageURL}` : product.ImageURL}
                    alt={product.Name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image'; }}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.ProductID);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                  >
                    <Heart
                      size={20}
                      className={
                        favorites.includes(product.ProductID)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => navigate(`/product/${product.ProductID}`)}
                    className="font-semibold text-gray-900 line-clamp-2 hover:text-green-600 transition text-left w-full h-12"
                  >
                    {product.Name}
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < (product.rating || 5)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {Number(product.Price).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        id: product.ProductID,
                        name: product.Name,
                        price: Number(product.Price),
                        image: product.ImageURL,
                      });
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    {t("home.add_to_cart")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages && totalPages > 1 && currentPage && onPageChange && (
            <div className="flex items-center justify-center gap-2 mt-12 bg-gray-50/50 py-4 rounded-xl border">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title={t("common.prev", "Trang trước")}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1 px-4">
                 {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageIndex = idx + 1;
                    return (
                      <button
                        key={pageIndex}
                        onClick={() => onPageChange(pageIndex)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition
                           ${currentPage === pageIndex 
                             ? 'bg-green-600 text-white shadow-md' 
                             : 'hover:bg-gray-200 text-gray-700 bg-white border'}
                        `}
                      >
                         {pageIndex}
                      </button>
                    )
                 })}
              </div>

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title={t("common.next", "Trang sau")}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

