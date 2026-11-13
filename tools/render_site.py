#!/usr/bin/env python3
"""Rende il sito statico per GitHub Pages: copia SRC in DST e sostituisce i segnaposto {{SELLER_*}}
con i dati del venditore letti da SELLER_JSON (variabile d'ambiente, da GitHub secret) oppure --json FILE.
Uso: python3 tools/render_site.py SRC DST [--json FILE]
Campi JSON: legal_name, street, postal_code, city, province, country, email, phone, price_tax_statement.
Non stampa mai i valori. Exit 1 (e DST non utilizzabile) se manca un campo o resta un segnaposto."""
import html, json, os, pathlib, re, shutil, sys

TOKENS = {"SELLER_LEGAL_NAME": "legal_name", "SELLER_STREET": "street", "SELLER_POSTAL_CODE": "postal_code",
          "SELLER_CITY": "city", "SELLER_PROVINCE": "province", "SELLER_COUNTRY": "country",
          "SELLER_EMAIL": "email", "SELLER_PHONE_REQUIRED": "phone", "PRICE_TAX_STATEMENT": "price_tax_statement"}
EXCLUDE = {".git", ".github", "tools", "_site", "README.md"}
PLACEHOLDER = re.compile(r"\{\{([A-Z_]+)\}\}")


def load_values(json_path=None, env=os.environ):
    raw = pathlib.Path(json_path).read_text(encoding="utf-8") if json_path else env.get("SELLER_JSON", "")
    if not raw.strip():
        return {}
    data = json.loads(raw)
    return {tok: str(data.get(field, "")).strip() for tok, field in TOKENS.items()}


def render_text(text, values):
    missing = set()

    def sub(m):
        v = values.get(m.group(1), "")
        if not v:
            missing.add(m.group(1))
            return m.group(0)
        return html.escape(v, quote=True)
    return PLACEHOLDER.sub(sub, text), sorted(missing)


def build(src, dst, values):
    src, dst = pathlib.Path(src), pathlib.Path(dst)
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=lambda d, names: [n for n in names if n in EXCLUDE and pathlib.Path(d) == src])
    rendered, errors = 0, []
    for p in dst.rglob("*.html"):
        text = p.read_text(encoding="utf-8")
        if not PLACEHOLDER.search(text):
            continue
        out, missing = render_text(text, values)
        if missing:
            errors.append(f"{p.relative_to(dst)}: campi mancanti {', '.join(missing)}")
        elif PLACEHOLDER.search(out):
            errors.append(f"{p.relative_to(dst)}: segnaposto residuo")
        else:
            p.write_text(out, encoding="utf-8")
            rendered += 1
    for p in dst.rglob("*"):
        if p.is_file() and p.suffix in {".html", ".xml", ".txt", ".js", ".json", ".csv"}:
            if PLACEHOLDER.search(p.read_text(encoding="utf-8", errors="ignore")) and f"{p.relative_to(dst)}" not in " ".join(errors):
                errors.append(f"{p.relative_to(dst)}: segnaposto non reso")
    return rendered, errors


def main(argv):
    args = argv[1:]
    json_path = None
    if "--json" in args:
        i = args.index("--json")
        json_path = args[i + 1]
        del args[i:i + 2]
    if len(args) != 2:
        print(__doc__.splitlines()[0]); return 2
    try:
        values = load_values(json_path)
    except (OSError, ValueError) as e:
        print(f"ERRORE: dati venditore non leggibili ({type(e).__name__})"); return 1
    rendered, errors = build(args[0], args[1], values)
    if errors:
        for e in errors:
            print("ERRORE:", e)
        shutil.rmtree(args[1], ignore_errors=True)
        return 1
    print(f"RENDER OK: {rendered} file con segnaposto resi in {args[1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
