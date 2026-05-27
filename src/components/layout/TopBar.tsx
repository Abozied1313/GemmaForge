import React from "react";
import { Globe, Bell, Sparkles } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { lang, setLang, isRTL } = useLang();

  return (
    <header
      className={cn("flex items-center justify-between px-6 py-4 border-b flex-shrink-0", isRTL && "flex-row-reverse")}
      style={{ background: "#0a0c12", borderColor: "#1a2030", minHeight: "65px" }}
    >
      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {subtitle && <p className="text-xs" style={{ color: "#8892a4" }}>{subtitle}</p>}
        </div>
      </div>

      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        {/* Gemma Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(108,58,255,0.15)", border: "1px solid rgba(108,58,255,0.3)", color: "#a99bff" }}>
          <Sparkles className="w-3 h-3" />
          <span>Powered by Gemma</span>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:text-white"
          )}
          style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold">
            {lang === "ar" ? "EN" : "عربي"}
          </span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
