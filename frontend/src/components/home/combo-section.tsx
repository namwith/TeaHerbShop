import { Zap, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart } from "../../hooks/useCart";

interface Combo {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  products: string[];
  image: string;
  discount: number;
}

interface ComboSectionProps {
  combos: Combo[];
}

export function ComboSection({ combos }: ComboSectionProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddComboToCart = (combo: Combo) => {
    addToCart({
      id: combo.id,
      name: combo.name,
      price: combo.price,
      image: combo.image,
    });
    navigate("/cart");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Combo Tiết Kiệm
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-orange-600 rounded-full"></div>
          <Zap size={24} className="text-orange-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative h-64 bg-gray-100 overflow-hidden">
              <img
                src={combo.image}
                alt={combo.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1">
                <Zap size={16} />
                {combo.discount}% OFF
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">{combo.name}</h3>

              {/* Products in Combo */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Bao gồm:</p>
                <ul className="space-y-1">
                  {combo.products.map((product, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2 border-t">
                <span className="text-2xl font-bold text-orange-600">
                  {Number(combo.price).toLocaleString('vi-VN')}đ
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {Number(combo.originalPrice).toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddComboToCart(combo)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 group"
              >
                <ShoppingCart size={18} />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

