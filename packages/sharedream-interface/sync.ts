import sigillin from "../unifiedmandala-ui/data/sigillin_nodes.json";
import { getCREPState } from "../crep-engine/CREPEvaluator";

export function syncSharedream() {
  return {
    sigillin,
    crepStates: sigillin.map(s => ({
      id: s.id,
      status: getCREPState(s.crep)
    }))
  };
}
