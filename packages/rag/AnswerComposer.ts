import { DocRecord } from './DocStore';

export interface ModelRouter {
  /**
   * Generate a response for the given prompt.
   */
  generate(prompt: string): Promise<string>;
}

export interface Citation {
  id: string;
  source?: string;
}

export interface AnswerResult {
  answer: string;
  citations: Citation[];
}

/**
 * AnswerComposer generates answers for a query using a ModelRouter and
 * attaches simple citation references for the provided documents.
 */
export class AnswerComposer {
  constructor(private router: ModelRouter) {}

  async compose(question: string, docs: DocRecord[]): Promise<AnswerResult> {
    const contextLines = docs
      .map((d, i) => `[${i + 1}] ${d.text}`)
      .join('\n');
    const prompt = `${contextLines}\n\nQuestion: ${question}\nAnswer:`;
    const answer = await this.router.generate(prompt);
    const citations = docs.map((d) => ({ id: d.id, source: d.source }));
    return { answer, citations };
  }
}

export default AnswerComposer;
