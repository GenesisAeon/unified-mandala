import { classifyEmergence } from "../../utils/resonance";
export function EmergenceBadge({ value }: { value: number }) {
  const cls = classifyEmergence(value);
  const color = cls === "high" ? "bg-emerald-600"
              : cls === "medium" ? "bg-amber-500" : "bg-slate-500";
  return <span className={`px-2 py-0.5 rounded text-white ${color}`}>{cls}</span>;
}
