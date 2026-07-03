"use client";

import { Badges } from "@/components/sections/Badges";
import { usePortal } from "@/lib/portal-context";

export default function BadgesPage() {
  const { openBadge } = usePortal();
  return <Badges onSelect={openBadge} />;
}
