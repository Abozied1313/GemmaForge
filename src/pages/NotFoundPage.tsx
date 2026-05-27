import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Compass } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const NotFoundPage: React.FC = () => {
  const { t, isRTL } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8"
      style={{ background: "#080a0f" }}>
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "rgba(108,58,255,0.1)", border: "1px solid rgba(108,58,255,0.2)" }}>
        <Compass className="w-12 h-12" style={{ color: "#6c3aff" }} />
      </div>
      <h1 className="text-6xl font-bold mb-4 gemma-gradient-text">404</h1>
      <h2 className="text-xl font-semibold text-white mb-3">{t("notFound")}</h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "#8892a4" }}>
        {isRTL ? "الصفحة التي تبحث عنها غير موجودة" : "The page you're looking for doesn't exist"}
      </p>
      <button
        onClick={() => navigate("/")}
        className={cn("gemma-button flex items-center gap-2", isRTL && "flex-row-reverse")}
      >
        <Home className="w-4 h-4" />
        {t("goHome")}
      </button>
    </div>
  );
};

export default NotFoundPage;
