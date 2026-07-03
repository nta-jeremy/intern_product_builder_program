"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "@/lib/theme";

interface PortalContextValue {
  theme: "light" | "dark";
  isDark: boolean;
  toggleTheme: () => void;
  comp: string | null;
  openComp: (code: string) => void;
  closeComp: () => void;
  badgeIdx: number | null;
  openBadge: (i: number) => void;
  closeBadge: () => void;
  quizLessonId: string | null;
  openQuiz: (id?: string) => void;
  closeQuiz: () => void;
  roadmapQuizLesson: string | null;
  setRoadmapQuizLesson: (id: string) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const { theme, isDark, toggle } = useTheme();
  const [comp, setComp] = useState<string | null>(null);
  const [badgeIdx, setBadgeIdx] = useState<number | null>(null);
  const [quizLessonId, setQuizLessonId] = useState<string | null>(null);
  const [roadmapQuizLesson, setRoadmapQuizLessonState] = useState<string | null>(
    null,
  );

  const value = useMemo<PortalContextValue>(
    () => ({
      theme,
      isDark,
      toggleTheme: toggle,
      comp,
      openComp: (code) => setComp(code),
      closeComp: () => setComp(null),
      badgeIdx,
      openBadge: (i) => setBadgeIdx(i),
      closeBadge: () => setBadgeIdx(null),
      quizLessonId,
      openQuiz: (id) => setQuizLessonId(id ?? "I1.1"),
      closeQuiz: () => setQuizLessonId(null),
      roadmapQuizLesson,
      setRoadmapQuizLesson: (id) => setRoadmapQuizLessonState(id),
    }),
    [theme, isDark, toggle, comp, badgeIdx, quizLessonId, roadmapQuizLesson],
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}
