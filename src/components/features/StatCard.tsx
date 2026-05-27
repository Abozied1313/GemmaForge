import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  color?: string;
  gradient?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, color = "#6c3aff", gradient }) => {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
      style={{ background: "#0e1117", border: "1px solid #1e2535" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#0d1f0d", color: "#4ade80" }}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm" style={{ color: "#8892a4" }}>{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
