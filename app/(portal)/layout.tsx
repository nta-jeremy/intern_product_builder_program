"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Overlays } from "@/components/Overlays";
import { PortalProvider, usePortal } from "@/lib/portal-context";

function PortalShell({ children }: { children: ReactNode }) {
  const {
    theme,
    comp,
    closeComp,
    badgeIdx,
    closeBadge,
    quizLessonId,
    closeQuiz,
  } = usePortal();

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
      <Header />
      {children}
      <Overlays
        compCode={comp}
        onCloseDrawer={closeComp}
        badgeIdx={badgeIdx}
        onCloseBadge={closeBadge}
        quizLessonId={quizLessonId}
        onCloseQuiz={closeQuiz}
      />
    </div>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <PortalProvider>
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  );
}
