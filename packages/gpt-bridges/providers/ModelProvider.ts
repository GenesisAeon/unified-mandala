export interface ModelProvider {
  /** Unique name of the provider (e.g. `ollama`, `tgi`, `vllm`). */
  name: string;
  /**
   * Generate a completion for a given prompt using the provider implementation.
   * @param model - Model identifier recognised by the provider
   * @param prompt - Text prompt to generate from
   */
  generate(model: string, prompt: string): Promise<string>;
}
