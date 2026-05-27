import React from "react";
import { Variable } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PromptVariablesProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (vars: Record<string, string>) => void;
}

const PromptVariables: React.FC<PromptVariablesProps> = ({ variables, values, onChange }) => {
  const { t, isRTL } = useLang();

  if (variables.length === 0) {
    return (
      <div className="rounded-lg p-4 text-center" style={{ background: "#131720", border: "1px solid #1e2535" }}>
        <p className="text-xs" style={{ color: "#8892a4" }}>{t("noVars")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <Variable className="w-4 h-4" style={{ color: "#22d3ee" }} />
        <span className="text-sm font-medium text-white">{t("variableValues")}</span>
        <span className="token-badge">{variables.length}</span>
      </div>
      <div className="space-y-2">
        {variables.map((varName) => (
          <div key={varName} className="space-y-1">
            <label className={cn("flex items-center gap-1.5 text-xs font-medium", isRTL && "flex-row-reverse justify-end")}
              style={{ color: "#22d3ee" }}>
              <span className="font-mono">{`{{${varName}}}`}</span>
            </label>
            <input
              type="text"
              value={values[varName] || ""}
              onChange={(e) => onChange({ ...values, [varName]: e.target.value })}
              placeholder={`قيمة ${varName}...`}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all",
                "focus:ring-1",
                isRTL && "text-right"
              )}
              style={{
                background: "#0a0c12",
                border: "1px solid #1e2535",
                fontFamily: "JetBrains Mono, monospace",
                "--tw-ring-color": "rgba(108,58,255,0.5)",
              } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptVariables;
