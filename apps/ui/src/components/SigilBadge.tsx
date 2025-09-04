type MapCfg = Record<string, { label?: string }>;
export default function SigilBadge({ sigil, map }: { sigil?: string; map?: MapCfg }) {
  if (!sigil) return null;
  const label = map?.[sigil]?.label || "";
  return <span style={{ fontSize: 18, padding: "2px 6px", borderRadius: 6, background: "#f1f1f1" }} title={label}>{sigil}</span>;
}
