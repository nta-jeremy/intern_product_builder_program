#!/usr/bin/env python3
"""Extract fonts, CSS tokens, and data from the bundled HTML portal.

Reads:  public/demo/Intern Product Builder Portal (standalone).html
Writes:
  public/fonts/<family>-<weight>-<style>[.<short-uuid>].<ext>   (37 font files)
  styles/font-face-raw.css    (style block #1 verbatim, @font-face only)
  styles/globals.raw.css      (style block #2 verbatim, tokens + component CSS)
  lib/data.raw.ts             (16 const from text/x-dc script, wrapped export const)
  reports/phase-01-asset-map.json  (UUID -> {filename, family, weight, style, fmt, mime, compressed})
"""
from __future__ import annotations
import base64
import gzip
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "public/demo/Intern Product Builder Portal (standalone).html"
FONTS_DIR = ROOT / "public/fonts"
STYLES_DIR = ROOT / "styles"
LIB_DIR = ROOT / "lib"
REPORTS_DIR = ROOT / "plans/260703-1214-nextjs-port/reports"


def read_manifest(html: str) -> dict:
    m = re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.S)
    if not m:
        sys.exit("manifest not found")
    return json.loads(m.group(1))


def read_template(html: str) -> str:
    m = re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.S)
    if not m:
        sys.exit("template not found")
    raw = m.group(1).strip()
    # template is a JSON string; strip leading/trailing quotes and unescape
    if raw.startswith('"') and raw.endswith('"'):
        raw = json.loads(raw)
    return raw


def decode_entry(entry: dict) -> bytes:
    data = entry["data"]
    if entry.get("compressed"):
        return gzip.decompress(base64.b64decode(data))
    return base64.b64decode(data)


def is_font(mime: str) -> bool:
    return mime.startswith("font/") or "woff" in mime or "ttf" in mime or "otf" in mime


def is_js(mime: str) -> bool:
    return mime == "text/javascript" or "javascript" in mime


def parse_font_face_block(css: str) -> dict:
    """Parse @font-face rules → {uuid: {family, weight, style, fmt}}."""
    out = {}
    for m in re.finditer(
        r"@font-face\s*\{([^}]*)\}", css, re.S
    ):
        body = m.group(1)
        fam_m = re.search(r"font-family:\s*['\"]?([^;\"']+)['\"]?", body)
        wt_m = re.search(r"font-weight:\s*([^;]+);", body)
        st_m = re.search(r"font-style:\s*([^;]+);", body)
        url_m = re.search(r'src:\s*url\(["\']?([0-9a-f-]{36})["\']?\)', body)
        fmt_m = re.search(r"format\(['\"]([^'\"]+)['\"]\)", body)
        if not (fam_m and url_m):
            continue
        fam = fam_m.group(1).strip()
        wt = (wt_m.group(1).strip() if wt_m else "400")
        st = (st_m.group(1).strip() if st_m else "normal")
        fmt = (fmt_m.group(1).strip() if fmt_m else "woff2")
        out[url_m.group(1)] = {
            "family": fam,
            "weight": wt,
            "style": st,
            "fmt": fmt,
        }
    return out


def slug_family(family: str) -> str:
    s = family.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def ext_for_fmt(fmt: str) -> str:
    return {"woff2": "woff2", "woff": "woff", "truetype": "ttf", "opentype": "otf"}.get(
        fmt, fmt
    )


def short_uuid(uuid: str) -> str:
    return uuid.split("-")[0]


def split_styles_and_script(template: str) -> tuple[str, str, str]:
    """Return (style1_fontface, style2_tokens, xdc_script_text)."""
    xdc_m = re.search(r"<x-dc>(.*?)</x-dc>", template, re.S)
    if not xdc_m:
        sys.exit("<x-dc> not found in template")
    xdc = xdc_m.group(1)

    # The first <style> inside <helmet> is @font-face; the second is tokens.
    styles = re.findall(r"<style>(.*?)</style>", xdc, re.S)
    if len(styles) < 2:
        sys.exit(f"expected >=2 <style> blocks, found {len(styles)}")
    style1 = styles[0]
    style2 = styles[1]

    # The data script is OUTSIDE <x-dc>, after it, with type="text/x-dc"
    script_m = re.search(
        r'<script type="text/x-dc"[^>]*>(.*?)</script>', template, re.S
    )
    if not script_m:
        sys.exit("text/x-dc script not found")
    return style1, style2, script_m.group(1)


CONST_NAMES = [
    "LEVEL_LABELS",
    "LEVEL_MULT",
    "LEVEL_DESC",
    "LADDER",
    "COMPS",
    "PRODUCTS",
    "SC_ENTRY",
    "SC_FINAL",
    "FINAL_SEGS",
    "GATE_TEXT",
    "ROADMAP",
    "ANCHORS",
    "BADGES",
    "P",
    "q",
    "LESSONS",
]


def wrap_consts_to_ts(script: str) -> str:
    """Wrap each `const NAME = ...` (top-level) into `export const NAME = ...;`."""
    out = script
    for name in CONST_NAMES:
        # match `const NAME =` or `const NAME=` possibly with whitespace
        pattern = re.compile(r"\bconst\s+" + re.escape(name) + r"\s*=")
        out = pattern.sub(f"export const {name} =", out)
    return out


def main() -> None:
    html = HTML.read_text(encoding="utf-8")
    manifest = read_manifest(html)
    template = read_template(html)

    style1, style2, xdc_script = split_styles_and_script(template)
    ff_map = parse_font_face_block(style1)

    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    STYLES_DIR.mkdir(parents=True, exist_ok=True)
    LIB_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    asset_map: dict[str, dict] = {}
    used_filenames: set[str] = set()
    font_count = 0

    for uuid, entry in manifest.items():
        mime = entry.get("mime", "")
        if is_js(mime):
            # skip DC engine + DS registry JS
            continue
        if not is_font(mime):
            continue

        meta = ff_map.get(uuid, {})
        family = meta.get("family", "unknown")
        weight = meta.get("weight", "400")
        style = meta.get("style", "normal")
        fmt = meta.get("fmt", "woff2")
        ext = ext_for_fmt(fmt)

        base = f"{slug_family(family)}-{weight}-{style}"
        fname = f"{base}.{ext}"
        if fname in used_filenames:
            fname = f"{base}-{short_uuid(uuid)}.{ext}"
        used_filenames.add(fname)

        blob = decode_entry(entry)
        (FONTS_DIR / fname).write_bytes(blob)
        font_count += 1

        asset_map[uuid] = {
            "filename": fname,
            "family": family,
            "weight": weight,
            "style": style,
            "fmt": fmt,
            "mime": mime,
            "compressed": entry.get("compressed", False),
            "bytes": len(blob),
        }

    # also record JS entries (for completeness) without writing files
    for uuid, entry in manifest.items():
        if is_js(entry.get("mime", "")):
            asset_map[uuid] = {
                "filename": None,
                "kind": "js",
                "mime": entry["mime"],
                "compressed": entry.get("compressed", False),
            }

    (STYLES_DIR / "font-face-raw.css").write_text(style1, encoding="utf-8")
    (STYLES_DIR / "globals.raw.css").write_text(style2, encoding="utf-8")

    ts_body = wrap_consts_to_ts(xdc_script)
    (LIB_DIR / "data.raw.ts").write_text(ts_body, encoding="utf-8")

    (REPORTS_DIR / "phase-01-asset-map.json").write_text(
        json.dumps(asset_map, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print(f"fonts extracted: {font_count}")
    print(f"asset_map entries: {len(asset_map)}")
    print(f"@font-face rules parsed: {len(ff_map)}")
    print("wrote: styles/font-face-raw.css, styles/globals.raw.css, lib/data.raw.ts")
    print("wrote: reports/phase-01-asset-map.json")


if __name__ == "__main__":
    main()