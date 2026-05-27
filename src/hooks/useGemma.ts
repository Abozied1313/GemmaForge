import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { GemmaModel } from "@/types";

export interface RunResult {
  output: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  executionTime: number;
  error?: string;
}

export const useGemma = () => {
  const [isRunning, setIsRunning] = useState(false);

  const runPrompt = async (prompt: string, model: GemmaModel): Promise<RunResult> => {
    setIsRunning(true);
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke("gemma-runner", {
        body: { prompt, model },
      });

      const executionTime = Date.now() - startTime;

      if (error) {
        let msg = error.message;
        try {
          const txt = await (error as any).context?.text?.();
          if (txt) msg = txt;
        } catch { /* ignore */ }
        return { output: "", inputTokens: 0, outputTokens: 0, totalTokens: 0, executionTime, error: msg };
      }

      return {
        output: data.output ?? "",
        inputTokens: data.inputTokens ?? 0,
        outputTokens: data.outputTokens ?? 0,
        totalTokens: data.totalTokens ?? 0,
        executionTime,
      };
    } catch (e: any) {
      return {
        output: "",
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        executionTime: Date.now() - startTime,
        error: e?.message ?? "Unknown error",
      };
    } finally {
      setIsRunning(false);
    }
  };

  // Run two models in parallel for A/B testing
  const runAB = async (
    prompt: string,
    modelA: GemmaModel,
    modelB: GemmaModel,
    onADone: (r: RunResult) => void,
    onBDone: (r: RunResult) => void
  ) => {
    setIsRunning(true);
    await Promise.all([
      runPrompt(prompt, modelA).then((r) => { onADone(r); return r; }),
      runPrompt(prompt, modelB).then((r) => { onBDone(r); return r; }),
    ]);
    setIsRunning(false);
  };

  return { runPrompt, runAB, isRunning };
};
