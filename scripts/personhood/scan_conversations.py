from __future__ import annotations
import json, re, sys, csv, pathlib
from typing import List, Dict

KEYWORDS = [
    "personhood",
    "legal person",
    "rights of nature",
    "river rights",
    "tree rights",
    "juristische person",
    "legal personhood",
    "mensch oder maschine",
    "human or machine",
]

RX: Dict[str, re.Pattern[str]] = {
    "rightsOfNature": re.compile(r"(rights?\s+of\s+nature|tree\s+rights?|river\s+rights?)", re.I),
    "legalPerson": re.compile(r"(legal\s+person(hood)?|juristische\s+person)", re.I),
    "humanMachine": re.compile(r"(mensch[-\s]?oder[-\s]?maschine|human\s+or\s+machine|isHuman)", re.I),
    "similarity": re.compile(r"(similarit(y|ies)|analogy|precedent|case\s+law|vergleich(bar)?|ähnlich(keit)?)", re.I),
}

def extract_text(item: Dict[str, object]) -> str:
    for key in ("text", "message", "content"):
        val = item.get(key)
        if isinstance(val, str):
            return val
    return ""

def find_keywords(text: str) -> List[str]:
    hits = [k for k in KEYWORDS if k.lower() in text.lower()]
    for name, rx in RX.items():
        if rx.search(text):
            hits.append(name)
    return list(dict.fromkeys(hits))

def main() -> None:
    dir = sys.argv[1] if len(sys.argv) > 1 else "fraktalrun"
    hits: List[List[str]] = []
    idx = 0
    for p in pathlib.Path(dir).glob("*.json*"):
        lines = p.read_text(encoding="utf8").strip().splitlines()
        items = [json.loads(line) for line in lines if line.strip()]
        for item in items:
            text = extract_text(item)
            kws = find_keywords(text)
            if kws:
                hits.append([
                    str(idx),
                    str(item.get("when", "")),
                    str(item.get("author", "")),
                    str(item.get("channel", "")),
                    ",".join(kws),
                    text[:80],
                ])
                idx += 1
    out_dir = pathlib.Path("out")
    out_dir.mkdir(exist_ok=True)
    with (out_dir / "personhood_hits.csv").open("w", encoding="utf8", newline="") as f:
        writer = csv.writer(f, delimiter="\t")
        writer.writerow(["idx","when","author","channel","keywords","preview"])
        writer.writerows(hits)
    with (out_dir / "personhood_hits.md").open("w", encoding="utf8") as f:
        for r in hits:
            f.write(f"- {r[1]} {r[2]} {r[4]} — {r[5]}\n")
    print(f"wrote {len(hits)} hits")

if __name__ == "__main__":
    main()
