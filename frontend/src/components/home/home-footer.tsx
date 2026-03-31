import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HomeFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍵</span>
              </div>
              <span className="text-xl font-bold">TeaHerbShop</span>
            </div>
            <p className="text-gray-400 text-sm">
              {t("footer.brand_description")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-green-600 transition"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-green-600 transition"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-green-600 transition"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">{t("footer.quick_links")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  {t("common.home")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  {t("common.products")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  Combo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">{t("footer.information")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Đường Trà, Quận 1, TP. HCM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-600 flex-shrink-0" />
                <a
                  href="tel:0123456789"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  (028) 3345 6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-600 flex-shrink-0" />
                <a
                  href="mailto:hello@teashop.com"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  hello@teashop.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">{t("footer.newsletter")}</h4>
            <p className="text-gray-400 text-sm">
              {t("footer.newsletter_description")}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder={t("common.email_placeholder", "Email của bạn")}
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition">
                {t("footer.subscribe")}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p>
              &copy; {currentYear} TeaHerbShop. {t("footer.all_rights_reserved")} {t("footer.designed_by")} TeaHerbShop Team
            </p>
          </div>
          <div className="md:text-right space-x-4">
            <a href="#" className="hover:text-green-600 transition">
              Điều Khoản Sử Dụng
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Chính Sách Bảo Mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
