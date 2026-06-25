#!/usr/bin/env python3
"""
vr.ar build — single source of truth generator.

Reads the entity data in data/ and regenerates the derived blocks that are
marked with AUTOGEN sentinels in the source files. The live site is plain
static HTML/CSS/JS served by Cloudflare Pages; this script only rewrites the
data *between* the sentinel markers, never the surrounding code.

Design rules (Master Plan, right-sized):
  - data/ is the ONLY place a fact lives. Edit a price once, here.
  - The Finder's logic (QUESTIONS, EXCLUSION_MAP, OS_*, scoring, rendering)
    is NEVER touched. We only feed it the HEADSETS data object.
  - Output is committed to git, so a failed build can never break the live
    site: the last good committed output keeps serving.

Phase 1 (current): regenerates the HEADSETS object in assets/js/app.js.
Later phases will add: Product/ItemList JSON-LD, FAQ, sitemap, hreflang.

Usage:
    python3 build.py           # regenerate in place
    python3 build.py --check    # validate + fail if output would change (CI)

No third-party dependencies. Python 3.8+.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
HEADSETS_DIR = os.path.join(DATA, "headsets")

# Property order inside each HEADSETS entry (matches the hand-written source).
APP_JS = os.path.join(ROOT, "assets", "js", "app.js")


# ─────────────────────────────────────────────────────────────────────────────
# Load
# ─────────────────────────────────────────────────────────────────────────────
def load_site():
    with open(os.path.join(DATA, "site.json"), encoding="utf-8") as f:
        return json.load(f)


def load_headsets():
    out = {}
    for name in os.listdir(HEADSETS_DIR):
        if not name.endswith(".json") or name.startswith("_"):
            continue
        with open(os.path.join(HEADSETS_DIR, name), encoding="utf-8") as f:
            ent = json.load(f)
        out[ent["id"]] = ent
    return out


# ─────────────────────────────────────────────────────────────────────────────
# Validate — the safety guard. Fails loudly before writing anything.
# ─────────────────────────────────────────────────────────────────────────────
def validate(entities, site):
    errors = []
    orders = site["headset_order"]
    ids = set(entities)

    for which, order in orders.items():
        missing = [i for i in order if i not in ids]
        extra = [i for i in ids if i not in order]
        if missing:
            errors.append(f"site.json headset_order.{which} references unknown id(s): {missing}")
        if extra:
            errors.append(f"headset(s) {extra} missing from headset_order.{which}")

    for hid, e in entities.items():
        def need(cond, msg):
            if not cond:
                errors.append(f"[{hid}] {msg}")

        need(e.get("id") == hid, "id field must match filename")
        need(bool(e.get("name")), "missing name")
        need(bool(e.get("brand")), "missing brand")
        need(bool(e.get("product_id")), "missing product_id")
        need(bool(e.get("image")), "missing image")  # the exact error we shipped before
        nk = e.get("nickname", {})
        need(bool(nk.get("en")) and bool(nk.get("es")), "nickname needs both en + es")
        d = e.get("desc", {})
        need(bool(d.get("en")) and bool(d.get("es")), "desc needs both en + es")
        p = e.get("price", {})
        need(bool(p.get("label")), "price.label missing")
        need(bool(p.get("currency")), "price.currency missing")
        try:
            float(str(p.get("amount")))
        except (TypeError, ValueError):
            errors.append(f"[{hid}] price.amount is not numeric: {p.get('amount')!r}")
        need(bool(e.get("commerce", {}).get("url")), "commerce.url missing")

    if errors:
        raise SystemExit("BUILD FAILED — validation errors:\n  - " + "\n  - ".join(errors))


# ─────────────────────────────────────────────────────────────────────────────
# Render — JS string helpers
# ─────────────────────────────────────────────────────────────────────────────
def js_str(s):
    """Emit a JS string literal matching the project's source conventions:
    prefer double quotes; use single quotes when the value contains a double
    quote but no single quote (keeps nicknames clean, as in the source)."""
    if '"' in s and "'" not in s:
        return "'" + s.replace("\\", "\\\\") + "'"
    return json.dumps(s, ensure_ascii=False)


def render_headsets_block(order, entities):
    lines = ["const HEADSETS = {"]
    last = len(order) - 1
    for idx, hid in enumerate(order):
        e = entities[hid]
        c = e["commerce"]
        lines.append(f"  {hid}: {{")
        lines.append(f"    name: {js_str(e['name'])},")
        lines.append(
            f"    nickname_en: {js_str(e['nickname']['en'])}, "
            f"nickname_es: {js_str(e['nickname']['es'])},"
        )
        lines.append(f"    price: {js_str(e['price']['label'])},")
        lines.append(f"    desc_en: {js_str(e['desc']['en'])},")
        lines.append(f"    desc_es: {js_str(e['desc']['es'])},")
        lines.append(f"    link: {js_str(c['url'])},")
        if "link_note" in c:
            lines.append(f"    linkNote_en: {js_str(c['link_note']['en'])},")
            lines.append(f"    linkNote_es: {js_str(c['link_note']['es'])},")
        if "btn_label" in c:
            lines.append(f"    btnLabel_en: {js_str(c['btn_label']['en'])},")
            lines.append(f"    btnLabel_es: {js_str(c['btn_label']['es'])},")
        lines.append(f"    img: {js_str(e['image'])}")
        lines.append("  }" + ("," if idx != last else ""))
    lines.append("};")
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Inject — replace text between AUTOGEN sentinels, leave everything else alone
# ─────────────────────────────────────────────────────────────────────────────
def inject(path, marker, block):
    with open(path, encoding="utf-8") as f:
        src = f.read()
    start = f"// ─── AUTOGEN:{marker}"
    end = f"// ─── /AUTOGEN:{marker}"
    pat = re.compile(
        r"(" + re.escape(start) + r"[^\n]*\n)(.*?)(\n" + re.escape(end) + r")",
        re.DOTALL,
    )
    if not pat.search(src):
        raise SystemExit(f"BUILD FAILED — AUTOGEN:{marker} markers not found in {path}")
    new = pat.sub(lambda m: m.group(1) + block + m.group(3), src)
    changed = new != src
    return src, new, changed


# ─────────────────────────────────────────────────────────────────────────────
def main():
    check_only = "--check" in sys.argv
    site = load_site()
    entities = load_headsets()
    validate(entities, site)

    block = render_headsets_block(site["headset_order"]["finder"], entities)
    _, new, changed = inject(APP_JS, "HEADSETS", block)

    if check_only:
        if changed:
            raise SystemExit("--check: app.js HEADSETS block is OUT OF DATE (run build.py)")
        print("OK  app.js HEADSETS block is up to date")
        return

    if changed:
        with open(APP_JS, "w", encoding="utf-8") as f:
            f.write(new)
        print(f"updated  {os.path.relpath(APP_JS, ROOT)}  (HEADSETS regenerated)")
    else:
        print(f"unchanged  {os.path.relpath(APP_JS, ROOT)}  (HEADSETS already current)")

    print(f"validated {len(entities)} headsets, all checks passed")


if __name__ == "__main__":
    main()
