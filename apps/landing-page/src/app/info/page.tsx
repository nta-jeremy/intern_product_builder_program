import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import "./info-page.css";
import { ClientScripts } from "./client-scripts";

export const metadata: Metadata = {
  title: "YODY Intern Product Builder — Chương Trình 3 Tháng Thực Chiến",
  description:
    "YODY Intern Product Builder — chương trình thực tập 3 tháng xây dựng 4 sản phẩm thực tế với AI-First, Vibe Coding và Ship Fast. Tuyển dụng, QC, Thẩm định, Báo cáo.",
  openGraph: {
    title: "YODY Intern Product Builder — Chương Trình 3 Tháng Thực Chiến",
    description:
      "Chương trình thực tập 3 tháng xây dựng 4 sản phẩm thực tế với AI-First, Vibe Coding và Ship Fast.",
    type: "website",
  },
};

export const dynamic = "force-static";

export default function InfoPage() {
  const htmlPath = join(process.cwd(), "public", "info", "index.html");
  let html = readFileSync(htmlPath, "utf-8");

  // Remove inline scripts (we'll handle them in ClientScripts)
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove stylesheet link (we import CSS via Next.js)
  html = html.replace(/<link[^>]*?styles\.css[^>]*?>/gi, "");

  // Extract only the body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;

  return (
    <div className="info-page-layout">
      <ClientScripts />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
