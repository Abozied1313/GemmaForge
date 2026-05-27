import React from "react";
import { Check, Cpu } from "lucide-react";
import type { GemmaModel } from "@/types";
import { GEMMA_MODELS } from "@/constants/models";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  selected: GemmaModel;
  onChange: (model: GemmaModel) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selected, onChange }) => {
  const { t, isRTL, lang } = useLang();

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
        <Cpu className="w-4 h-4" style={{ color: "#6c3aff" }} />
        <span className="text-sm font-medium text-white">{t("selectModel")}</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {GEMMA_MODELS.map((model) => (
          <div
            key={model.id}
            className={cn("model-card", selected === model.id && "selected")}
            onClick={() => onChange(model.id)}
          >
            <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                <div className={cn("flex items-center gap-2 mb-1", isRTL && "flex-row-reverse")}>
                  <span className="text-sm font-semibold text-white">
                    {lang === "ar" ? model.nameAr : model.nameEn}
                  </span>
                  {model.badge && (
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-full text-white font-medium", model.badgeColor)}>
                      {model.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "#8892a4" }}>
                  {lang === "ar" ? model.descAr : model.descEn}
                </p>
                <div className={cn("flex items-center gap-3 mt-1.5", isRTL && "flex-row-reverse")}>
                  <span className="text-xs font-mono" style={{ color: "#22d3ee" }}>{model.params}</span>
                  <span className="text-xs" style={{ color: "#8892a4" }}>
                    {(model.contextWindow / 1000).toFixed(0)}K ctx
                  </span>
                </div>
              </div>
              {selected === model.id && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "#6c3aff" }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
