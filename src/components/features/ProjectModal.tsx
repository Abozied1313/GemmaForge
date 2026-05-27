import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Project } from "@/types";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const COLORS = [
  "#6c3aff", "#22d3ee", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#14b8a6", "#ec4899",
];

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; color: string }) => void;
  project?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const { t, isRTL } = useLang();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setColor(project.color);
    } else {
      setName("");
      setDescription("");
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative rounded-2xl p-6 w-full max-w-md animate-fade-in"
        style={{ background: "#0e1117", border: "1px solid #1e2535" }}
      >
        {/* Header */}
        <div className={cn("flex items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
          <h2 className="text-lg font-bold text-white">
            {project ? t("editProject") : t("createProject")}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:text-white transition-colors"
            style={{ color: "#8892a4" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={cn("block text-sm font-medium text-white mb-2", isRTL && "text-right")}>
              {t("projectName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("projectNamePlaceholder")}
              className={cn("w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none", isRTL && "text-right")}
              style={{ background: "#131720", border: "1px solid #1e2535" }}
              autoFocus
            />
          </div>

          <div>
            <label className={cn("block text-sm font-medium text-white mb-2", isRTL && "text-right")}>
              {t("projectDescription")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("projectDescPlaceholder")}
              rows={3}
              className={cn("w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none", isRTL && "text-right")}
              style={{ background: "#131720", border: "1px solid #1e2535" }}
            />
          </div>

          <div>
            <label className={cn("block text-sm font-medium text-white mb-2", isRTL && "text-right")}>
              {t("projectColor")}
            </label>
            <div className={cn("flex gap-2 flex-wrap", isRTL && "flex-row-reverse")}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: c,
                    boxShadow: color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview bar */}
        <div className="mt-4 h-1.5 rounded-full" style={{ background: color }} />

        {/* Buttons */}
        <div className={cn("flex gap-3 mt-6", isRTL && "flex-row-reverse")}>
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}>
            {t("cancel")}
          </button>
          <button onClick={handleSave}
            className="flex-1 gemma-button text-sm"
            disabled={!name.trim()}>
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
