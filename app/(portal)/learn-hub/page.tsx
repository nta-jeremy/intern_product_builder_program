"use client";

import { Suspense } from "react";
import { LearnHub } from "@/components/sections/LearnHub";

export default function LearnHubPage() {
  return (
    <Suspense fallback={null}>
      <LearnHub />
    </Suspense>
  );
}
