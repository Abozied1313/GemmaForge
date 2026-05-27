import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileCode2,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GitCompare,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

/* ── Logo mark — pure CSS/SVG, no image ── */
const GemmaLogoMark: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8468ff" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="url(#gm-grad)" opacity="0.18" />
    <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="url(#gm-grad)" strokeWidth="1.5" />
    <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="url(#gm-grad)" opacity="0.35" />
    <circle cx="14" cy="14" r="3" fill="url(#gm-grad)" />
  </svg>
);

const Sidebar: React.FC = () => {
  const { t, isRTL } = useLang();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { path: "/projects", icon: FolderOpen, label: t("projects") },
    { path: "/editor", icon: FileCode2, label: t("promptEditor") },
    { path: "/runner", icon: Zap, label: t("testRunner") },
    { path: "/settings", icon: Settings, label: t("settings") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]",
        isRTL ? "border-l" : "border-r"
      )}
      style={{ background: "#0a0c12", borderColor: "#1a2030" }}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-4 border-b",
          collapsed && "justify-center px-2"
        )}
        style={{ borderColor: "#1a2030" }}
      >
        <div className="flex-shrink-0 relative">
          <GemmaLogoMark size={28} />
          <span
            className="absolute inset-0 rounded-sm"
            style={{ boxShadow: "0 0 10px rgba(108,58,255,0.45)", pointerEvents: "none" }}
          />
        </div>

        {!collapsed && (
          <div className={cn("min-w-0", isRTL && "text-right")}>
            <p
              className="text-sm font-bold tracking-tight leading-none text-white"
              style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
            >
              Gemma{" "}
              <span
                className="font-extrabold"
                style={{
                  background: "linear-gradient(90deg,#8468ff,#22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Forge
              </span>
            </p>
            <p
              className="text-[10px] mt-0.5 font-medium tracking-widest uppercase"
              style={{ color: "#4a5568", letterSpacing: "0.12em" }}
            >
              Prompt CMS
            </p>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-dark">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              title={collapsed ? label : undefined}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer",
                collapsed ? "justify-center" : isRTL ? "flex-row-reverse" : ""
              )}
              style={{
                background: active ? "rgba(108,58,255,0.15)" : "transparent",
                color: active ? "#c4b5fd" : "#6b7280",
                border: active ? "1px solid rgba(108,58,255,0.25)" : "1px solid transparent",
              }}
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: active ? "#a78bfa" : "inherit" }}
              />
              {!collapsed && <span className="truncate leading-none">{label}</span>}
              {!collapsed && active && !isRTL && (
                <span className="ml-auto w-1 h-4 rounded-full" style={{ background: "#7c3aed" }} />
              )}
              {!collapsed && active && isRTL && (
                <span className="mr-auto w-1 h-4 rounded-full" style={{ background: "#7c3aed" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-2 pb-3 pt-2 space-y-1 border-t" style={{ borderColor: "#1a2030" }}>
        {/* User chip */}
        {!collapsed && (
          <div
            className={cn("flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-1", isRTL && "flex-row-reverse")}
            style={{ background: "#131720" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#6c3aff,#22d3ee)",
                color: "white",
                boxShadow: "0 0 8px rgba(108,58,255,0.4)",
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: "#6b7280" }}>{user?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={signOut}
          title={collapsed ? t("signOut") : undefined}
          className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer group",
            collapsed ? "justify-center" : isRTL ? "flex-row-reverse" : ""
          )}
          style={{ color: "#6b7280" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>{t("signOut")}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center px-2 py-2 rounded-lg transition-colors duration-150"
          style={{ color: "#4a5568" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5568")}
        >
          {isRTL
            ? collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            : collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
