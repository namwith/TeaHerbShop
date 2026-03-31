import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function HomeBanner() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 md:py-24 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {t("home.hero_title")}
            </h1>
            <p className="text-lg text-gray-600">
              {t("home.hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/product/1")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2"
              >
                {t("home.shop_now")}
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                {t("home.view_more")}
              </button>
            </div>
          </div>
          <div className="relative h-96 md:h-96">
            <img
              src="/src/assets/TeaBanner.jpg"
              alt="Tea Banner"
              className="w-full h-full object-cover rounded-3xl shadow-lg hover:scale-105 transition duration-300"
            />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/10 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/10 rounded-full -ml-40 -mb-40"></div>
    </div>
  );
}
