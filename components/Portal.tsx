"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "./Header";
import { Overview } from "./sections/Overview";
import { Competencies } from "./sections/Competencies";
import { Products } from "./sections/Products";
import { Scorecard } from "./sections/Scorecard";
import { Roadmap } from "./sections/Roadmap";
import { Badges } from "./sections/Badges";
import { Overlays } from "./Overlays";
import { useTheme } from "@/lib/theme";
import type { TabKey } from "@/lib/nav";

export function Portal() {
  const { theme, isDark, toggle } = useTheme();
  const [tab, setTab] = useState<TabKey>("home");
  const [comp, setComp] = useState<string | null>(null);
  const [badgeIdx, setBadgeIdx] = useState<number | null>(null);
  const [quizLessonId, setQuizLessonId] = useState<string | null>(null);
  const [roadmapQuizLesson, setRoadmapQuizLesson] = useState<string | null>(
    null,
  );

  const go = useCallback((t: TabKey) => {
    setTab(t);
    setComp(null);
    setBadgeIdx(null);
    setQuizLessonId(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const startLearning = useCallback(() => {
    setTab("roadmap");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg-1)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Header tab={tab} onTab={go} isDark={isDark} onToggleTheme={toggle} />

      {tab === "home" && (
        <Overview onStartLearning={startLearning} onGoComp={() => go("competencies")} go={go} />
      )}
      {tab === "competencies" && (
        <Competencies onOpen={(code) => setComp(code)} />
      )}
      {tab === "products" && <Products />}
      {tab === "scorecards" && <Scorecard />}
      {tab === "roadmap" && (
        <Roadmap
          onOpenQuiz={() => setQuizLessonId(roadmapQuizLesson || "I1.1")}
          onLessonChange={(id) => setRoadmapQuizLesson(id)}
        />
      )}
      {tab === "badges" && (
        <Badges onSelect={(i) => setBadgeIdx(i)} />
      )}

      <Overlays
        compCode={comp}
        onCloseDrawer={() => setComp(null)}
        badgeIdx={badgeIdx}
        onCloseBadge={() => setBadgeIdx(null)}
        quizLessonId={quizLessonId}
        onCloseQuiz={() => setQuizLessonId(null)}
      />
    </div>
  );
}