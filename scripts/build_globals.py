#!/usr/bin/env python3
"""Phase 03 — Build production styles/globals.css from raw extracts.

- Reads styles/globals.raw.css (style block #1: @font-face + :root + surfaces + components)
- Reads the 3rd <style> block (dark theme + keyframes) directly from the HTML template
- Reads reports/phase-01-asset-map.json (UUID -> filename)
- Rewrites every url("<uuid>") -> url("/fonts/<filename>")
- Concatenates: shadcn tailwind imports + @font-face + tokens + surfaces + components + dark theme + keyframes + hover utilities
- Writes styles/globals.css (production)
"""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "public/demo/Intern Product Builder Portal (standalone).html"
RAW = ROOT / "styles/globals.raw.css"
ASSET_MAP = ROOT / "plans/260703-1214-nextjs-port/reports/phase-01-asset-map.json"
OUT = ROOT / "styles/globals.css"


def read_template_styles(html: str) -> list[str]:
    m = re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.S)
    raw = m.group(1).strip()
    if raw.startswith('"'):
        raw = json.loads(raw)
    return re.findall(r"<style>(.*?)</style>", raw, re.S)


def main() -> None:
    html = HTML.read_text(encoding="utf-8")
    styles = read_template_styles(html)
    assert len(styles) >= 3, f"expected >=3 style blocks, got {len(styles)}"
    dark_block = styles[2]

    raw = RAW.read_text(encoding="utf-8")
    asset_map = json.loads(ASSET_MAP.read_text(encoding="utf-8"))

    # Build UUID -> /fonts/<filename> replace map (only font entries)
    replace = {}
    for uuid, meta in asset_map.items():
        fn = meta.get("filename")
        if fn:
            replace[uuid] = f"/fonts/{fn}"

    # Rewrite url("<uuid>") -> url("/fonts/<filename>")
    def repl(m: re.Match) -> str:
        uuid = m.group(1)
        path = replace.get(uuid)
        if not path:
            return m.group(0)
        return f'url("{path}")'

    raw_fixed = re.sub(r'url\("([0-9a-f-]{36})"\)', repl, raw)

    # Sanity: no UUIDs left
    leaks = re.findall(r'url\("[0-9a-f-]{36}"\)', raw_fixed)
    if leaks:
        raise SystemExit(f"unresolved UUIDs: {leaks[:5]}")

    # Hover utilities (11 unique style-hover values, 8 static + 3 dynamic)
    hover_utilities = """
/* ─────────────────────────────────────────────────────────
   style-hover utilities (ported from x-dc style-hover attr)
   Static variants — applied via className on hoverable elements.
   Dynamic variants use CSS vars set inline: style={{ '--hov-border': r.tone }}
   ───────────────────────────────────────────────────────── */
.hov-bg-2:hover { background: var(--bg-2); }
.hov-bg-muted:hover { background: var(--bg-muted); color: var(--nav-ink); }
.hov-border:hover { border-color: var(--border-hover); }
.hov-border-ink:hover { border-color: var(--border-hover); color: var(--nav-ink); }
.hov-iris:hover { border-color: var(--iris); }
.hov-underline:hover { text-decoration: underline; }
.hov-lift-md:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.hov-lift-md-border:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--border-hover); }
.hov-lift-sm-x:hover { transform: translateX(3px); box-shadow: var(--shadow-md); }
.hov-lift-sm-x-dyn:hover { transform: translateX(3px); box-shadow: var(--shadow-md); border-color: var(--hov-border); }
.hov-lift-md-dyn:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--hov-border); }
.hov-lift-lg-dyn:hover { transform: translateY(-5px); box-shadow: var(--hov-shadow); border-color: var(--hov-border); }
"""

    # Preserve shadcn imports that were added by `shadcn init` at top of app/globals.css.
    # We move the entire YODY system into styles/globals.css and import it from app/globals.css.
    body = (
        "/* ════════════════════════════════════════════════════════════════════\n"
        "   YODY Design System — production globals (ported from bundled HTML)\n"
        "   Source of truth: public/demo/Intern Product Builder Portal (standalone).html\n"
        "   ════════════════════════════════════════════════════════════════════ */\n\n"
        + raw_fixed
        + "\n\n/* ─── Dark theme + motion (style block #3) ─── */\n"
        + dark_block
        + hover_utilities
    )

    OUT.write_text(body, encoding="utf-8")
    print(f"wrote {OUT} ({len(body)} bytes)")
    print(f"uuid leaks: {len(leaks)}")


if __name__ == "__main__":
    main()