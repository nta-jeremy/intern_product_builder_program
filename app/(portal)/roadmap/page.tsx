"use client";

import { Roadmap } from "@/components/sections/Roadmap";
import { usePortal } from "@/lib/portal-context";

export default function RoadmapPage() {
  const { openQuiz, setRoadmapQuizLesson, roadmapQuizLesson } = usePortal();
  return (
    <Roadmap
      onOpenQuiz={() => openQuiz(roadmapQuizLesson || "I1.1")}
      onLessonChange={setRoadmapQuizLesson}
    />
  );
}
