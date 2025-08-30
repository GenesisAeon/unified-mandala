import type { Agent, AgentHealth, AgentContext } from "../_shared/types";

const EchoAgent: Agent<any, any> = {
  id: "echo",
  async health(): Promise<AgentHealth> {
    return { id: "echo", ok: true };
  },
  async run(input: any, _ctx: AgentContext): Promise<any> {
    return { echo: input };
  }
};

export default EchoAgent;
