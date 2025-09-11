export function calculateMetrics(s, total) {
  const cd = (s.connections?.length ?? 0) / Math.max(total, 1);
  const ep = (s.crep?.parts?.emergence ?? 0) * cd;
  const lifecycle = s.phase === "canonical" ? "production" : "beta";
  return { connectionDensity: cd, emergencePotential: ep, lifecycle };
}
