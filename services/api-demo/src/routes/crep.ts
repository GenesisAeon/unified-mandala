import { Router } from "express";
import { evaluate } from "@um/crep";

const r = Router();

// POST /api/crep/resonance   body: { values: number[] }
r.post("/resonance", (req, res) => {
  const values = Array.isArray(req.body?.values) ? (req.body.values as number[]) : [];
  const result = evaluate(values.length ? values : [1, 1, 1, 1]); // fallback: equal bins
  res.json({ ...result, ts: new Date().toISOString(), source: values.length ? "user" : "fallback" });
});

// GET /api/crep/resonance?sample=era5|oisst|mixed
r.get("/resonance", (_req, res) => {
  const sample = String(_req.query.sample || "mixed");
  let values: number[];
  if (sample === "era5") values = [5, 2, 1, 0, 0, 0];
  else if (sample === "oisst") values = [3, 3, 2, 2, 1, 1];
  else values = [6, 3, 1, 1, 0, 0];
  const result = evaluate(values);
  res.json({ ...result, ts: new Date().toISOString(), source: `sample:${sample}` });
});

export default r;
