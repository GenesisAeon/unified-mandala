import { ModelProvider } from '../providers/ModelProvider';
import { OllamaProvider } from '../providers/OllamaProvider';
import { TGIProvider } from '../providers/TGIProvider';
import { VLLMProvider } from '../providers/VLLMProvider';

/**
 * ModelRouter dispatches generation requests to a selected provider.
 */
export class ModelRouter {
  private providers: Record<string, ModelProvider>;

  constructor(providers?: ModelProvider[]) {
    this.providers = {};
    (providers || [
      new OllamaProvider(),
      new TGIProvider(),
      new VLLMProvider()
    ]).forEach((p) => {
      this.providers[p.name] = p;
    });
  }

  /** Register a new provider at runtime. */
  register(provider: ModelProvider) {
    this.providers[provider.name] = provider;
  }

  /** Route a prompt to the named provider. */
  async generate(providerName: string, model: string, prompt: string): Promise<string> {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`Unknown provider: ${providerName}`);
    }
    return provider.generate(model, prompt);
  }
}
