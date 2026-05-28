import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus, Save, Trash2, FileCode2, ChevronDown, Variable, Eye, Zap, Tag
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TopBar from "@/components/layout/TopBar";
import { useProjects, usePrompts, extractVariables } from "@/hooks/useData";
import { useLang } from "@/contexts/LanguageContext";
import type { Prompt } from "@/types";
import { cn } from "@/lib/utils";

const PromptEditorPage: React.FC = () => {
  const { t, isRTL } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initProjectId = searchParams.get("projectId") || "";

  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(initProjectId);
  const { prompts, createPrompt, updatePrompt, deletePrompt } = usePrompts(selectedProjectId || undefined);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const variables = extractVariables(content);
  const charCount = content.length;
  const estimatedTokens = Math.ceil(charCount / 3.5);

  useEffect(() => {
    if (initProjectId) setSelectedProjectId(initProjectId);
  }, [initProjectId]);

  // When prompts reload and we have a selected prompt, sync its content
  useEffect(() => {
    if (selectedPrompt) {
      const fresh = prompts.find((p) => p.id === selectedPrompt.id);
      if (fresh) {
        setSelectedPrompt(fresh);
      }
    }
  }, [prompts]);

  const loadPrompt = (p: Prompt) => {
    setSelectedPrompt(p);
    setTitle(p.title);
    setContent(p.content);
    setDescription(p.description);
    setTagsInput(p.tags.join(", "));
    setIsDirty(false);
    setShowPreview(false);
  };

  const handleNew = () => {
    setSelectedPrompt(null);
    setTitle("");
    setContent("");
    setDescription("");
    setTagsInput("");
    setIsDirty(false);
    setShowPreview(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !selectedProjectId) return;
    setSaving(true);
    const tags = tagsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const vars = extractVariables(content);

    if (selectedPrompt) {
      await updatePrompt(selectedPrompt.id, { title, content, description, tags, variables: vars });
    } else {
      const created = await createPrompt({
        title,
        content,
        description,
        tags,
        variables: vars,
        projectId: selectedProjectId,
      });
      if (created) setSelectedPrompt(created);
    }
    setSaving(false);
    setIsDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = async (id: string) => {
    await deletePrompt(id);
    if (selectedPrompt?.id === id) handleNew();
  };

  const markDirty = useCallback(() => setIsDirty(true), []);

  const highlightVariables = (text: string) =>
    text.replace(/\{\{([^}]+)\}\}/g, '<span class="variable-chip">{{$1}}</span>');

  return (
    <DashboardLayout>
      <TopBar title={t("promptEditor")} />
      <div className={cn("flex flex-1 overflow-hidden", isRTL && "flex-row-reverse")}>

        {/* ── Sidebar: Prompt List ── */}
        <div
          className="w-64 flex flex-col flex-shrink-0 border-r overflow-hidden"
          style={{ background: "#0e1117", borderColor: "#1e2535" }}
        >
          {/* Project Selector */}
          <div className="p-3 border-b" style={{ borderColor: "#1e2535" }}>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => { setSelectedProjectId(e.target.value); handleNew(); }}
                className="w-full py-2 px-3 text-sm text-white rounded-lg appearance-none cursor-pointer outline-none"
                style={{ background: "#131720", border: "1px solid #1e2535" }}
              >
                <option value="">{t("selectProject")}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown
                className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none", isRTL ? "left-2" : "right-2")}
                style={{ color: "#8892a4" }}
              />
            </div>
          </div>

          {/* New Prompt */}
          <div className="p-2 border-b" style={{ borderColor: "#1e2535" }}>
            <button
              onClick={handleNew}
              className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all", isRTL && "flex-row-reverse")}
              style={{ background: "rgba(108,58,255,0.15)", border: "1px solid rgba(108,58,255,0.3)", color: "#a99bff" }}
            >
              <Plus className="w-4 h-4" />
              {t("createPrompt")}
            </button>
          </div>

          {/* Prompt List */}
          <div className="flex-1 overflow-y-auto scrollbar-dark p-2 space-y-1">
            {!selectedProjectId ? (
              <p className="text-xs text-center py-4" style={{ color: "#8892a4" }}>{t("selectProject")}</p>
            ) : prompts.length === 0 ? (
              <div className="text-center py-8">
                <FileCode2 className="w-8 h-8 mx-auto mb-2" style={{ color: "#1e2535" }} />
                <p className="text-xs" style={{ color: "#8892a4" }}>{t("noPrompts")}</p>
              </div>
            ) : (
              prompts.map((p) => (
                <div
                  key={p.id}
                  className="group flex items-start justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: selectedPrompt?.id === p.id ? "rgba(108,58,255,0.2)" : "transparent",
                    border: selectedPrompt?.id === p.id ? "1px solid rgba(108,58,255,0.3)" : "1px solid transparent",
                  }}
                  onClick={() => loadPrompt(p)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{p.title}</p>
                    {p.variables.length > 0 && (
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#8892a4" }}>
                        <Variable className="w-3 h-3" />
                        {p.variables.length}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                    style={{ color: "#8892a4" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Main Editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#080a0f" }}>
          {!selectedProjectId ? (
            /* No project selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileCode2 className="w-16 h-16 mb-4" style={{ color: "#1e2535" }} />
              <h3 className="text-xl font-bold text-white mb-2">{t("selectProject")}</h3>
              <p className="text-sm mb-4" style={{ color: "#8892a4" }}>
                {isRTL ? "اختر مشروعاً من القائمة لتبدأ في كتابة البرومبتات" : "Select a project to start writing prompts"}
              </p>
              <button onClick={() => navigate("/projects")} className="gemma-button text-sm">
                {t("myProjects")}
              </button>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div
                className={cn("flex items-center justify-between px-5 py-3 border-b flex-shrink-0", isRTL && "flex-row-reverse")}
                style={{ borderColor: "#1e2535", background: "#0e1117" }}
              >
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <span className="text-sm font-medium text-white">
                    {selectedPrompt ? selectedPrompt.title : (isRTL ? "برومبت جديد" : "New Prompt")}
                  </span>
                  {isDirty && <span className="w-2 h-2 rounded-full bg-yellow-400" title="Unsaved" />}
                  {saved && <span className="text-xs text-green-400">✓ {t("changesSaved")}</span>}
                </div>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all", isRTL && "flex-row-reverse")}
                    style={{
                      background: showPreview ? "rgba(34,211,238,0.1)" : "#131720",
                      color: showPreview ? "#22d3ee" : "#8892a4",
                      border: "1px solid #1e2535",
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t("preview")}
                  </button>
                  <button
                    onClick={() => selectedPrompt && navigate(`/runner?promptId=${selectedPrompt.id}`)}
                    disabled={!selectedPrompt}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-40", isRTL && "flex-row-reverse")}
                    style={{ background: "rgba(108,58,255,0.15)", color: "#a99bff", border: "1px solid rgba(108,58,255,0.3)" }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {t("runThisPrompt")}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !title.trim() || !selectedProjectId}
                    className={cn("gemma-button flex items-center gap-1.5 text-xs px-4 py-1.5 disabled:opacity-40", isRTL && "flex-row-reverse")}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : t("savePrompt")}
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 overflow-y-auto scrollbar-dark p-5 space-y-4">
                {/* Title + Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className={cn("block text-xs font-medium mb-1.5", isRTL && "text-right")} style={{ color: "#8892a4" }}>
                      {t("promptName")} *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); markDirty(); }}
                      placeholder={t("promptNamePlaceholder")}
                      className={cn("w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/50", isRTL && "text-right")}
                      style={{ background: "#0e1117", border: "1px solid #1e2535" }}
                    />
                  </div>
                  <div>
                    <label className={cn("block text-xs font-medium mb-1.5", isRTL && "text-right")} style={{ color: "#8892a4" }}>
                      {t("promptDescription")}
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                      placeholder={t("promptDescPlaceholder")}
                      className={cn("w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/50", isRTL && "text-right")}
                      style={{ background: "#0e1117", border: "1px solid #1e2535" }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={cn("flex items-center gap-1.5 text-xs font-medium mb-1.5", isRTL && "flex-row-reverse justify-end")} style={{ color: "#8892a4" }}>
                    <Tag className="w-3 h-3" />
                    {t("promptTags")}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => { setTagsInput(e.target.value); markDirty(); }}
                    placeholder={t("tagsPlaceholder")}
                    className={cn("w-full px-4 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-purple-500/50", isRTL && "text-right")}
                    style={{ background: "#0e1117", border: "1px solid #1e2535" }}
                  />
                </div>

                {/* Content */}
                <div>
                  <div className={cn("flex items-center justify-between mb-1.5", isRTL && "flex-row-reverse")}>
                    <label className="text-xs font-medium" style={{ color: "#8892a4" }}>
                      {t("promptContent")} *
                    </label>
                    <div className={cn("flex items-center gap-3 text-xs", isRTL && "flex-row-reverse")} style={{ color: "#8892a4" }}>
                      <span>{charCount.toLocaleString()} {t("characters")}</span>
                      <span>~{estimatedTokens.toLocaleString()} {t("tokens")}</span>
                      {variables.length > 0 && (
                        <span className="token-badge">{variables.length} {t("variables")}</span>
                      )}
                    </div>
                  </div>

                  {showPreview ? (
                    <div
                      className="w-full rounded-xl p-4 min-h-64 text-sm leading-relaxed"
                      style={{ background: "#0a0c12", border: "1px solid #1e2535", color: "#e2e8f0" }}
                      dangerouslySetInnerHTML={{
                        __html: highlightVariables(content || (isRTL ? "اكتب البرومبت أولاً..." : "Write your prompt first...")),
                      }}
                    />
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => { setContent(e.target.value); markDirty(); }}
                      placeholder={t("promptContentPlaceholder")}
                      rows={16}
                      className={cn("code-editor w-full rounded-xl p-4 resize-none outline-none leading-relaxed scrollbar-dark focus:ring-1 focus:ring-purple-500/30", isRTL && "text-right")}
                      style={{ minHeight: "320px" }}
                      spellCheck={false}
                    />
                  )}
                </div>

                {/* Variables */}
                {variables.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: "#0e1117", border: "1px solid rgba(34,211,238,0.2)" }}>
                    <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                      <Variable className="w-4 h-4" style={{ color: "#22d3ee" }} />
                      <span className="text-sm font-medium text-white">{t("extractedVars")}</span>
                    </div>
                    <div className={cn("flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
                      {variables.map((v) => (
                        <span key={v} className="variable-chip">{`{{${v}}}`}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PromptEditorPage;
