import { Search, Sliders } from "lucide-react";

interface ProductFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const categories = [
  { id: "all", label: "Tất Cả" },
  { id: "oolong", label: "Trà Oolong" },
  { id: "green", label: "Trà Xanh" },
  { id: "black", label: "Trà Đen" },
  { id: "flower", label: "Trà Hoa" },
];

export function ProductFilter({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  searchQuery,
  setSearchQuery,
}: ProductFilterProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
          />
        </div>

        {/* Category & Price Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Sliders size={16} />
              Loại Trà
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-green-600"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Giá: {priceRange[0].toLocaleString('vi-VN')} - {Number(priceRange[1]).toLocaleString('vi-VN')}đ
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Math.min(parseInt(e.target.value), priceRange[1]),
                    priceRange[1],
                  ])
                }
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="500000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Math.max(parseInt(e.target.value), priceRange[0]),
                  ])
                }
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

