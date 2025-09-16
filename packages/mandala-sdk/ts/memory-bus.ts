import { BusTransport, EmitOptions } from "./transport.js";
import { validateEvent, checkPersonhood } from "./util.js";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c=="x" ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

const handlers = new Map<string, Array<(e:any)=>void>>();

export class MemoryBus implements BusTransport {
  async emit(topic: string, payload: any, options?: EmitOptions): Promise<void> {
    checkPersonhood(topic, options?.personhood);
    const evt = {
      id: uuid(),
      topic,
      actor: options?.actor || { id: "system", role: "agent" },
      ts: new Date().toISOString(),
      personhood: options?.personhood,
      payload
    };
    validateEvent(evt);
    (handlers.get(topic)||[]).forEach(fn => fn(evt));
  }
  on(topic: string, handler: (evt: any)=>void): void {
    const list = handlers.get(topic) || [];
    list.push(handler); handlers.set(topic, list);
  }
}
