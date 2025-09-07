import { MemoryBus } from "../packages/mandala-sdk/ts/memory-bus.ts";
import { NatsBus } from "../packages/mandala-sdk/ts/nats-bus.ts";

const mode = process.env.BUS_MODE || "memory";
const bus = mode==="nats" ? new NatsBus() : new MemoryBus();

bus.on("demo.hello", (evt:any)=> console.log("[sub] received:", evt.topic, evt.id));

(async () => {
  try {
    await bus.emit("demo.hello", { msg: "world" }, { personhood: "P2" as any });
    let threw = false;
    try {
      await bus.emit("governance.override", { op: "force" }, { personhood: "P1" as any });
    } catch(e:any) {
      threw = /requires/.test(e.message); console.log("gate ok:", e.message);
    }
    if (!threw) { console.error("Gate failed!"); process.exit(1); }
    console.log("SMOKE OK – mode:", mode);
  } catch(e) {
    console.error(e); process.exit(1);
  }
})();
