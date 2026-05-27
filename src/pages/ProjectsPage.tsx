import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FolderOpen, Grid3X3, List } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TopBar from "@/components/layout/TopBar";
import ProjectCard from "@/components/features/ProjectCard";
import ProjectModal from "@/components/features/ProjectModal";
import { useProjects } from "@/hooks/useData";
import { useLang } from "@/contexts/LanguageContext";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const ProjectsPage: React.FC = () => {
  const { t, isRTL } = useLang();
  const navigate = useNavigate();
  const { projects, createProject, updateProject, deleteProject } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: { name: string; description: string; color: string }) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      createProject(data);
    }
    setEditingProject(null);
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setModalOpen(true);
  };

  const handleOpen = (p: Project) => {
    navigate(`/editor?projectId=${p.id}`);
  };

  return (
    <DashboardLayout>
      <TopBar title={t("myProjects")} />
      <div className="flex-1 overflow-y-auto scrollbar-dark p-6">
        {/* Toolbar */}
        <div className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}>
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4", isRTL ? "right-3" : "left-3")}
              style={{ color: "#8892a4" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchProjects")}
              className={cn("w-full py-2.5 text-sm text-white placeholder-gray-600 outline-none rounded-lg", isRTL ? "pr-9 pl-4 text-right" : "pl-9 pr-4")}
              style={{ background: "#0e1117", border: "1px solid #1e2535" }}
            />
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #1e2535" }}>
            <button onClick={() => setViewMode("grid")}
              className="p-2.5 transition-colors"
              style={{ background: viewMode === "grid" ? "#6c3aff" : "#0e1117", color: viewMode === "grid" ? "#fff" : "#8892a4" }}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className="p-2.5 transition-colors"
              style={{ background: viewMode === "list" ? "#6c3aff" : "#0e1117", color: viewMode === "list" ? "#fff" : "#8892a4" }}>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => { setEditingProject(null); setModalOpen(true); }}
            className={cn("gemma-button flex items-center gap-2 text-sm", isRTL && "flex-row-reverse")}
          >
            <Plus className="w-4 h-4" />
            {t("createProject")}
          </button>
        </div>

        {/* Count */}
        <p className={cn("text-xs mb-4", isRTL && "text-right")} style={{ color: "#8892a4" }}>
          {filtered.length} {isRTL ? "مشروع" : "projects"}
        </p>

        {/* Projects Grid/List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
              <FolderOpen className="w-8 h-8" style={{ color: "#1e2535" }} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {search ? (isRTL ? "لا نتائج" : "No results") : t("noProjects")}
            </h3>
            <p className="text-sm mb-6 text-center max-w-sm" style={{ color: "#8892a4" }}>
              {search ? "" : t("noProjectsDesc")}
            </p>
            {!search && (
              <button
                onClick={() => setModalOpen(true)}
                className={cn("gemma-button flex items-center gap-2", isRTL && "flex-row-reverse")}
              >
                <Plus className="w-4 h-4" />
                {t("createProject")}
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={(id) => setConfirmDeleteId(id)}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSave={handleSave}
        project={editingProject}
      />

      {/* Delete Confirm */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
          <div className="relative rounded-2xl p-6 w-full max-w-sm animate-fade-in"
            style={{ background: "#0e1117", border: "1px solid #1e2535" }}>
            <h3 className={cn("text-lg font-bold text-white mb-2", isRTL && "text-right")}>{t("confirmDelete")}</h3>
            <p className={cn("text-sm mb-6", isRTL && "text-right")} style={{ color: "#8892a4" }}>{t("deleteWarning")}</p>
            <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
              <button onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: "#131720", border: "1px solid #1e2535", color: "#8892a4" }}>
                {t("cancel")}
              </button>
              <button onClick={() => { deleteProject(confirmDeleteId); setConfirmDeleteId(null); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "#ef4444" }}>
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProjectsPage;
