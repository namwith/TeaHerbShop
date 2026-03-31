import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";

export function HomeHeader() {
  const { t } = useTranslation();
  const { logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍵</span>
            </div>
            <span className="text-xl font-bold text-gray-800">TeaHerbShop</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              {t("common.home")}
            </button>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              {t("common.products")}
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Combo
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              {t("common.contact")}
            </a>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Search size={20} className="text-gray-700" />
            </button>
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <User size={20} className="text-gray-700" />
              </button>
              {/* User Menu Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate("/account")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      {t("common.account")}
                    </button>
                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      {t("common.orders")}
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        window.location.reload();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      {t("common.logout")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    {t("common.login")}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition relative group"
            >
              <ShoppingCart size={20} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold group-hover:bg-red-600 transition">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t">
            <button
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
              className="block py-2 text-gray-700 hover:text-green-600"
            >
              {t("common.home")}
            </button>
            <a
              href="#"
              className="block py-2 text-gray-700 hover:text-green-600"
            >
              {t("common.products")}
            </a>
            <a
              href="#"
              className="block py-2 text-gray-700 hover:text-green-600"
            >
              Combo
            </a>
            <a
              href="#"
              className="block py-2 text-gray-700 hover:text-green-600"
            >
              {t("common.contact")}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
