import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HomeHeader } from "@/components/home/home-header";
import { HomeBanner } from "@/components/home/home-banner";
import { ProductFilter } from "@/components/home/product-filter";
import { ProductSection } from "@/components/home/product-section";

import { HomeFooter } from "../components/home/home-footer";
import { getProducts } from "@/services/productService";
import type { Product } from "@/models/productModels";

const HomePage = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const rawData = res.data?.data;

        if (Array.isArray(rawData)) {
          // Bọc code lấy sản phẩm chỉ lấy sản phẩm có Status === 'active' nếu có
          const activeProducts = rawData.filter((p: Product) => p.Status !== 'hidden');
          setProducts(activeProducts);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xóa về trang 1 nếu người dùng thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery]);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" ||
      product.Type?.toLocaleLowerCase() ===
        selectedCategory.toLocaleLowerCase();

    const currentPrice = Number(product.Price || 0);
    const matchPrice =
      currentPrice >= priceRange[0] && currentPrice <= priceRange[1];
    const name = (product.Name || "").toLowerCase();
    const type = (product.Type || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchSearch = name.includes(query) || type.includes(query);

    return matchCategory && matchPrice && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <HomeBanner />

      <ProductFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">{t("home.loading_products", "Đang tải sản phẩm...")}</p>
          </div>
        </div>
      ) : (
        <ProductSection 
          products={paginatedProducts} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <HomeFooter />
    </div>
  );
};

export default HomePage;
