import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={i18n.language === "vi" ? "default" : "outline"}
        size="sm"
        onClick={() => toggleLanguage("vi")}
        className="px-2 py-1 h-auto text-xs"
      >
        🇻🇳 VI
      </Button>
      <Button
        variant={i18n.language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => toggleLanguage("en")}
        className="px-2 py-1 h-auto text-xs"
      >
        🇺🇸 EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
