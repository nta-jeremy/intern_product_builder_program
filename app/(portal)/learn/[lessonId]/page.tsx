"use client";

import { useParams } from "next/navigation";
import { LessonI11 } from "@/components/sections/LessonI11";
import { LessonI12 } from "@/components/sections/LessonI12";
import { LessonI21 } from "@/components/sections/LessonI21";
import { LessonI22 } from "@/components/sections/LessonI22";

export default function LearnPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;

  if (lessonId === "I1.1") {
    return (
      <div className="i11-surface">
        <LessonI11 />
      </div>
    );
  }

  if (lessonId === "I1.2") {
    return (
      <div className="i12-surface">
        <LessonI12 />
      </div>
    );
  }

  if (lessonId === "I2.1") {
    return (
      <div className="i21-surface">
        <LessonI21 />
      </div>
    );
  }

  if (lessonId === "I2.2") {
    return (
      <div className="i22-surface">
        <LessonI22 />
      </div>
    );
  }

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "clamp(60px,8vw,120px) 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <span className="s-eyebrow iris">Coming soon</span>
      <h2
        style={{
          font: "800 clamp(32px,4vw,48px)/1.1 var(--font-impact)",
          letterSpacing: "-.02em",
          margin: "18px 0 12px",
          color: "var(--fg-1)",
        }}
      >
        Buổi {lessonId} đang được chuẩn bị
      </h2>
      <p style={{ font: "400 17px/1.6 var(--font-body)", color: "var(--fg-2)" }}>
        Nội dung buổi học sẽ có sớm. Quay lại sau nhé.
      </p>
    </main>
  );
}