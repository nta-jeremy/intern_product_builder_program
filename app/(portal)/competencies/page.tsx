"use client";

import { Competencies } from "@/components/sections/Competencies";
import { usePortal } from "@/lib/portal-context";

export default function CompetenciesPage() {
  const { openComp } = usePortal();
  return <Competencies onOpen={openComp} />;
}
