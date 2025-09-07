import { emit, on } from "../packages/mandala-sdk/ts/index.js";

(async () => {
  let threw = false;
  try {
    await emit("governance.override", {op:"force"}, { personhood: "P1" as any });
  } catch(e:any) {
    threw = /Personhood gate/.test(e.message);
    console.log("gate threw:", e.message);
  }
  if (!threw) { console.error("Gate did not throw on insufficient level!"); process.exit(1); }
  console.log("OK: gate throws for governance.override @ P1");
})().catch(e=>{ console.error(e); process.exit(1); });
