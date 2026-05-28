import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Play, Copy, Trash2, Clock, Zap, Hash, ChevronDown,
  CheckCheck, Loader2, BarChart3, History, GitCompare, AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TopBar from "@/components/layout/TopBar";
import PromptVariables from "@/components/features/PromptVariables";
import { usePrompts, useTestRuns, extractVariables, interpolatePrompt } from "@/hooks/useData";
import { useGemma, type RunResult } from "@/hooks/useGemma";
import { GEMMA_MODELS, DEFAULT_MODEL } from "@/constants/models";
import { useLang } from "@/contexts/LanguageContext";
import type { GemmaModel, Prompt } from "@/types";
import { cn } from "@/lib/utils";

/* ──────────────────── types ──────────────────── */
type PanelStatus = "idle" | "running" | "done" | "error";
interface PanelState {
  model: GemmaModel;
  status: PanelStatus;
  result: RunResult | null;
  copied: boolean;
}

/* ──────────────────── StatsBar ──────────────────── */
function StatsBar({ result, lang, isRTL, modelName }: {
  result: RunResult; lang: string; isRTL: boolean; modelName?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-4 px-4 py-2 border-b flex-shrink-0 flex-wrap text-xs", isRTL && "flex-row-reverse")}
      style={{ borderColor: "#1e2535", background: "#0a0c12" }}
    >
      <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
        <Clock className="w-3.5 h-3.5" style={{ color: "#6c3aff" }} />
        <span className="font-mono text-white">{result.executionTime}ms</span>
      </span>
      <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
        <Hash className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
        <span style={{ color: "#8892a4" }}>in:</span>
        <span className="font-mono text-white">{result.inputTokens}</span>
      </span>
      <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
        <BarChart3 className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
        <span style={{ color: "#8892a4" }}>out:</span>
        <span className="font-mono text-white">{result.outputTokens}</span>
      </span>
      <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
        <Zap className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
        <span className="font-mono font-bold text-white">{result.totalTokens}</span>
        <span style={{ color: "#8892a4" }}>total</span>
      </span>
      {modelName && (
        <span className={cn("ml-auto font-medium", isRTL && "mr-auto ml-0")} style={{ color: "#a99bff" }}>
          {modelName}
        </span>
      )}
    </div>
  );
}

/* ──────────────────── OutputPanel ──────────────────── */
function OutputPanel({ panel, onClear, onCopy, side, lang, isRTL }: {
  panel: PanelState; onClear: () => void; onCopy: () => void;
  side: "A" | "B"; lang: string; isRTL: boolean;
}) {
  const modelInfo = GEMMA_MODELS.find((m) => m.id === panel.model);
  const modelName = lang === "ar" ? modelInfo?.nameAr : modelInfo?.nameEn;
  const accent = side === "A" ? "#6c3aff" : "#22d3ee";
  const accentBg = side === "A" ? "rgba(108,58,255,0.25)" : "rgba(34,211,238,0.2)";
  const accentBorder = side === "A" ? "rgba(108,58,255,0.4)" : "rgba(34,211,238,0.4)";
  const accentText = side === "A" ? "#a99bff" : "#22d3ee";

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#080a0f", minWidth: 0 }}>
      {/* Header */}
      <div
        className={cn("flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0", isRTL && "flex-row-reverse")}
        style={{ borderColor: "#1e2535", background: "#0a0c12" }}
      >
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: accentBg, color: accentText, border: `1px solid ${accentBorder}` }}
          >{side}</span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8892a4" }}>
            {isRTL ? "النتيجة" : "Output"}
          </span>
          {panel.status === "done" && !panel.result?.error && <CheckCheck className="w-3.5 h-3.5 text-green-400" />}
          {panel.status === "running" && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: accent }} />}
          {panel.status === "error" && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
        </div>
        <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
          {panel.result?.output && (
            <>
              <button onClick={onCopy} className="p-1.5 rounded-lg transition-colors"
                style={{ color: panel.copied ? "#4ade80" : "#8892a4" }}>
                {panel.copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button onClick={onClear} className="p-1.5 rounded-lg transition-colors hover:text-red-400"
                style={{ color: "#8892a4" }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      {panel.status === "done" && panel.result && !panel.result.error && (
        <StatsBar result={panel.result} lang={lang} isRTL={isRTL} modelName={modelName} />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-dark p-4">
        {panel.status === "idle" && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${accent}18`, border: `1px solid ${accentBorder}` }}>
              <Zap className="w-5 h-5" style={{ color: accent }} />
            </div>
            <p className="text-xs" style={{ color: "#8892a4" }}>
              {isRTL ? "اختر نموذجاً وشغّل البرومبت" : "Select a model and run the prompt"}
            </p>
          </div>
        )}

        {panel.status === "running" && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${accent}18`, border: `1px solid ${accentBorder}` }}>
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
            </div>
            <p className="text-sm font-medium text-white mb-1">{modelName}</p>
            <p className="text-xs" style={{ color: "#8892a4" }}>
              {isRTL ? "جارٍ المعالجة..." : "Processing..."}
            </p>
            <div className="mt-4 w-40 h-0.5 rounded-full overflow-hidden" style={{ background: "#1e2535" }}>
              <div
                className="h-full rounded-full shimmer-loading"
                style={{
                  background: side === "A"
                    ? "linear-gradient(90deg,#6c3aff,#a99bff,#6c3aff)"
                    : "linear-gradient(90deg,#22d3ee,#67e8f9,#22d3ee)",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        )}

        {panel.status === "error" && panel.result?.error && (
          <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm font-medium text-red-400">
                {isRTL ? "خطأ في التنفيذ" : "Execution Error"}
              </span>
            </div>
            <pre className="text-xs text-red-300 whitespace-pre-wrap break-all leading-relaxed">
              {panel.result.error}
            </pre>
          </div>
        )}

        {panel.status === "done" && panel.result?.output && (
          <div className="animate-fade-in">
            <pre
              className={cn("text-sm leading-relaxed whitespace-pre-wrap break-words", isRTL && "text-right")}
              style={{ color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace" }}
            >
              {panel.result.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────── MiniModelSelector ──────────────────── */
function MiniModelSelector({ value, onChange, accentColor, isRTL }: {
  value: GemmaModel; onChange: (m: GemmaModel) => void;
  accentColor: string; isRTL: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = GEMMA_MODELS.find((m) => m.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all", isRTL && "flex-row-reverse")}
        style={{
          background: open ? `${accentColor}18` : "#131720",
          border: `1px solid ${open ? accentColor + "60" : "#1e2535"}`,
          color: "#fff",
        }}
      >
        <span className="max-w-[140px] truncate">{selected?.nameEn ?? value}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform flex-shrink-0", open && "rotate-180")}
          style={{ color: "#8892a4" }} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-64 rounded-xl overflow-hidden shadow-2xl"
          style={{ background: "#0e1117", border: "1px solid #1e2535", [isRTL ? "right" : "left"]: 0 }}
        >
          <div className="p-1.5 space-y-0.5 max-h-72 overflow-y-auto scrollbar-dark">
            {GEMMA_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setOpen(false); }}
                className={cn("w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all", isRTL && "flex-row-reverse text-right")}
                style={{
                  background: value === m.id ? `${accentColor}18` : "transparent",
                  border: `1px solid ${value === m.id ? accentColor + "50" : "transparent"}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className={cn("flex items-center gap-1.5 mb-0.5", isRTL && "flex-row-reverse")}>
                    <span className="text-xs font-semibold text-white">{m.nameEn}</span>
                    {m.badge && (
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full text-white", m.badgeColor)}>
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: accentColor }}>{m.params}</span>
                </div>
                {value === m.id && (
                  <CheckCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────── Main Page ──────────────────── */
const TestRunnerPage: React.FC = () => {
  const { t, isRTL, lang } = useLang();
  const [searchParams] = useSearchParams();
  const initPromptId = searchParams.get("promptId");

  const { prompts } = usePrompts();
  const { runs, saveRun } = useTestRuns();
  const { runAB, isRunning } = useGemma();

  const [inputMode, setInputMode] = useState<"direct" | "library">("direct");
  const [directInput, setDirectInput] = useState("");
  const [selectedPromptId, setSelectedPromptId] = useState(initPromptId || "");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);

  const [panelA, setPanelA] = useState<PanelState>({
    model: DEFAULT_MODEL as GemmaModel,
    status: "idle",
    result: null,
    copied: false,
  });
  const [panelB, setPanelB] = useState<PanelState>({
    model: "gemma-2-9b" as GemmaModel,
    status: "idle",
    result: null,
    copied: false,
  });

  const selectedPrompt: Prompt | undefined = prompts.find((p) => p.id === selectedPromptId);
  const activeContent =
    inputMode === "library" && selectedPrompt ? selectedPrompt.content : directInput;
  const variables = extractVariables(activeContent);
  const finalPrompt = interpolatePrompt(activeContent, variableValues);

  useEffect(() => {
    if (initPromptId) { setInputMode("library"); setSelectedPromptId(initPromptId); }
  }, [initPromptId]);

  useEffect(() => { setVariableValues({}); }, [activeContent]);

  const handleRun = async () => {
    if (!finalPrompt.trim()) return;

    setPanelA((p) => ({ ...p, status: "running", result: null }));
    setPanelB((p) => ({ ...p, status: "running", result: null }));

    let resultA: RunResult | null = null;
    let resultB: RunResult | null = null;

    await runAB(
      finalPrompt,
      panelA.model,
      panelB.model,
      (r) => {
        resultA = r;
        setPanelA((p) => ({ ...p, status: r.error ? "error" : "done", result: r }));
      },
      (r) => {
        resultB = r;
        setPanelB((p) => ({ ...p, status: r.error ? "error" : "done", result: r }));
      }
    );

    // Save the A/B run to Supabase
    if (resultA || resultB) {
      const rA = resultA as RunResult | null;
      const rB = resultB as RunResult | null;
      await saveRun({
        promptId: selectedPromptId || "direct",
        promptText: finalPrompt,
        modelA: panelA.model,
        modelB: panelB.model,
        outputA: rA?.output ?? "",
        outputB: rB?.output ?? "",
        tokensA: rA?.totalTokens ?? 0,
        tokensB: rB?.totalTokens ?? 0,
        timeA: rA?.executionTime ?? 0,
        timeB: rB?.executionTime ?? 0,
      });
    }
  };

  const copyPanel = (which: "A" | "B") => {
    const text = which === "A" ? panelA.result?.output : panelB.result?.output;
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (which === "A") {
      setPanelA((p) => ({ ...p, copied: true }));
      setTimeout(() => setPanelA((p) => ({ ...p, copied: false })), 2000);
    } else {
      setPanelB((p) => ({ ...p, copied: true }));
      setTimeout(() => setPanelB((p) => ({ ...p, copied: false })), 2000);
    }
  };

  const clearPanel = (which: "A" | "B") => {
    if (which === "A") setPanelA((p) => ({ ...p, status: "idle", result: null }));
    else setPanelB((p) => ({ ...p, status: "idle", result: null }));
  };

  return (
    <DashboardLayout>
      <TopBar title={t("testRunnerTitle")} subtitle={t("testRunnerDesc")} />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div
          className={cn("flex items-center gap-3 px-5 py-3 border-b flex-shrink-0 flex-wrap", isRTL && "flex-row-reverse")}
          style={{ background: "#0e1117", borderColor: "#1e2535" }}
        >
          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden text-xs" style={{ border: "1px solid #1e2535" }}>
            {(["direct", "library"] as const).map((m) => (
              <button key={m} onClick={() => setInputMode(m)}
                className="px-3 py-2 font-medium transition-colors"
                style={{ background: inputMode === m ? "#6c3aff" : "#131720", color: inputMode === m ? "#fff" : "#8892a4" }}>
                {m === "direct" ? t("directInput") : t("fromPromptLibrary")}
              </button>
            ))}
          </div>

          {/* Prompt selector */}
          {inputMode === "library" && (
            <div className="relative max-w-xs flex-1">
              <select
                value={selectedPromptId}
                onChange={(e) => setSelectedPromptId(e.target.value)}
                className="w-full py-2 px-3 text-sm text-white rounded-lg appearance-none cursor-pointer outline-none"
                style={{ background: "#131720", border: "1px solid #1e2535" }}
              >
                <option value="">{t("selectPrompt")}</option>
                {prompts.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <ChevronDown
                className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none", isRTL ? "left-2" : "right-2")}
                style={{ color: "#8892a4" }} />
            </div>
          )}

          {/* A/B badge */}
          <div className={cn("flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg", isRTL && "flex-row-reverse")}
            style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}>
            <GitCompare className="w-3.5 h-3.5" style={{ color: "#6c3aff" }} />
            <span>{isRTL ? "وضع مقارنة A/B" : "A/B Comparison"}</span>
          </div>

          <div className={cn("flex items-center gap-2 ml-auto", isRTL && "mr-auto ml-0 flex-row-reverse")}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg transition-colors"
              title={isRTL ? "السجل" : "History"}
              style={{ background: showHistory ? "rgba(108,58,255,0.1)" : "#131720", color: showHistory ? "#a99bff" : "#8892a4", border: "1px solid #1e2535" }}
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={cn("flex flex-1 overflow-hidden", isRTL && "flex-row-reverse")}>

          {/* LEFT: Prompt Input */}
          <div
            className="w-80 flex-shrink-0 flex flex-col overflow-hidden border-r"
            style={{ background: "#080a0f", borderColor: "#1e2535" }}
          >
            {/* Input header */}
            <div
              className={cn("flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0", isRTL && "flex-row-reverse")}
              style={{ borderColor: "#1e2535", background: "#0a0c12" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8892a4" }}>
                {t("promptInput")}
              </span>
              <span className="text-xs font-mono" style={{ color: "#8892a4" }}>
                {activeContent.length}c{variables.length > 0 && ` · ${variables.length}v`}
              </span>
            </div>

            {/* Textarea */}
            <div className="flex-1 overflow-y-auto scrollbar-dark p-3 space-y-3">
              {inputMode === "direct" ? (
                <textarea
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  placeholder={t("promptContentPlaceholder")}
                  className={cn(
                    "code-editor w-full rounded-xl p-3.5 resize-none outline-none leading-relaxed min-h-[220px] text-sm",
                    "focus:ring-1 focus:ring-purple-500/50",
                    isRTL && "text-right"
                  )}
                  spellCheck={false}
                />
              ) : (
                <div
                  className="code-editor rounded-xl p-3.5 min-h-[220px] text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: selectedPrompt ? "#e2e8f0" : "#4a5568" }}
                >
                  {selectedPrompt?.content || (isRTL ? "اختر برومبتاً..." : "Select a prompt...")}
                </div>
              )}

              {variables.length > 0 && (
                <PromptVariables variables={variables} values={variableValues} onChange={setVariableValues} />
              )}

              {variables.length > 0 && Object.values(variableValues).some(Boolean) && (
                <div className="rounded-xl p-3.5" style={{ background: "#0e1117", border: "1px solid rgba(108,58,255,0.2)" }}>
                  <p className="text-xs font-medium mb-2" style={{ color: "#a99bff" }}>
                    {isRTL ? "معاينة نهائية" : "Final Preview"}
                  </p>
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: "#e2e8f0" }}>
                    {finalPrompt}
                  </pre>
                </div>
              )}
            </div>

            {/* Model Selectors */}
            <div className="px-3 py-3 border-t space-y-2 flex-shrink-0"
              style={{ borderColor: "#1e2535", background: "#0a0c12" }}>
              <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(108,58,255,0.25)", color: "#a99bff", border: "1px solid rgba(108,58,255,0.4)" }}>
                  A
                </span>
                <MiniModelSelector
                  value={panelA.model}
                  onChange={(m) => setPanelA((p) => ({ ...p, model: m }))}
                  accentColor="#6c3aff"
                  isRTL={isRTL}
                />
              </div>
              <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(34,211,238,0.2)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.4)" }}>
                  B
                </span>
                <MiniModelSelector
                  value={panelB.model}
                  onChange={(m) => setPanelB((p) => ({ ...p, model: m }))}
                  accentColor="#22d3ee"
                  isRTL={isRTL}
                />
              </div>
            </div>

            {/* Run Button */}
            <div className="px-3 py-3 border-t flex-shrink-0"
              style={{ borderColor: "#1e2535", background: "#0a0c12" }}>
              <button
                onClick={handleRun}
                disabled={isRunning || !finalPrompt.trim()}
                className={cn(
                  "w-full gemma-button flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                  isRTL && "flex-row-reverse"
                )}
              >
                {isRunning
                  ? <><Loader2 className="w-4 h-4 animate-spin" />{t("running")}</>
                  : <><Play className="w-4 h-4" />{t("runPrompt")}</>
                }
              </button>
            </div>
          </div>

          {/* RIGHT: A/B Output panels */}
          <div className="flex-1 flex overflow-hidden">
            <OutputPanel panel={panelA} onCopy={() => copyPanel("A")} onClear={() => clearPanel("A")} side="A" lang={lang} isRTL={isRTL} />
            <div className="w-px flex-shrink-0" style={{ background: "#1e2535" }} />
            <OutputPanel panel={panelB} onCopy={() => copyPanel("B")} onClear={() => clearPanel("B")} side="B" lang={lang} isRTL={isRTL} />
          </div>

          {/* History Sidebar */}
          {showHistory && (
            <div className="w-64 flex-shrink-0 overflow-y-auto scrollbar-dark border-l"
              style={{ background: "#0e1117", borderColor: "#1e2535" }}>
              <div className={cn("flex items-center justify-between px-4 py-3 border-b", isRTL && "flex-row-reverse")}
                style={{ borderColor: "#1e2535" }}>
                <span className="text-sm font-semibold text-white">{t("runHistory")}</span>
                <span className="text-xs" style={{ color: "#8892a4" }}>{runs.length}</span>
              </div>
              <div className="p-2 space-y-2">
                {runs.length === 0 ? (
                  <p className="text-xs text-center py-6" style={{ color: "#8892a4" }}>{t("noRunHistory")}</p>
                ) : (
                  runs.slice(0, 20).map((run) => {
                    const modelA = GEMMA_MODELS.find((m) => m.id === run.modelA);
                    return (
                      <div key={run.id}
                        className="rounded-lg p-3"
                        style={{ background: "#131720", border: "1px solid #1e2535" }}>
                        <div className={cn("flex items-center justify-between mb-1", isRTL && "flex-row-reverse")}>
                          <span className="text-xs font-medium text-white truncate">
                            {lang === "ar" ? modelA?.nameAr : modelA?.nameEn}
                          </span>
                          {run.modelB && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee" }}>
                              A/B
                            </span>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: "#8892a4" }}>
                          {run.tokensA} tokens · {run.timeA}ms
                        </p>
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: "#4a5568" }}>
                          {run.promptText.slice(0, 40)}...
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestRunnerPage;
