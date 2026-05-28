export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Prompt {
  id: string;
  projectId: string;
  userId: string;
  /** displayed title / name */
  title: string;
  content: string;
  variables: string[];
  tags: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** Matches the test_runs table in Supabase */
export interface TestRun {
  id: string;
  promptId: string;
  promptText: string;
  modelA: GemmaModel;
  modelB?: GemmaModel;
  outputA: string;
  outputB?: string;
  tokensA: number;
  tokensB?: number;
  timeA: number;
  timeB?: number;
  createdAt: string;
}

export type GemmaModel =
  | "gemma-4-27b"
  | "gemma-4-12b"
  | "gemma-2-27b"
  | "gemma-2-9b"
  | "gemma-2-2b"
  | "gemma-7b"
  | "gemma-2b";

export interface ModelInfo {
  id: GemmaModel;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  contextWindow: number;
  params: string;
  badge?: string;
  badgeColor?: string;
}

export type Language = "ar" | "en";

export interface AppSettings {
  language: Language;
  theme: "dark" | "light";
  defaultModel: GemmaModel;
  fontSize: "sm" | "md" | "lg";
}
