"use client";

import { useRouter } from "next/navigation";
import { Overview } from "@/components/sections/Overview";

export default function HomePage() {
  const router = useRouter();
  return (
    <Overview
      onStartLearning={() => router.push("/learn-hub")}
      onGoComp={() => router.push("/competencies")}
    />
  );
}
