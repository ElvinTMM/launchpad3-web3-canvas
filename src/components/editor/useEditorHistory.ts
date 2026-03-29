import { useState, useCallback, useEffect } from "react";
import type { Block } from "./types";

export function useEditorHistory(initial: Block[]) {
  const [history, setHistory] = useState<Block[][]>([initial]);
  const [index, setIndex] = useState(0);

  const current = history[index];

  const push = useCallback((blocks: Block[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, index + 1);
      newHistory.push(JSON.parse(JSON.stringify(blocks)));
      return newHistory;
    });
    setIndex((i) => i + 1);
  }, [index]);

  const replace = useCallback((blocks: Block[]) => {
    const cloned = JSON.parse(JSON.stringify(blocks));
    setHistory([cloned]);
    setIndex(0);
  }, []);

  const undo = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex((i) => Math.min(history.length - 1, i + 1));
  }, [history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return { blocks: current, push, replace, undo, redo, canUndo, canRedo };
}
