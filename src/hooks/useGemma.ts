import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { GemmaModel } from "@/types";
import { FunctionsHttpError } from "@supabase/supabase-js";

export interface RunResult {
  output: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  executionTime: number;
  error?: string;
}

async function callGemmaRunner(prompt: string, model: GemmaModel): Promise<RunResult> {
  const startTime = Date.now();
  try {
    const { data, error } = await supabase.functions.invoke("gemma-runner", {
      body: { prompt, model },
    });

    const executionTime = Date.now() - startTime;

    if (error) {
      let msg = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const text = await error.context?.text?.();
          if (text) msg = text;
        } catch { /* ignore */ }
      }
      console.error("[gemma-runner] error:", msg);
      return { output: "", inputTokens: 0, outputTokens: 0, totalTokens: 0, executionTime, error: msg };
    }

    return {
      output: data?.output ?? "",
      inputTokens: data?.inputTokens ?? 0,
      outputTokens: data?.outputTokens ?? 0,
      totalTokens: data?.totalTokens ?? 0,
      executionTime,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return {
      output: "", inputTokens: 0, outputTokens: 0, totalTokens: 0,
      executionTime: Date.now() - startTime,
      error: msg,
    };
  }
}

export const useGemma = () => {
  const [isRunning, setIsRunning] = useState(false);

  /** Run a single model */
  const runPrompt = async (prompt: string, model: GemmaModel): Promise<RunResult> => {
    setIsRunning(true);
    const result = await callGemmaRunner(prompt, model);
    setIsRunning(false);
    return result;
  };

  /**
   * Run two models in parallel for A/B testing.
   * Calls onADone / onBDone as each finishes independently.
   */
  const runAB = async (
    prompt: string,
    modelA: GemmaModel,
    modelB: GemmaModel,
    onADone: (r: RunResult) => void,
    onBDone: (r: RunResult) => void
  ) => {
    setIsRunning(true);
    await Promise.all([
      callGemmaRunner(prompt, modelA).then((r) => { onADone(r); return r; }),
      callGemmaRunner(prompt, modelB).then((r) => { onBDone(r); return r; }),
    ]);
    setIsRunning(false);
  };

  return { runPrompt, runAB, isRunning };
};
