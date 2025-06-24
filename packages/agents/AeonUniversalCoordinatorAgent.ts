import { Agent, Task } from "../core/interfaces";
import { withFSM } from "../core/fsmMixin";
import { AeonTranspilerAgent } from "./AeonTranspilerAgent";
import { AeonPythonTranspilerAgent } from "./AeonPythonTranspilerAgent";
import { AeonGoTranspilerAgent } from "./AeonGoTranspilerAgent";

export class AeonUniversalCoordinatorAgent implements Agent {
  id = "AeonUniversalCoordinator";
  layer: "Aeon" = "Aeon";
  private tsAgent: AeonTranspilerAgent;
  private pyAgent: AeonPythonTranspilerAgent;
  private goAgent: AeonGoTranspilerAgent;

  constructor(
    tsOut = "aeon-output.ts",
    pyOut = "aeon-output.py",
    goOut = "aeon-output.go",
  ) {
    this.tsAgent = new AeonTranspilerAgent(tsOut);
    this.pyAgent = new AeonPythonTranspilerAgent(pyOut);
    this.goAgent = new AeonGoTranspilerAgent(goOut);
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    await this.tsAgent.handle(task);
    await this.pyAgent.handle(task);
    await this.goAgent.handle(task);
  }
}
