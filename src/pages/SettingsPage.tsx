import React, { useState } from "react";
import {
  Globe, Palette, Cpu, Type, User, Shield, Info, Check, ChevronDown
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TopBar from "@/components/layout/TopBar";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { GEMMA_MODELS, DEFAULT_MODEL } from "@/constants/models";
import type { GemmaModel } from "@/types";
import { cn } from "@/lib/utils";

const SettingsPage: React.FC = () => {
  const { t, lang, setLang, isRTL } = useLang();
  const { user } = useAuth();
  const [defaultModel, setDefaultModel] = useState<GemmaModel>(DEFAULT_MODEL);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { icon: Globe, label: isRTL ? "اللغة والمنطقة" : "Language & Region" },
    { icon: Palette, label: isRTL ? "المظهر" : "Appearance" },
    { icon: Cpu, label: isRTL ? "النموذج الافتراضي" : "Default Model" },
    { icon: User, label: isRTL ? "الحساب" : "Account" },
    { icon: Info, label: isRTL ? "حول التطبيق" : "About" },
  ];

  return (
    <DashboardLayout>
      <TopBar title={t("settingsTitle")} />
      <div className="flex-1 overflow-y-auto scrollbar-dark p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Language */}
          <div className="rounded-2xl p-6" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <div className={cn("flex items-center gap-3 mb-5", isRTL && "flex-row-reverse")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(108,58,255,0.15)" }}>
                <Globe className="w-4 h-4" style={{ color: "#6c3aff" }} />
              </div>
              <h2 className="text-base font-semibold text-white">{t("language")}</h2>
            </div>
            <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
              {(["ar", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn("flex-1 flex items-center justify-between px-4 py-3 rounded-xl transition-all", isRTL && "flex-row-reverse")}
                  style={{
                    background: lang === l ? "rgba(108,58,255,0.15)" : "#131720",
                    border: `1px solid ${lang === l ? "rgba(108,58,255,0.5)" : "#1e2535"}`,
                  }}
                >
                  <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                    <span className="text-lg">{l === "ar" ? "🇸🇦" : "🇺🇸"}</span>
                    <div className={isRTL ? "text-right" : ""}>
                      <p className="text-sm font-medium text-white">{l === "ar" ? "العربية" : "English"}</p>
                      <p className="text-xs" style={{ color: "#8892a4" }}>{l === "ar" ? "RTL" : "LTR"}</p>
                    </div>
                  </div>
                  {lang === l && <Check className="w-4 h-4" style={{ color: "#6c3aff" }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl p-6" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <div className={cn("flex items-center gap-3 mb-5", isRTL && "flex-row-reverse")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(34,211,238,0.15)" }}>
                <Palette className="w-4 h-4" style={{ color: "#22d3ee" }} />
              </div>
              <h2 className="text-base font-semibold text-white">{t("appearance")}</h2>
            </div>
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "#131720" }}
            >
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <span className="text-xl">🌙</span>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-sm font-medium text-white">{t("darkMode")}</p>
                  <p className="text-xs" style={{ color: "#8892a4" }}>
                    {isRTL ? "النموذج الافتراضي لأدوات المطورين" : "Default developer tool theme"}
                  </p>
                </div>
              </div>
              <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer"
                style={{ background: "#6c3aff" }}>
                <div className="w-4 h-4 rounded-full bg-white ml-auto transition-all" />
              </div>
            </div>
          </div>

          {/* Default Model */}
          <div className="rounded-2xl p-6" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <div className={cn("flex items-center gap-3 mb-5", isRTL && "flex-row-reverse")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.15)" }}>
                <Cpu className="w-4 h-4" style={{ color: "#f59e0b" }} />
              </div>
              <h2 className="text-base font-semibold text-white">{t("defaultModel")}</h2>
            </div>
            <div className="relative">
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value as GemmaModel)}
                className={cn("w-full py-3 px-4 text-sm text-white rounded-xl appearance-none cursor-pointer outline-none", isRTL && "text-right")}
                style={{ background: "#131720", border: "1px solid #1e2535" }}
              >
                {GEMMA_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {lang === "ar" ? m.nameAr : m.nameEn} ({m.params})
                  </option>
                ))}
              </select>
              <ChevronDown className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none", isRTL ? "left-3" : "right-3")}
                style={{ color: "#8892a4" }} />
            </div>
          </div>

          {/* Account */}
          <div className="rounded-2xl p-6" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <div className={cn("flex items-center gap-3 mb-5", isRTL && "flex-row-reverse")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)" }}>
                <User className="w-4 h-4" style={{ color: "#10b981" }} />
              </div>
              <h2 className="text-base font-semibold text-white">{t("account")}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={cn("block text-xs font-medium mb-1.5", isRTL && "text-right")} style={{ color: "#8892a4" }}>
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn("w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none", isRTL && "text-right")}
                  style={{ background: "#131720", border: "1px solid #1e2535" }}
                />
              </div>
              <div>
                <label className={cn("block text-xs font-medium mb-1.5", isRTL && "text-right")} style={{ color: "#8892a4" }}>
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none cursor-not-allowed"
                  style={{ background: "#0a0c12", border: "1px solid #1e2535", color: "#8892a4", direction: "ltr" }}
                />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl p-6" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <div className={cn("flex items-center gap-3 mb-5", isRTL && "flex-row-reverse")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(108,58,255,0.15)" }}>
                <Info className="w-4 h-4" style={{ color: "#6c3aff" }} />
              </div>
              <h2 className="text-base font-semibold text-white">
                {isRTL ? "حول التطبيق" : "About"}
              </h2>
            </div>
            <div className="space-y-2 text-sm" style={{ color: "#8892a4" }}>
              <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                <span>{isRTL ? "الإصدار" : "Version"}</span>
                <span className="text-white font-mono">1.0.0-beta</span>
              </div>
              <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                <span>{isRTL ? "النماذج المدعومة" : "Supported Models"}</span>
                <span className="text-white">{GEMMA_MODELS.length} models</span>
              </div>
              <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                <span>{isRTL ? "المشروع" : "Project"}</span>
                <span className="text-white">Google Gemma Challenge</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "#131720", color: "#8892a4" }}>
              {t("apiNote")}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={cn("w-full gemma-button py-3 flex items-center justify-center gap-2", isRTL && "flex-row-reverse")}
          >
            {saved ? <><Check className="w-4 h-4" /> {t("changesSaved")}</> : t("save")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
