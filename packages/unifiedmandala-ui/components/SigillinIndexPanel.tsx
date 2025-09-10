import React, { useEffect, useMemo, useState } from "react";
import CREPBadge from "./CREPBadge";

type SigilEntry = {
  id: string;
  title?: string;
  tags?: string[];
  crep?: { score?: number };
  path?: string;
  summary?: string;
};

export default function SigillinIndexPanel() {
  const [data, setData] = useState<SigilEntry[]>([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    // passe den Pfad an deinen Output an (z.B. out/sigillin_index.json)
    fetch("/out/sigillin_index.json")
      .then(r => r.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    data.forEach(d => (d.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return data.filter(d => {
      const qHit =
        !qq ||
        (d.title && d.title.toLowerCase().includes(qq)) ||
        (d.summary && d.summary.toLowerCase().includes(qq)) ||
        (d.id && d.id.toLowerCase().includes(qq));
      const tHit = !tag || (d.tags || []).includes(tag);
      return qHit && tHit;
    });
  }, [data, q, tag]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h3>Sigillin Index</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Suche (Titel, ID, Summary)…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={tag} onChange={e => setTag(e.target.value)}>
          <option value="">Alle Tags</option>
          {tags.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {filtered.map(d => (
          <div
            key={d.id}
            style={{ padding: 8, border: "1px solid #333", borderRadius: 8 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <strong>{d.title || d.id}</strong>
              <CREPBadge score={d.crep?.score} />
            </div>
            {d.summary && (
              <div style={{ opacity: 0.85, marginTop: 4 }}>{d.summary}</div>
            )}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {(d.tags || []).map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    border: "1px solid #555",
                    padding: "2px 6px",
                    borderRadius: 12,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            {d.path && (
              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                {d.path}
              </div>
            )}
          </div>
        ))}
        {!filtered.length && (
          <div style={{ opacity: 0.7 }}>Keine Einträge.</div>
        )}
      </div>
    </div>
  );
}
