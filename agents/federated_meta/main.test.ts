import assert from "assert";
import { aggregateMetrics } from "./main";

const aggregated = aggregateMetrics([
  { instance: "alpha", count: 3 },
  { instance: "beta", count: 5 },
  { instance: "alpha", count: 2 }
]);

assert.deepStrictEqual(aggregated, { alpha: 5, beta: 5 });
