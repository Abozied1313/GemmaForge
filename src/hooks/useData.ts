import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Project, Prompt, TestRun } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

/* ────────────────────────────────────────────────
   PROJECTS
──────────────────────────────────────────────── */
export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(
        data.map((p) => ({
          id: p.id,
          userId: p.user_id,
          name: p.name,
          description: p.description ?? "",
          color: p.color ?? "#6c3aff",
          icon: p.icon ?? "folder",
          promptCount: p.prompt_count ?? 0,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const createProject = async (
    data: Pick<Project, "name" | "description" | "color"> & { icon?: string }
  ): Promise<Project | null> => {
    if (!user) return null;
    const { data: row, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: data.name,
        description: data.description ?? "",
        color: data.color ?? "#6c3aff",
        icon: data.icon ?? "folder",
        prompt_count: 0,
      })
      .select()
      .single();

    if (error || !row) { console.error("createProject error:", error); return null; }
    await load();
    return {
      id: row.id, userId: row.user_id, name: row.name,
      description: row.description, color: row.color, icon: row.icon,
      promptCount: row.prompt_count, createdAt: row.created_at, updatedAt: row.updated_at,
    };
  };

  const updateProject = async (id: string, data: Partial<Pick<Project, "name" | "description" | "color" | "icon">>) => {
    const { error } = await supabase
      .from("projects")
      .update({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.icon !== undefined && { icon: data.icon }),
      })
      .eq("id", id);
    if (error) console.error("updateProject error:", error);
    await load();
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) console.error("deleteProject error:", error);
    await load();
  };

  return { projects, loading, createProject, updateProject, deleteProject, reload: load };
};

/* ────────────────────────────────────────────────
   PROMPTS
──────────────────────────────────────────────── */
export const usePrompts = (projectId?: string) => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (projectId) query = query.eq("project_id", projectId);

    const { data, error } = await query;
    if (error) { console.error("usePrompts load error:", error); setLoading(false); return; }
    if (data) {
      setPrompts(
        data.map((p) => ({
          id: p.id,
          userId: p.user_id,
          projectId: p.project_id,
          title: p.title,
          content: p.content ?? "",
          description: p.description ?? "",
          tags: p.tags ?? [],
          variables: p.variables ?? [],
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }))
      );
    }
    setLoading(false);
  }, [user, projectId]);

  useEffect(() => { load(); }, [load]);

  const createPrompt = async (
    data: Pick<Prompt, "title" | "content" | "description" | "tags" | "projectId">
  ): Promise<Prompt | null> => {
    if (!user) return null;
    const vars = extractVariables(data.content);

    const { data: row, error } = await supabase
      .from("prompts")
      .insert({
        user_id: user.id,
        project_id: data.projectId,
        title: data.title,
        content: data.content ?? "",
        description: data.description ?? "",
        tags: data.tags ?? [],
        variables: vars,
      })
      .select()
      .single();

    if (error || !row) { console.error("createPrompt error:", error); return null; }

    // Increment prompt_count on the project
    const { data: proj } = await supabase
      .from("projects")
      .select("prompt_count")
      .eq("id", data.projectId)
      .single();
    if (proj !== null) {
      await supabase
        .from("projects")
        .update({ prompt_count: (proj.prompt_count ?? 0) + 1 })
        .eq("id", data.projectId);
    }

    await load();
    return {
      id: row.id, userId: row.user_id, projectId: row.project_id,
      title: row.title, content: row.content, description: row.description,
      tags: row.tags, variables: row.variables,
      createdAt: row.created_at, updatedAt: row.updated_at,
    };
  };

  const updatePrompt = async (id: string, data: Partial<Pick<Prompt, "title" | "content" | "description" | "tags" | "variables">>) => {
    const vars = data.content !== undefined ? extractVariables(data.content) : undefined;
    const { error } = await supabase
      .from("prompts")
      .update({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(vars !== undefined && { variables: vars }),
      })
      .eq("id", id);
    if (error) console.error("updatePrompt error:", error);
    await load();
  };

  const deletePrompt = async (id: string) => {
    const { data: toDelete } = await supabase
      .from("prompts")
      .select("project_id")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) { console.error("deletePrompt error:", error); return; }

    if (toDelete?.project_id) {
      const { data: proj } = await supabase
        .from("projects")
        .select("prompt_count")
        .eq("id", toDelete.project_id)
        .single();
      if (proj) {
        await supabase
          .from("projects")
          .update({ prompt_count: Math.max(0, (proj.prompt_count ?? 1) - 1) })
          .eq("id", toDelete.project_id);
      }
    }
    await load();
  };

  return { prompts, loading, createPrompt, updatePrompt, deletePrompt, reload: load };
};

/* ────────────────────────────────────────────────
   TEST RUNS
──────────────────────────────────────────────── */
export const useTestRuns = () => {
  const { user } = useAuth();
  const [runs, setRuns] = useState<TestRun[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("test_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) { console.error("useTestRuns load error:", error); return; }
    if (data) {
      setRuns(
        data.map((r) => ({
          id: r.id,
          promptId: r.prompt_id ?? "direct",
          promptText: r.prompt_text,
          modelA: r.model_a,
          modelB: r.model_b ?? undefined,
          outputA: r.output_a ?? "",
          outputB: r.output_b ?? undefined,
          tokensA: r.tokens_a ?? 0,
          tokensB: r.tokens_b ?? undefined,
          timeA: r.time_a ?? 0,
          timeB: r.time_b ?? undefined,
          createdAt: r.created_at,
        }))
      );
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const saveRun = async (run: Omit<TestRun, "id" | "createdAt">): Promise<TestRun | null> => {
    if (!user) return null;
    const { data: row, error } = await supabase
      .from("test_runs")
      .insert({
        user_id: user.id,
        prompt_id: run.promptId === "direct" ? null : run.promptId,
        prompt_text: run.promptText,
        model_a: run.modelA,
        model_b: run.modelB ?? null,
        output_a: run.outputA ?? "",
        output_b: run.outputB ?? null,
        tokens_a: run.tokensA ?? 0,
        tokens_b: run.tokensB ?? null,
        time_a: run.timeA ?? 0,
        time_b: run.timeB ?? null,
      })
      .select()
      .single();

    if (error || !row) { console.error("saveRun error:", error); return null; }
    await load();
    return {
      id: row.id,
      promptId: row.prompt_id ?? "direct",
      promptText: row.prompt_text,
      modelA: row.model_a,
      modelB: row.model_b ?? undefined,
      outputA: row.output_a,
      outputB: row.output_b ?? undefined,
      tokensA: row.tokens_a,
      tokensB: row.tokens_b ?? undefined,
      timeA: row.time_a,
      timeB: row.time_b ?? undefined,
      createdAt: row.created_at,
    };
  };

  return { runs, saveRun, reload: load };
};

/* ────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────── */
export const extractVariables = (content: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const vars: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const v = match[1].trim();
    if (!vars.includes(v)) vars.push(v);
  }
  return vars;
};

export const interpolatePrompt = (content: string, vars: Record<string, string>): string =>
  content.replace(/\{\{([^}]+)\}\}/g, (_, key) => vars[key.trim()] || `{{${key}}}`);
