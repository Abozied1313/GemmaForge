import { useState, useEffect, useCallback } from "react";
import type { Project, Prompt, TestRun } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const PROJECTS_KEY = "gf_projects";
const PROMPTS_KEY = "gf_prompts";
const RUNS_KEY = "gf_runs";

const getAll = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const saveAll = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  const load = useCallback(() => {
    const all = getAll<Project>(PROJECTS_KEY);
    setProjects(all.filter((p) => p.userId === user?.id));
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const createProject = (data: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt" | "promptCount">) => {
    const all = getAll<Project>(PROJECTS_KEY);
    const newProject: Project = {
      ...data,
      id: `proj_${Date.now()}`,
      userId: user!.id,
      promptCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAll(PROJECTS_KEY, [...all, newProject]);
    load();
    return newProject;
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    const all = getAll<Project>(PROJECTS_KEY);
    const updated = all.map((p) => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
    saveAll(PROJECTS_KEY, updated);
    load();
  };

  const deleteProject = (id: string) => {
    const all = getAll<Project>(PROJECTS_KEY);
    saveAll(PROJECTS_KEY, all.filter((p) => p.id !== id));
    // Delete associated prompts
    const prompts = getAll<Prompt>(PROMPTS_KEY);
    saveAll(PROMPTS_KEY, prompts.filter((p) => p.projectId !== id));
    load();
  };

  return { projects, createProject, updateProject, deleteProject, reload: load };
};

export const usePrompts = (projectId?: string) => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const load = useCallback(() => {
    const all = getAll<Prompt>(PROMPTS_KEY);
    const userPrompts = all.filter((p) => p.userId === user?.id);
    setPrompts(projectId ? userPrompts.filter((p) => p.projectId === projectId) : userPrompts);
  }, [user?.id, projectId]);

  useEffect(() => { load(); }, [load]);

  const createPrompt = (data: Omit<Prompt, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const all = getAll<Prompt>(PROMPTS_KEY);
    const newPrompt: Prompt = {
      ...data,
      id: `prompt_${Date.now()}`,
      userId: user!.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAll(PROMPTS_KEY, [...all, newPrompt]);
    // Update project prompt count
    const projects = getAll<Project>(PROJECTS_KEY);
    const updated = projects.map((p) =>
      p.id === data.projectId ? { ...p, promptCount: p.promptCount + 1, updatedAt: new Date().toISOString() } : p
    );
    saveAll(PROJECTS_KEY, updated);
    load();
    return newPrompt;
  };

  const updatePrompt = (id: string, data: Partial<Prompt>) => {
    const all = getAll<Prompt>(PROMPTS_KEY);
    const updated = all.map((p) => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
    saveAll(PROMPTS_KEY, updated);
    load();
  };

  const deletePrompt = (id: string) => {
    const all = getAll<Prompt>(PROMPTS_KEY);
    const toDelete = all.find((p) => p.id === id);
    saveAll(PROMPTS_KEY, all.filter((p) => p.id !== id));
    if (toDelete) {
      const projects = getAll<Project>(PROJECTS_KEY);
      const updated = projects.map((p) =>
        p.id === toDelete.projectId ? { ...p, promptCount: Math.max(0, p.promptCount - 1) } : p
      );
      saveAll(PROJECTS_KEY, updated);
    }
    load();
  };

  return { prompts, createPrompt, updatePrompt, deletePrompt, reload: load };
};

export const useTestRuns = () => {
  const { user } = useAuth();
  const [runs, setRuns] = useState<TestRun[]>([]);

  const load = useCallback(() => {
    const all = getAll<TestRun>(RUNS_KEY);
    const userRuns = all.filter((r) => {
      const prompts = getAll<Prompt>(PROMPTS_KEY);
      const prompt = prompts.find((p) => p.id === r.promptId);
      return prompt?.userId === user?.id || r.promptId === "direct";
    });
    setRuns(userRuns.slice(-50).reverse());
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const saveRun = (run: Omit<TestRun, "id" | "createdAt">) => {
    const all = getAll<TestRun>(RUNS_KEY);
    const newRun: TestRun = {
      ...run,
      id: `run_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveAll(RUNS_KEY, [...all, newRun]);
    load();
    return newRun;
  };

  return { runs, saveRun, reload: load };
};

export const extractVariables = (content: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const vars: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const varName = match[1].trim();
    if (!vars.includes(varName)) vars.push(varName);
  }
  return vars;
};

export const interpolatePrompt = (content: string, vars: Record<string, string>): string => {
  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => vars[key.trim()] || `{{${key}}}`);
};
