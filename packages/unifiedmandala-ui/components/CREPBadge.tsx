import React from "react";

export interface CREPBadgeProps {
  score: number;
}

function color(score: number): string {
  if (score >= 0.9) return "#2e7d32"; // green
  if (score >= 0.75) return "#ed6c02"; // orange
  return "#c62828"; // red
}

export default function CREPBadge({ score }: CREPBadgeProps) {
  return (
    <span
      title="CREP"
      style={{
        backgroundColor: color(score),
        color: "#fff",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 12,
        minWidth: 40,
        textAlign: "center",
      }}
    >
      {score.toFixed(2)}
    </span>
  );
}
