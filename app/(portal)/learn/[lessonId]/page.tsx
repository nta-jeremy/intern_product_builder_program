"use client";

import { useParams } from "next/navigation";
import { LessonI11 } from "@/components/sections/LessonI11";
import { LessonI12 } from "@/components/sections/LessonI12";
import { LessonI21 } from "@/components/sections/LessonI21";
import { LessonI22 } from "@/components/sections/LessonI22";
import { LessonI31 } from "@/components/sections/LessonI31";
import { LessonI32 } from "@/components/sections/LessonI32";
import { LessonI33 } from "@/components/sections/LessonI33";
import { LessonI41 } from "@/components/sections/LessonI41";
import { LessonI43 } from "@/components/sections/LessonI43";
import { LessonI51 } from "@/components/sections/LessonI51";
import { LessonI52 } from "@/components/sections/LessonI52";
import { LessonI53 } from "@/components/sections/LessonI53";
import { LessonI23 } from "@/components/sections/LessonI23";

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

  if (lessonId === "I3.1") {
    return (
      <div className="i31-surface">
        <LessonI31 />
      </div>
    );
  }

  if (lessonId === "I3.2") {
    return (
      <div className="i32-surface">
        <LessonI32 />
      </div>
    );
  }

  if (lessonId === "I2.3") {
    return (
      <div className="i23-surface">
        <LessonI23 />
      </div>
    );
  }

  if (lessonId === "I3.3") {
    return (
      <div className="i33-surface">
        <LessonI33 />
      </div>
    );
  }

  if (lessonId === "I4.1") {
    return (
      <div className="i41-surface">
        <LessonI41 />
      </div>
    );
  }

  if (lessonId === "I4.3") {
    return (
      <div className="i43-surface">
        <LessonI43 />
      </div>
    );
  }

  if (lessonId === "I5.1") {
    return (
      <div className="i51-surface">
        <LessonI51 />
      </div>
    );
  }

  if (lessonId === "I5.2") {
    return (
      <div className="i52-surface">
        <LessonI52 />
      </div>
    );
  }

  if (lessonId === "I5.3") {
    return (
      <div className="i53-surface">
        <LessonI53 />
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