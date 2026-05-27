import React from "react";
import { FileCode2, Pencil, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import type { Project } from "@/types";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onOpen: (p: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onOpen }) => {
  const { t, isRTL } = useLang();

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  return (
    <div
      className="rounded-xl p-5 group transition-all duration-200 hover:scale-[1.01] cursor-pointer"
      style={{ background: "#0e1117", border: "1px solid #1e2535" }}
      onClick={() => onOpen(project)}
    >
      {/* Color Bar */}
      <div className="w-full h-1 rounded-full mb-4" style={{ background: project.color }} />

      <div className={cn("flex items-start justify-between mb-3", isRTL && "flex-row-reverse")}>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base truncate mb-1">{project.name}</h3>
          <p className="text-sm line-clamp-2" style={{ color: "#8892a4" }}>{project.description}</p>
        </div>
      </div>

      <div className={cn("flex items-center justify-between mt-4 pt-4", isRTL && "flex-row-reverse")}
        style={{ borderTop: "1px solid #1e2535" }}>
        <div className={cn("flex items-center gap-4 text-xs", isRTL && "flex-row-reverse")}
          style={{ color: "#8892a4" }}>
          <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
            <FileCode2 className="w-3.5 h-3.5" />
            {project.promptCount} {t("prompts")}
          </span>
          <span>{formatDate(project.updatedAt)}</span>
        </div>

        <div className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", isRTL && "flex-row-reverse")}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
            className="p-1.5 rounded-md hover:text-white transition-colors"
            style={{ color: "#8892a4" }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
            className="p-1.5 rounded-md hover:text-red-400 transition-colors"
            style={{ color: "#8892a4" }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isRTL ? <ArrowLeft className="w-4 h-4" style={{ color: "#6c3aff" }} /> : <ArrowRight className="w-4 h-4" style={{ color: "#6c3aff" }} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
