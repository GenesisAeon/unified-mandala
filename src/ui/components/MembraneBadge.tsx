import React from "react";
import { FEATURES } from "../../config/featureFlags";

export function MembraneBadge({ A, sigil }: { A?: number; sigil: string }) {
  if (FEATURES.membrane !== "on") return null; // LowMem → kein Render
  return (
    <span title={A != null ? `A=${A.toFixed(2)} (monoton)` : "membrane"}>
      {sigil} {A != null ? <small style={{ opacity: 0.7 }}>A={A.toFixed(2)}</small> : null}
    </span>
  );
}
