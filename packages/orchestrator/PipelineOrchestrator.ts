import { readFileSync } from "fs";
import yaml from "yaml";

type Step = { id: string; uses: string; with?: Record<string, any> };
type Pipeline = { id: string; steps: Step[] };

export class PipelineOrchestrator {
  async run(file: string) {
    const p = yaml.parse(readFileSync(file, "utf8")) as Pipeline;
    console.log("[UM] Pipeline:", p.id);
    for (const s of p.steps) {
      console.log("  ·", s.id, "=>", s.uses);
      // Demo: call by convention (scripts/<uses>.ts) with args
      const mod = await import(`${process.cwd()}/scripts/${s.uses}.ts`).catch(() => null);
      if (mod && typeof (mod as any).default === "function") {
        await (mod as any).default(s.with || {});
      } else {
        console.log("    (stub) no-op");
      }
    }
  }
}
