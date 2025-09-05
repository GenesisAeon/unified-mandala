import mitt from "mitt";
import type { Redis } from "ioredis";
type Events = {
  "agent.event": { agent: string; kind: string; payload?: any };
  "kpi.update": { id: string; value: number; ts: string };
};
export const bus = mitt<Events>();
export function bridgeRedis(sub: Redis, pub: Redis, channel = "um:bus") {
  sub.subscribe(channel, (err)=>{ if (err) console.error("redis sub error", err); });
  sub.on("message", (_ch, msg) => {
    try { const e = JSON.parse(msg); bus.emit(e.type as any, e.data); } catch {}
  });
  bus.on("agent.event", (data)=> pub.publish(channel, JSON.stringify({ type:"agent.event", data })));
  bus.on("kpi.update", (data)=> pub.publish(channel, JSON.stringify({ type:"kpi.update", data })));
  return () => { sub.unsubscribe(channel); };
}
