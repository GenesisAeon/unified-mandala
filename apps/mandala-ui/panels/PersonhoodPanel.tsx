import React, { useEffect, useState } from "react";

type Hit = { idx:number; when:string; author:string; channel:string; keywords:string; preview:string };

export default function PersonhoodPanel() {
  const [hits, setHits] = useState<Hit[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    // Minimal: erwartet, dass ein kleiner API-Proxy out/personhood_hits.csv liefert
    // Alternativ: GitHub Raw URL eintragen (read-only)
    fetch("/out/personhood_hits.csv")
      .then(r => r.text())
      .then(t => {
        const lines = t.trim().split("\n").slice(1);
        const rows = lines.map((line) => {
          const [idx, when, author, channel, keywords, preview] = line.split("\t");
          return { idx:+idx, when, author, channel, keywords, preview };
        });
        setHits(rows);
      })
      .catch(() => setHits([]));
  }, []);

  const filtered = hits.filter(h =>
    !q ||
    h.preview.toLowerCase().includes(q.toLowerCase()) ||
    h.keywords.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Personhood – Conversation Hits</h2>
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Suche in keywords/preview…"
        className="border rounded px-3 py-2 mb-3 w-full"
      />
      <div className="space-y-3">
        {filtered.slice(0,200).map(h => (
          <div key={h.idx} className="border rounded p-3">
            <div className="text-sm text-gray-600">{h.when} · {h.channel} · {h.author}</div>
            <div className="font-medium">#{h.idx} — {h.keywords}</div>
            <div className="mt-1">{h.preview} …</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-gray-500">Keine Treffer (noch).</div>}
      </div>
    </div>
  );
}
