import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen, FileCode2, Zap, TrendingUp, Clock, Plus, ArrowRight, ArrowLeft, Cpu
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/features/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useProjects } from "@/hooks/useData";
import { usePrompts } from "@/hooks/useData";
import { useTestRuns } from "@/hooks/useData";
import { GEMMA_MODELS } from "@/constants/models";
import { cn } from "@/lib/utils";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t, isRTL, lang } = useLang();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { prompts } = usePrompts();
  const { runs } = useTestRuns();

  const totalTokens = runs.reduce((acc, r) => acc + r.totalTokens, 0);
  const avgTokens = runs.length ? Math.round(totalTokens / runs.length) : 0;

  const modelUsage: Record<string, number> = {};
  runs.forEach((r) => { modelUsage[r.model] = (modelUsage[r.model] || 0) + 1; });
  const topModels = Object.entries(modelUsage).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return isRTL ? "الآن" : "Just now";
    if (mins < 60) return isRTL ? `منذ ${mins} دقيقة` : `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return isRTL ? `منذ ${hrs} ساعة` : `${hrs}h ago`;
    return isRTL ? `منذ ${Math.floor(hrs / 24)} يوم` : `${Math.floor(hrs / 24)}d ago`;
  };

  const quickActions = [
    { icon: Plus, label: t("newProject"), onClick: () => navigate("/projects"), color: "#6c3aff" },
    { icon: FileCode2, label: t("newPrompt"), onClick: () => navigate("/editor"), color: "#22d3ee" },
    { icon: Zap, label: t("runTest"), onClick: () => navigate("/runner"), color: "#f59e0b" },
  ];

  return (
    <DashboardLayout>
      <TopBar title={t("dashboard")} />
      <div className="flex-1 overflow-y-auto scrollbar-dark p-6 space-y-6">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(108,58,255,0.2) 0%, rgba(34,211,238,0.1) 100%)", border: "1px solid rgba(108,58,255,0.3)" }}
        >
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={isRTL ? "text-right" : ""}>
              <h2 className="text-xl font-bold text-white mb-1">
                {t("welcomeUser")}، {user?.name?.split(" ")[0]} 👋
              </h2>
              <p className="text-sm" style={{ color: "#a99bff" }}>
                {isRTL
                  ? `لديك ${projects.length} مشروع و ${prompts.length} برومبت`
                  : `You have ${projects.length} projects and ${prompts.length} prompts`
                }
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(108,58,255,0.2)", border: "1px solid rgba(108,58,255,0.3)" }}>
                <Cpu className="w-8 h-8" style={{ color: "#a99bff" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FolderOpen} label={t("totalProjects")} value={projects.length} color="#6c3aff" />
          <StatCard icon={FileCode2} label={t("totalPrompts")} value={prompts.length} color="#22d3ee" />
          <StatCard icon={Zap} label={t("totalRuns")} value={runs.length} color="#f59e0b" />
          <StatCard icon={TrendingUp} label={t("avgTokens")} value={avgTokens.toLocaleString()} color="#10b981" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="rounded-xl p-5" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <h3 className={cn("text-sm font-semibold text-white mb-4", isRTL && "text-right")}>{t("quickActions")}</h3>
            <div className="space-y-2">
              {quickActions.map(({ icon: Icon, label, onClick, color }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.01]",
                    isRTL && "flex-row-reverse"
                  )}
                  style={{ background: "#131720", border: "1px solid #1e2535" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-sm font-medium text-white flex-1 text-start">{label}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" style={{ color: "#8892a4" }} /> : <ArrowRight className="w-4 h-4" style={{ color: "#8892a4" }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Runs */}
          <div className="rounded-xl p-5 col-span-1 lg:col-span-2" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <h3 className={cn("text-sm font-semibold text-white mb-4", isRTL && "text-right")}>{t("latestRuns")}</h3>
            {runs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Zap className="w-8 h-8 mb-2" style={{ color: "#1e2535" }} />
                <p className="text-sm" style={{ color: "#8892a4" }}>{t("noRecentActivity")}</p>
                <button onClick={() => navigate("/runner")}
                  className="mt-3 text-sm font-medium hover:underline transition-colors"
                  style={{ color: "#6c3aff" }}>
                  {t("runTest")} →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {runs.slice(0, 5).map((run) => {
                  const model = GEMMA_MODELS.find((m) => m.id === run.model);
                  return (
                    <div key={run.id}
                      className={cn("flex items-center justify-between px-4 py-3 rounded-lg", isRTL && "flex-row-reverse")}
                      style={{ background: "#131720" }}>
                      <div className={cn("flex items-center gap-3 min-w-0", isRTL && "flex-row-reverse")}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: run.status === "success" ? "#10b981" : "#ef4444" }} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {lang === "ar" ? model?.nameAr : model?.nameEn}
                          </p>
                          <p className="text-xs" style={{ color: "#8892a4" }}>
                            {run.totalTokens.toLocaleString()} tokens • {run.executionTime}ms
                          </p>
                        </div>
                      </div>
                      <div className={cn("flex items-center gap-2 text-xs flex-shrink-0", isRTL && "flex-row-reverse")}
                        style={{ color: "#8892a4" }}>
                        <Clock className="w-3 h-3" />
                        {formatTime(run.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Models */}
        {topModels.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <h3 className={cn("text-sm font-semibold text-white mb-4", isRTL && "text-right")}>{t("popularModels")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topModels.map(([modelId, count], i) => {
                const model = GEMMA_MODELS.find((m) => m.id === modelId);
                const maxCount = topModels[0][1];
                return (
                  <div key={modelId} className="rounded-lg p-4" style={{ background: "#131720", border: "1px solid #1e2535" }}>
                    <div className={cn("flex items-center justify-between mb-2", isRTL && "flex-row-reverse")}>
                      <span className="text-xs font-medium text-white">
                        {lang === "ar" ? model?.nameAr : model?.nameEn}
                      </span>
                      <span className="text-xs font-bold" style={{ color: ["#6c3aff", "#22d3ee", "#f59e0b"][i] }}>
                        #{i + 1}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "#1e2535" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          background: ["#6c3aff", "#22d3ee", "#f59e0b"][i]
                        }} />
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: "#8892a4" }}>
                      {count} {isRTL ? "تشغيل" : "runs"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
