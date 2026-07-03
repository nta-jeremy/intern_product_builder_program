"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navStyle } from "@/lib/nav";
import { usePortal } from "@/lib/portal-context";

const navBtn: CSSProperties = { border: "none", textDecoration: "none" };

interface NavItem {
  href: string;
  match: string;
  label: string;
  icon: React.ReactNode;
}

function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}
function CompetenciesIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function ProductsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
function ScorecardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
function RoadmapIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  );
}
function BadgesIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}

const NAV: NavItem[] = [
  { href: "/", match: "/", label: "Tổng quan", icon: <HomeIcon /> },
  { href: "/competencies", match: "/competencies", label: "Khung năng lực", icon: <CompetenciesIcon /> },
  { href: "/projects", match: "/projects", label: "Dự án thực chiến", icon: <ProductsIcon /> },
  { href: "/scorecard", match: "/scorecard", label: "Scorecard", icon: <ScorecardIcon /> },
  { href: "/roadmap", match: "/roadmap", label: "Lộ trình & Học", icon: <RoadmapIcon /> },
  { href: "/badges", match: "/badges", label: "Huy hiệu", icon: <BadgesIcon /> },
];

export function Header() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = usePortal();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "22px",
        flexWrap: "wrap",
        padding: "13px 26px",
        background: "var(--glass)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link
        href="/"
        aria-label="Về trang chủ"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: "max-content",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#ffb524",
            display: "grid",
            placeItems: "center",
            boxShadow: "var(--shadow-brand)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/yody-logo.webp"
            alt="YODY logo"
            width={42}
            height={42}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <div
            style={{
              font: "800 17px/1 var(--font-brand)",
              letterSpacing: "-.02em",
              color: "var(--nav-ink)",
            }}
          >
            YODY <span style={{ color: "var(--gold-deep)" }}>ITDX</span>
          </div>
          <div
            style={{
              font: "600 10.5px/1.4 var(--font-mono)",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              marginTop: "3px",
            }}
          >
            Intern Product Builder Portal
          </div>
        </div>
      </Link>

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "5px",
          overflowX: "auto",
          flex: 1,
          padding: "3px",
          minWidth: 0,
          scrollbarWidth: "none",
        }}
      >
        {NAV.map((item) => {
          const active = item.match === "/" ? pathname === "/" : pathname.startsWith(item.match);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ ...navBtn, ...navStyle(active) }}
              className="hov-bg-muted"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleTheme}
        aria-label="Đổi giao diện"
        className="hov-border-ink"
        style={{
          width: "44px",
          height: "44px",
          minWidth: "44px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--fg-2)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
      >
        {isDark ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>
    </header>
  );
}
